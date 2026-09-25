// Update manager for real-time live updates across Web, Android, and Windows 11 Desktop

export interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseNotes: string[];
  lastChecked: string;
  source: 'service-worker' | 'server-sse' | 'api-poll' | 'none';
}

const LOCAL_VERSION = '1.3.0';
const STORAGE_SEEN_UPDATE_KEY = 'sap_hub_seen_update_version';

type UpdateListener = (info: UpdateInfo) => void;

class LiveUpdateManager {
  private listeners: Set<UpdateListener> = new Set();
  private state: UpdateInfo = {
    hasUpdate: false,
    currentVersion: LOCAL_VERSION,
    latestVersion: LOCAL_VERSION,
    releaseNotes: [
      'Notificações em tempo real com indicador visual no aplicativo para Web, Android e Desktop',
      'Instalador nativo e atalhos otimizados para Windows 11 (Área de Trabalho e Menu Iniciar)',
      'Suporte completo a funcionamento offline sem internet para Windows 11 Desktop, Android e Web',
      'API de Notificações para lembretes diários e proteção da sequência de estudos (streak)',
      'Exclusão de perfis na lixeira com diálogo interno seguro e limpeza de dados locais'
    ],
    lastChecked: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    source: 'none'
  };

  private sse: EventSource | null = null;
  private pollTimer: any = null;
  private waitingWorker: ServiceWorker | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initServiceWorkerListener();
      this.initSSEListener();
      this.startPolling();
    }
  }

  public getState(): UpdateInfo {
    return { ...this.state };
  }

  public subscribe(listener: UpdateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((cb) => {
      try {
        cb(currentState);
      } catch (e) {
        console.error('Update listener error', e);
      }
    });
  }

  // 1. Service Worker update detection (PWA / Android standard)
  private initServiceWorkerListener() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      if (reg.waiting) {
        this.waitingWorker = reg.waiting;
        this.markUpdateAvailable('service-worker');
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.waitingWorker = newWorker;
            this.markUpdateAvailable('service-worker');
          }
        });
      });
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Reload on controller change
      window.location.reload();
    });
  }

  // 2. Server-Sent Events (SSE) for instantaneous push updates
  private initSSEListener() {
    try {
      this.sse = new EventSource('/api/updates/stream');
      
      this.sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.version && data.version !== LOCAL_VERSION) {
            this.state.latestVersion = data.version;
            this.markUpdateAvailable('server-sse');
          }
        } catch {
          // ignore parsing error
        }
      };

      this.sse.onerror = () => {
        // SSE transient error, will retry automatically or fallback to poll
      };
    } catch (e) {
      console.warn('SSE not supported or failed to connect', e);
    }
  }

  // 3. Periodic polling check
  private startPolling() {
    this.pollTimer = setInterval(() => {
      if (navigator.onLine) {
        this.checkForUpdates(false);
      }
    }, 45000); // Check every 45s
  }

  public async checkForUpdates(isManual = true): Promise<boolean> {
    this.state.lastChecked = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // A. Check service worker registration
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
          if (reg.waiting) {
            this.waitingWorker = reg.waiting;
            this.markUpdateAvailable('service-worker');
            return true;
          }
        }
      } catch (e) {
        console.warn('SW check error', e);
      }
    }

    // B. Check /api/version
    try {
      const res = await fetch('/api/version', { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data.releaseNotes && Array.isArray(data.releaseNotes)) {
          this.state.releaseNotes = data.releaseNotes;
        }

        // Compare server version or if server explicitly flagged an update
        if (data.version && data.version !== LOCAL_VERSION) {
          this.state.latestVersion = data.version;
          this.markUpdateAvailable('api-poll');
          return true;
        }
      }
    } catch (e) {
      console.warn('Version check error', e);
    }

    this.notify();
    return this.state.hasUpdate;
  }

  private markUpdateAvailable(source: UpdateInfo['source']) {
    this.state.hasUpdate = true;
    this.state.source = source;
    this.notify();

    // Dispatch custom DOM event in case other components listen
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sap-app-update-available', {
        detail: this.getState()
      }));
    }
  }

  // User explicitly triggers test update to verify visual indicator
  public simulateUpdateForTesting() {
    this.state.hasUpdate = true;
    this.state.latestVersion = '1.3.1-live';
    this.state.source = 'server-sse';
    this.state.releaseNotes = [
      '🚀 Nova versão simulada em tempo real para testes!',
      'Novos exercícios de ABAP OO (Classes Globais e Interfaces)',
      'Melhorias de desempenho e carregamento instantâneo offline'
    ];
    this.notify();
  }

  public applyUpdate() {
    if (this.waitingWorker) {
      this.waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  public dismissBanner() {
    this.state.hasUpdate = false;
    this.notify();
  }
}

export const updateManager = new LiveUpdateManager();
