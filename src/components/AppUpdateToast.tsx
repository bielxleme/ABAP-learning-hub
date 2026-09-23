import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X, Smartphone, ArrowUpCircle } from 'lucide-react';

export const AppUpdateToast: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    // 1. Service Worker update event listener (PWA / Android standard)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) return;

        // Check if there's already a waiting worker
        if (reg.waiting) {
          setUpdateAvailable(true);
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });

      // Listen for controllerchange
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }

    // 2. Periodic version check via timestamp / meta tag if online
    const checkInterval = setInterval(() => {
      if (navigator.onLine) {
        // Ping head of index to detect fresh deployment headers
        fetch('/index.html', { method: 'HEAD', cache: 'no-cache' })
          .then((res) => {
            const etag = res.headers.get('etag');
            const lastMod = res.headers.get('last-modified');
            const savedTag = sessionStorage.getItem('sap_app_etag');
            if (etag && savedTag && savedTag !== etag) {
              setUpdateAvailable(true);
            } else if (etag) {
              sessionStorage.setItem('sap_app_etag', etag);
            }
          })
          .catch(() => {});
      }
    }, 60000); // Check every 60s

    return () => clearInterval(checkInterval);
  }, []);

  const handleApplyUpdate = () => {
    setIsUpdating(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#1b2a4a] text-white p-3.5 sm:p-4 rounded-xl shadow-2xl border-2 border-[#0070f2] flex items-center justify-between gap-3 max-w-md backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#0070f2] flex items-center justify-center shrink-0 shadow-md animate-pulse">
            <RefreshCw className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white">
              <span>Nova Versão Disponível!</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                Live Update
              </span>
            </div>
            <p className="text-[11px] text-blue-200">
              Novas melhorias e exercícios já disponíveis no servidor.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={handleApplyUpdate}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-[#0070f2] hover:bg-[#0863cb] active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1"
          >
            {isUpdating ? (
              <span>Atualizando...</span>
            ) : (
              <>
                <ArrowUpCircle className="w-3.5 h-3.5" />
                <span>Atualizar</span>
              </>
            )}
          </button>

          <button
            onClick={() => setUpdateAvailable(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md"
            title="Ignorar por enquanto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
