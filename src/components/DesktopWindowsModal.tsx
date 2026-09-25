import React, { useState } from 'react';
import { 
  Monitor, 
  Download, 
  Check, 
  X, 
  ShieldCheck, 
  Terminal, 
  ExternalLink, 
  Sparkles,
  Layers,
  ArrowDownToLine,
  Play
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DesktopWindowsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopWindowsModal: React.FC<DesktopWindowsModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadBatchInstaller = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/api/download/windows-installer';
    link.download = 'Instalar-SAP-ABAP-Hub-Windows11.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadStarted(false);
    }, 4000);
  };

  const handleDownloadPowerShellScript = () => {
    const link = document.createElement('a');
    link.href = '/installers/install-windows11.ps1';
    link.download = 'install-windows11.ps1';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#1b2a4a] text-white w-full max-w-xl rounded-xl shadow-2xl border-2 border-sky-500 overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="bg-[#121f36] px-4 py-3 border-b border-[#253961] flex items-center justify-between select-none">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-xs">
              <Monitor className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                <span>Instalador para Computador (Windows 11 / Desktop)</span>
                <span className="bg-sky-400/20 text-sky-300 border border-sky-400/40 text-[10px] font-mono px-1.5 py-0.2 rounded">
                  Win 11 & 10
                </span>
              </div>
              <p className="text-[11px] text-sky-200">
                Execute o aplicativo como software nativo na área de trabalho e barra de tarefas
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

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Windows 11 Advantages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-[#111c30] border border-[#233559] rounded-xl space-y-1">
              <div className="font-bold text-sky-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Janela Nativa</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Sem abas ou barra de URL, funcionando em tela cheia com atalhos de teclado SAP.
              </p>
            </div>

            <div className="p-3 bg-[#111c30] border border-[#233559] rounded-xl space-y-1">
              <div className="font-bold text-sky-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Snap Layouts</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Compatível com divisão de tela e modo multijanelas do Windows 11.
              </p>
            </div>

            <div className="p-3 bg-[#111c30] border border-[#233559] rounded-xl space-y-1">
              <div className="font-bold text-sky-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Offline & Cache</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Inicia instantaneamente mesmo sem conexão com a internet.
              </p>
            </div>
          </div>

          {/* Option 1: Direct 1-Click PWA Installation in Windows 11 */}
          <div className="p-4 bg-gradient-to-r from-sky-950/70 to-blue-950/70 border border-sky-500/40 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-sky-200 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Opção 1: Instalação Instantânea no Windows 11 (Recomendado)</span>
              </div>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-sky-500/30">
                1-Clique
              </span>
            </div>

            <p className="text-xs text-slate-200">
              O Windows 11 permite instalar a aplicação web diretamente como aplicativo nativo através do Microsoft Edge ou Google Chrome, criando atalho automático na Área de Trabalho e no Menu Iniciar.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2">
              {isInstalled ? (
                <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Aplicativo já está instalado no seu computador!</span>
                </div>
              ) : isInstallable ? (
                <button
                  type="button"
                  onClick={() => {
                    install();
                    onClose();
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar Agora no Windows 11</span>
                </button>
              ) : (
                <div className="text-xs text-sky-200/90 bg-sky-900/40 p-2.5 rounded-lg border border-sky-700/50 flex items-start gap-2">
                  <span className="font-bold">Dica no Edge / Chrome:</span>
                  <span>Clique no ícone de instalação <strong className="text-white">(⊕ Instalar App)</strong> que aparece na barra de endereço do navegador.</span>
                </div>
              )}
            </div>
          </div>

          {/* Option 2: Automated Windows 11 Installer Script (.bat) */}
          <div className="p-4 bg-[#111c30] border border-[#2b3e66] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Opção 2: Baixar Instalador Executável Windows 11 (.bat)</span>
              </div>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-amber-500/30">
                Setup Automático
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Gera um script instalador automático que configura a pasta local, baixa o ícone de alta definição do SAP, cria o atalho oficial <strong>&quot;SAP ABAP Learning Hub.lnk&quot;</strong> na sua Área de Trabalho e no Menu Iniciar do Windows 11.
            </p>

            <div className="p-2.5 bg-[#0b1322] border border-slate-700 rounded-lg font-mono text-[11px] text-slate-400 space-y-1">
              <div className="text-emerald-400"># O instalador realiza automaticamente:</div>
              <div>• Cria atalho na Área de Trabalho com ícone SAP</div>
              <div>• Registra no Menu Iniciar do Windows 11</div>
              <div>• Inicia em modo janela independente (--app)</div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadBatchInstaller}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>{downloadStarted ? 'Baixando Instalador...' : 'Baixar Instalador Windows 11 (.bat)'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPowerShellScript}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>Script PowerShell (.ps1)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#121f36] px-4 py-2.5 border-t border-[#233559] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compatível com Windows 11 (Home, Pro, Enterprise e ARM64)</span>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
