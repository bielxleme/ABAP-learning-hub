import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, X, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showBackOnlineToast, setShowBackOnlineToast] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnlineToast(true);
      setIsDismissed(false);
      const timer = setTimeout(() => {
        setShowBackOnlineToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBackOnlineToast(false);
      setIsDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showBackOnlineToast) {
    return (
      <aside aria-label="Notificação de status de conexão" className="fixed bottom-20 md:bottom-5 left-4 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-emerald-400/60 animate-in fade-in slide-in-from-bottom duration-300">
        <CheckCircle2 className="w-4 h-4 text-white" />
        <span>Conexão com a internet restabelecida!</span>
      </aside>
    );
  }

  if (isOnline || isDismissed) return null;

  return (
    <aside 
      aria-label="Aviso de modo offline ativo"
      className="fixed bottom-20 md:bottom-5 left-4 right-4 sm:right-auto z-50 flex items-center justify-between gap-3 rounded-lg bg-slate-900/95 text-white p-3 text-xs shadow-2xl border-2 border-amber-400/80 backdrop-blur-md max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <WifiOff className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <span>Modo Offline Ativo</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
            Sem conexão com a internet? Sem problemas! <strong>Quizzes</strong>, <strong>Editor SE38</strong>, <strong>Simulador</strong> e <strong>Dicionário</strong> funcionam 100% offline.
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors shrink-0"
        title="Ocultar aviso"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
