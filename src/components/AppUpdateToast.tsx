import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X, ArrowUpCircle, Info } from 'lucide-react';
import { updateManager, UpdateInfo } from '../utils/updateManager';

interface AppUpdateToastProps {
  onOpenModal?: () => void;
}

export const AppUpdateToast: React.FC<AppUpdateToastProps> = ({ onOpenModal }) => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>(() => updateManager.getState());
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const unsub = updateManager.subscribe((info) => {
      setUpdateInfo(info);
      if (info.hasUpdate) {
        setIsDismissed(false);
      }
    });
    return unsub;
  }, []);

  const handleApplyUpdate = () => {
    setIsUpdating(true);
    updateManager.applyUpdate();
  };

  if (!updateInfo.hasUpdate || isDismissed) return null;

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#1b2a4a] text-white p-3.5 sm:p-4 rounded-xl shadow-2xl border-2 border-emerald-400 flex items-center justify-between gap-3 max-w-md backdrop-blur-md">
        <div 
          onClick={onOpenModal}
          className="flex items-center space-x-3 cursor-pointer group"
          title="Clique para ver os detalhes da atualização"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md animate-pulse">
            <RefreshCw className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white group-hover:text-emerald-300 transition-colors">
              <span>Nova Versão v{updateInfo.latestVersion}</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                Live
              </span>
            </div>
            <p className="text-[11px] text-blue-200">
              Novas melhorias compiladas em tempo real.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={handleApplyUpdate}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 text-xs font-black rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
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
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
            title="Ignorar por enquanto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
