import React, { useState } from 'react';
import { Download, Smartphone, Check, X, ExternalLink, ShieldCheck, WifiOff, Monitor } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenWindowsInstaller?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenWindowsInstaller,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already running as an installed PWA, render a subtle indicator or nothing
  if (isInstalled) {
    return (
      <div 
        title="Executando no Modo App Mobile Nativo / PWA (Suporte Offline Ativo)"
        className="flex items-center space-x-1.5 px-2 py-1 bg-emerald-950/60 border border-emerald-500/40 rounded text-emerald-300 text-xs font-mono select-none"
      >
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Modo App</span>
      </div>
    );
  }

  return (
    <>
      {/* Primary Install Trigger Button */}
      <button
        id="btn-pwa-install-app"
        onClick={() => {
          if (isInstallable) {
            install();
          } else if (isIOS) {
            setShowIOSModal(true);
          } else {
            setShowAndroidModal(true);
          }
        }}
        title="Instalar App no Celular Android / Desktop PWA"
        className="flex items-center space-x-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded text-xs font-bold shadow-md transition-all active:scale-95 border border-emerald-400/40 cursor-pointer"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
        <span className="whitespace-nowrap">Instalar App Mobile</span>
        <span className="hidden lg:inline bg-black/20 text-[10px] px-1 rounded uppercase font-mono">
          Android
        </span>
      </button>

      {/* Android & PWA Guide Modal */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            {/* Header */}
            <div className="bg-[#1b2a4a] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#0070f2] flex items-center justify-center font-bold text-white shadow-xs">
                  SAP
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">App Mobile SAP ABAP Hub</h3>
                  <p className="text-xs text-blue-200">Instalação Android & Suporte Offline Completo</p>
                </div>
              </div>
              <button
                onClick={() => setShowAndroidModal(false)}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900">
                <ShieldCheck className="w-5 h-5 text-[#0070f2] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Instalação Direta no Celular</h4>
                  <p className="text-xs text-blue-800 mt-0.5">
                    O aplicativo é instalado diretamente como aplicativo nativo na tela inicial do seu celular, com abertura rápida, sem barra de navegação e com armazenamento local dos seus dados e progresso.
                  </p>
                </div>
              </div>

              {/* Step-by-step for Android */}
              <div className="space-y-2.5">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Como instalar no seu celular Android:
                </h5>
                <ol className="space-y-2 text-slate-700 list-decimal list-inside pl-1">
                  <li className="leading-relaxed">
                    No navegador <strong>Google Chrome</strong> do seu celular Android, toque no menu de <strong>três pontos (⋮)</strong> no canto superior direito.
                  </li>
                  <li className="leading-relaxed">
                    Selecione <strong>&quot;Instalar aplicativo&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong>.
                  </li>
                  <li className="leading-relaxed">
                    Confirme em <strong>Instalar</strong>. O ícone oficial do SAP ABAP Hub será criado no seu menu de apps e tela inicial!
                  </li>
                </ol>
              </div>

              {/* 100% Offline Capability Highlight Box */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                  <WifiOff className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Funciona 100% Offline sem Internet</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Não é necessário ter internet para utilizar o aplicativo! Todos os <strong>Quizzes</strong>, <strong>Desafios de Código</strong>, <strong>Simulador SE38</strong>, <strong>Dicionário SE11</strong> e <strong>Histórico de Progresso</strong> funcionam de forma totalmente autônoma e offline.
                </p>
              </div>

              {/* Windows 11 Note */}
              {onOpenWindowsInstaller && (
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sky-900 text-xs">
                    <Monitor className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Está no computador? Use o instalador para Windows 11.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAndroidModal(false);
                      onOpenWindowsInstaller();
                    }}
                    className="text-xs text-sky-700 hover:text-sky-900 font-bold underline shrink-0 cursor-pointer ml-2"
                  >
                    Abrir Windows 11
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAndroidModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Fechar
                </button>
                {isInstallable && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAndroidModal(false);
                      install();
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Instalar Agora</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-800">
            <h3 className="text-base font-bold text-slate-900">Instalar no iPhone / iPad</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              1. Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima) na barra do Safari.<br />
              2. Role a lista para baixo e toque em <strong>Adicionar à Tela de Início</strong>.<br />
              3. Toque em <strong>Adicionar</strong> no canto superior direito.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full rounded-lg bg-slate-100 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
