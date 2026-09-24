import React, { useState } from 'react';
import { 
  Code2, 
  HelpCircle, 
  Bot, 
  Award, 
  BookOpen, 
  Flame, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Search, 
  ChevronRight,
  UserCheck,
  LogOut,
  User,
  Sun,
  Moon,
  UserPlus
} from 'lucide-react';
import { UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  toggleSound: () => void;
  onOpenLogon: () => void;
  onOpenGlossary?: () => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  toggleSound,
  onOpenLogon,
  onOpenGlossary,
  theme = 'light',
  toggleTheme,
}) => {
  const [okCode, setOkCode] = useState('');

  const handleOkCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = okCode.trim().toUpperCase();
    if (cmd === '/NSE38' || cmd === 'SE38' || cmd === '/NEDITOR' || cmd === 'EDITOR') {
      setActiveTab('editor');
    } else if (cmd === '/NQUIZ' || cmd === 'QUIZ' || cmd === '/NTEST' || cmd === 'TEST') {
      setActiveTab('quiz');
    } else if (cmd === '/NCHAT' || cmd === 'CHAT' || cmd === '/NIA' || cmd === 'IA') {
      setActiveTab('chat');
    } else if (cmd === '/NSTATS' || cmd === 'STATS' || cmd === '/NPERFIL' || cmd === 'PERFIL') {
      setActiveTab('progress');
    } else if (cmd === '/NSE11' || cmd === 'SE11' || cmd === '/NHELP' || cmd === 'HELP') {
      setActiveTab('reference');
    } else if (cmd === 'GLOSSARIO' || cmd === '/NGLOSSARIO' || cmd === 'GLOSSARY' || cmd === '*' || cmd === '/N*') {
      if (onOpenGlossary) onOpenGlossary();
    }
    setOkCode('');
  };

  const nextLevelXp = userProfile.level * 300;
  const currentLevelBaseXp = (userProfile.level - 1) * 300;
  const progressInLevel = Math.min(100, Math.max(0, ((userProfile.xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100));

  return (
    <header className="bg-[#1b2a4a] text-white border-b border-[#2d4373] shadow-md sticky top-0 z-50 w-full max-w-full overflow-x-hidden">
      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Brand + Transaction code input */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2 bg-[#0070f2] text-white px-2.5 py-1 rounded font-bold tracking-wider text-sm shadow-sm">
            <span className="text-white font-extrabold text-base tracking-tighter">SAP</span>
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded font-mono">ABAP</span>
          </div>

          <div>
            <h1 className="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-1.5">
              <span>Learning Hub</span>
              <span className="hidden md:inline text-xs font-normal text-blue-200 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-full">
                Gamificado 7.40+
              </span>
            </h1>
          </div>

          {/* SAP Transaction Bar (OK Code simulator) */}
          <form onSubmit={handleOkCodeSubmit} className="hidden sm:flex items-center">
            <div className="relative flex items-center">
              <span className="absolute left-2 text-xs font-mono text-slate-400 select-none">/n</span>
              <input
                id="sap-okcode-input"
                type="text"
                placeholder="SE38..."
                value={okCode}
                onChange={(e) => setOkCode(e.target.value)}
                title="Digite transações SAP como SE38, QUIZ, CHAT, SE11, STATS"
                className="w-24 focus:w-36 transition-all duration-200 bg-[#0f1b33] border border-[#374e7e] rounded text-xs pl-7 pr-2 py-1 font-mono text-emerald-300 focus:outline-none focus:ring-1 focus:ring-[#0070f2] placeholder:text-slate-500"
              />
            </div>
          </form>
        </div>

        {/* Right: User Profile, Logon Switch, Badges & Sound */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* PWA / Android Mobile Install Button */}
          <PWAInstallButton />

          {/* User Account Pill & Switch User */}
          <button
            onClick={onOpenLogon}
            title={userProfile.isGuest ? 'Você está como Convidado. Clique para Criar Conta ou Fazer Login!' : 'Trocar de Usuário / Criar Nova Conta no SAP GUI'}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer group shadow-2xs ${
              userProfile.isGuest
                ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-200'
                : 'bg-blue-950/70 hover:bg-blue-900 border border-blue-600/50'
            }`}
          >
            <span className="text-base">{userProfile.avatar || (userProfile.isGuest ? '👤' : '👩‍💻')}</span>
            <div className="text-left font-mono max-w-[120px] sm:max-w-[170px]">
              <span className="font-bold text-white group-hover:text-blue-300 block truncate flex items-center gap-1">
                <span>{userProfile.name}</span>
                {userProfile.isGuest && (
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1 rounded">
                    Convidado
                  </span>
                )}
              </span>
              <span className="text-[10px] text-emerald-300 block -mt-0.5 truncate font-sans font-medium" title={userProfile.rankTitle}>
                {userProfile.isGuest ? 'Clique para Criar Conta' : userProfile.rankTitle}
              </span>
            </div>
            {userProfile.isGuest ? (
              <UserPlus className="w-3.5 h-3.5 text-amber-300 ml-1 shrink-0" />
            ) : (
              <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 ml-1 shrink-0" />
            )}
          </button>

          {/* Streak */}
          <div 
            title={`Sequência de estudos ativa: ${userProfile.streakDays} dias seguidos (Resolva 1 exercício por dia para ganhar XP bônus!)`}
            className="flex items-center space-x-1 px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded text-xs font-medium"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-pulse" />
            <span>{userProfile.streakDays}d</span>
          </div>

          {/* XP & Level progress */}
          <div 
            onClick={() => setActiveTab('progress')}
            className="cursor-pointer flex items-center space-x-2 px-2.5 py-1 bg-blue-900/40 border border-blue-600/40 hover:bg-blue-800/50 transition-colors rounded text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="font-bold text-slate-200">Nível {userProfile.level}</span>
            <span className="text-blue-300 font-mono">({userProfile.xp} XP)</span>
            <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressInLevel}%` }}
              />
            </div>
          </div>

          {/* Global Light / Dark Theme Toggle */}
          {toggleTheme && (
            <button
              id="btn-toggle-theme"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Mudar para Tema Claro (Light)' : 'Mudar para Tema Escuro (Dark)'}
              className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-sky-300 hover:-rotate-12 transition-transform" />
              )}
            </button>
          )}

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={toggleSound}
            title={userProfile.soundEnabled ? 'Silenciar sons' : 'Ativar efeitos sonoros'}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
          >
            {userProfile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar - Quizzes & Challenges First (Desktop Navigation, Mobile uses BottomNav) */}
      <div className="bg-[#121f36] border-t border-[#24375b] px-4 sm:px-6 lg:px-8 hidden md:block">
        <nav className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none text-xs sm:text-sm font-medium">
          {/* TAB 1: QUIZZES & DESAFIOS (PRIMARY FOCUS) */}
          <button
            id="tab-quiz"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-t transition-all whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-[#1b2a4a] text-[#5bb2ff] border-b-2 border-[#0070f2] font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">Quizzes & Desafios</span>
            <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
              Principal
            </span>
          </button>

          {/* TAB 2: EDITOR ABAP (SE38) */}
          <button
            id="tab-editor"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-t transition-all whitespace-nowrap ${
              activeTab === 'editor'
                ? 'bg-[#1b2a4a] text-[#5bb2ff] border-b-2 border-[#0070f2] font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>Editor ABAP (SE38)</span>
          </button>

          {/* TAB 3: MENTOR IA */}
          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-t transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-[#1b2a4a] text-[#5bb2ff] border-b-2 border-[#0070f2] font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>SAP Mentor IA</span>
          </button>

          {/* TAB 4: PROGRESSO */}
          <button
            id="tab-progress"
            onClick={() => setActiveTab('progress')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-t transition-all whitespace-nowrap ${
              activeTab === 'progress'
                ? 'bg-[#1b2a4a] text-[#5bb2ff] border-b-2 border-[#0070f2] font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Progresso & Badges</span>
            {userProfile.badges.length > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-[11px] px-1.5 py-0.2 rounded-full border border-amber-500/30">
                {userProfile.badges.length}
              </span>
            )}
          </button>

          {/* TAB 5: DICIONÁRIO & LINKS */}
          <button
            id="tab-reference"
            onClick={() => setActiveTab('reference')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-t transition-all whitespace-nowrap ${
              activeTab === 'reference'
                ? 'bg-[#1b2a4a] text-[#5bb2ff] border-b-2 border-[#0070f2] font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Dicionário & Links SAP</span>
          </button>

          {/* CENTRALIZED SEARCHABLE GLOSSARY OVERLAY */}
          {onOpenGlossary && (
            <button
              onClick={onOpenGlossary}
              title="Abrir Glossário Centralizado de Termos ABAP com Asterisco (*)"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-t text-amber-300 hover:text-amber-200 hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer ml-auto sm:ml-2"
            >
              <div className="w-4 h-4 bg-[#0070f2] rounded-xs flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-2xs">
                *
              </div>
              <span className="font-semibold text-xs sm:text-sm">Glossário Geral (*)</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
