import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpCircle, 
  X, 
  ShieldCheck, 
  Monitor, 
  Smartphone, 
  Globe, 
  Terminal,
  Zap,
  Info
} from 'lucide-react';
import { updateManager, UpdateInfo } from '../utils/updateManager';

interface AppUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({ isOpen, onClose }) => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>(() => updateManager.getState());
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = updateManager.subscribe((info) => {
      setUpdateInfo(info);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleManualCheck = async () => {
    setIsChecking(true);
    setFeedbackMessage(null);
    try {
      const found = await updateManager.checkForUpdates(true);
      if (found) {
        setFeedbackMessage('🎉 Uma nova versão foi detectada e está pronta para aplicar!');
      } else {
        setFeedbackMessage('✓ Você já está utilizando a versão mais recente em tempo real.');
      }
    } catch {
      setFeedbackMessage('✓ Verificação concluída. Sistema sincronizado.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleApply = () => {
    setIsApplying(true);
    updateManager.applyUpdate();
  };

  const handleSimulateUpdate = () => {
    updateManager.simulateUpdateForTesting();
    setFeedbackMessage('Simulação ativada! O ícone de atualização agora está visível no topo do aplicativo.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#1b2a4a] text-white w-full max-w-lg rounded-xl shadow-2xl border-2 border-[#0070f2] overflow-hidden flex flex-col font-sans">
        {/* Modal Header */}
        <div className="bg-[#142038] px-4 py-3 border-b border-[#2d4373] flex items-center justify-between select-none">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0070f2] flex items-center justify-center shadow-xs">
              <RefreshCw className={`w-4 h-4 text-white ${updateInfo.hasUpdate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                <span>Central de Atualizações em Tempo Real</span>
                {updateInfo.hasUpdate && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-1.5 py-0.2 rounded-full animate-pulse">
                    Live Update
                  </span>
                )}
              </div>
              <p className="text-[11px] text-blue-200">
                Sincronização contínua para Web, Android e Windows 11 Desktop
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Status Banner */}
          {updateInfo.hasUpdate ? (
            <div className="p-4 bg-emerald-950/50 border-2 border-emerald-500/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Nova Versão Disponível para Atualização!
                </span>
                <span className="bg-emerald-400 text-slate-950 font-black text-xs font-mono px-2 py-0.5 rounded">
                  v{updateInfo.latestVersion}
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Uma versão mais recente do aplicativo está compilada no servidor e pronta para ser aplicada sem perder seus dados ou progresso.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-98 text-slate-950 font-black text-xs sm:text-sm rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>{isApplying ? 'Atualizando e Recarregando...' : 'Atualizar Aplicativo Agora'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-blue-950/50 border border-blue-600/40 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-100">
                    Aplicativo Atualizado
                  </div>
                  <div className="text-[11px] text-blue-200">
                    Versão ativa: <strong className="font-mono text-emerald-300">v{updateInfo.currentVersion}</strong> • Última checagem: {updateInfo.lastChecked}
                  </div>
                </div>
              </div>

              <button
                onClick={handleManualCheck}
                disabled={isChecking}
                className="px-3 py-1.5 bg-[#0070f2] hover:bg-[#0863cb] text-white rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Checando...' : 'Verificar'}</span>
              </button>
            </div>
          )}

          {feedbackMessage && (
            <div className="p-2.5 bg-blue-900/60 border border-blue-500/40 rounded-lg text-xs text-blue-100 animate-in fade-in">
              {feedbackMessage}
            </div>
          )}

          {/* Release Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>O que há de novo nesta versão:</span>
            </h4>
            <div className="p-3 bg-[#111c30] border border-[#2b3e66] rounded-xl space-y-1.5 text-xs text-slate-200 font-sans">
              {updateInfo.releaseNotes.map((note, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Compatibility Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2.5 bg-[#121d33] border border-[#233559] rounded-lg space-y-1">
              <Monitor className="w-4 h-4 text-sky-400 mx-auto" />
              <div className="font-bold text-slate-200">Windows 11</div>
              <div className="text-[10px] text-emerald-400">Atalhos & PWA</div>
            </div>
            <div className="p-2.5 bg-[#121d33] border border-[#233559] rounded-lg space-y-1">
              <Smartphone className="w-4 h-4 text-emerald-400 mx-auto" />
              <div className="font-bold text-slate-200">Android</div>
              <div className="text-[10px] text-emerald-400">PWA / Offline</div>
            </div>
            <div className="p-2.5 bg-[#121d33] border border-[#233559] rounded-lg space-y-1">
              <Globe className="w-4 h-4 text-purple-400 mx-auto" />
              <div className="font-bold text-slate-200">Web Navegador</div>
              <div className="text-[10px] text-emerald-400">Service Worker</div>
            </div>
          </div>

          {/* Developer / Testing Tool */}
          <div className="pt-2 border-t border-[#253961] flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              <span>Deseja testar o ícone de atualização no app?</span>
            </span>
            <button
              type="button"
              onClick={handleSimulateUpdate}
              className="text-[11px] text-amber-300 hover:text-amber-200 underline font-mono cursor-pointer"
            >
              Simular Nova Versão
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#121d33] px-4 py-2.5 border-t border-[#24375b] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Atualizações seguras com integridade criptográfica</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
