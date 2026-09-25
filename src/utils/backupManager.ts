import { AppUserDataBackup, CloudBackupSummary, UserProfile, UserAnswerHistory } from '../types';

const STORAGE_USERS_KEY = 'sap_abap_users_directory_v1';
const STORAGE_ACTIVE_USER_KEY = 'sap_abap_active_username_v1';
const LAST_CLOUD_SYNC_KEY = 'sap_abap_last_cloud_sync_timestamp';

/**
 * Creates a complete snapshot of the user's data for backup.
 */
export function assembleBackupData(
  profile: UserProfile,
  answerHistory: UserAnswerHistory[],
  currentCode: string,
  theme?: 'light' | 'dark'
): AppUserDataBackup {
  let allUsers: UserProfile[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (raw) {
      allUsers = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse all users list for backup', e);
  }

  return {
    version: '1.3.0',
    backupDate: new Date().toISOString(),
    username: profile.name,
    email: profile.email || 'bielxleme@gmail.com',
    profile,
    answerHistory,
    currentCode,
    theme: theme || 'light',
    allUsersList: allUsers.length > 0 ? allUsers : [profile],
  };
}

/**
 * Persists restored backup into localStorage and updates active session.
 */
export function applyRestoredBackup(
  backup: AppUserDataBackup,
  onUserLoaded?: (profile: UserProfile) => void
): boolean {
  try {
    const username = backup.profile.name || backup.username;
    if (!username) {
      throw new Error('Nome de usuário não encontrado no arquivo de backup.');
    }

    // 1. Save profile
    localStorage.setItem(`sap_abap_user_${username}_profile`, JSON.stringify(backup.profile));

    // 2. Save history
    localStorage.setItem(`sap_abap_user_${username}_history`, JSON.stringify(backup.answerHistory || []));

    // 3. Save ABAP editor code
    if (backup.currentCode) {
      localStorage.setItem(`sap_abap_user_${username}_code`, backup.currentCode);
    }

    // 4. Save theme if provided
    if (backup.theme) {
      localStorage.setItem('sap_abap_theme', backup.theme);
      document.documentElement.classList.toggle('dark', backup.theme === 'dark');
    }

    // 5. Update users directory
    let existingUsers: UserProfile[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      if (raw) {
        existingUsers = JSON.parse(raw);
      }
    } catch {}

    const index = existingUsers.findIndex(
      (u) => u.name.toUpperCase() === username.toUpperCase()
    );

    if (index >= 0) {
      existingUsers[index] = backup.profile;
    } else {
      existingUsers.push(backup.profile);
    }

    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(existingUsers));

    // 6. Set active user
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, username);
    localStorage.setItem(LAST_CLOUD_SYNC_KEY, new Date().toISOString());

    if (onUserLoaded) {
      onUserLoaded(backup.profile);
    }

    return true;
  } catch (err) {
    console.error('Failed to apply restored backup', err);
    return false;
  }
}

/**
 * Saves current user backup snapshot to the cloud backend.
 */
export async function saveBackupToCloud(
  backupData: AppUserDataBackup
): Promise<{ success: boolean; message: string; savedAt: string }> {
  try {
    const res = await fetch('/api/backup/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backupData),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Erro HTTP ${res.status}`);
    }

    const json = await res.json();
    localStorage.setItem(LAST_CLOUD_SYNC_KEY, json.savedAt || new Date().toISOString());

    return {
      success: true,
      message: 'Progresso sincronizado com a nuvem com sucesso! Ao reinstalar o aplicativo, seus dados estarão seguros.',
      savedAt: json.savedAt || new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Erro ao salvar backup na nuvem:', error);
    return {
      success: false,
      message: error?.message || 'Falha ao conectar com o serviço de backup na nuvem.',
      savedAt: '',
    };
  }
}

/**
 * Retrieves a specific user's backup from the cloud server.
 */
export async function fetchCloudBackup(
  username: string
): Promise<AppUserDataBackup | null> {
  try {
    const res = await fetch('/api/backup/restore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json.backup as AppUserDataBackup;
  } catch (error) {
    console.error('Erro ao buscar backup na nuvem:', error);
    return null;
  }
}

/**
 * Lists all available cloud backups saved on the server.
 */
export async function listCloudBackups(): Promise<CloudBackupSummary[]> {
  try {
    const res = await fetch('/api/backup/list');
    if (!res.ok) return [];
    const json = await res.json();
    return json.backups || [];
  } catch (error) {
    console.error('Erro ao listar backups na nuvem:', error);
    return [];
  }
}

/**
 * Exports data to a physical .json file downloaded to the user's device.
 */
export function exportBackupToFile(backupData: AppUserDataBackup): void {
  const sanitizedName = (backupData.username || 'usuario').replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `sap-abap-backup-${sanitizedName}-${dateStr}.json`;

  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: 'application/json;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads and parses an uploaded JSON backup file.
 */
export function importBackupFromFile(file: File): Promise<AppUserDataBackup> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.json')) {
      return reject(new Error('Por favor selecione um arquivo de backup com extensão .json válido.'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.profile || !parsed.profile.name) {
          throw new Error('Estrutura de backup inválida: perfil de usuário não encontrado.');
        }

        resolve(parsed as AppUserDataBackup);
      } catch (err: any) {
        reject(new Error(`Falha ao ler o arquivo de backup: ${err?.message || 'Arquivo corrompido'}`));
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo do dispositivo.'));
    reader.readAsText(file);
  });
}

/**
 * Auto-syncs backup to the cloud silently when online (with throttle).
 */
let lastSyncTime = 0;
export async function autoSyncBackupIfOnline(
  backupData: AppUserDataBackup
): Promise<boolean> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }

  // Throttle to at most once every 15 seconds
  const now = Date.now();
  if (now - lastSyncTime < 15000) {
    return false;
  }
  lastSyncTime = now;

  try {
    const res = await saveBackupToCloud(backupData);
    return res.success;
  } catch {
    return false;
  }
}

/**
 * Requests browser persistent storage to prevent automatic eviction.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        const granted = await navigator.storage.persist();
        console.log(`[Storage] Persistência concedida pelo navegador: ${granted}`);
        return granted;
      }
      return isPersisted;
    } catch (e) {
      console.warn('[Storage] Não foi possível solicitar storage persistente:', e);
    }
  }
  return false;
}

/**
 * Formats ISO date into human-readable Portuguese timestamp.
 */
export function formatBackupDate(isoString?: string): string {
  if (!isoString) return 'Nunca sincronizado';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}
