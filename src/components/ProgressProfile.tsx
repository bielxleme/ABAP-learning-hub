import React, { useState, useMemo, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Edit2, 
  Sparkles, 
  BookOpen, 
  Check, 
  Layers, 
  CheckCircle2, 
  Star,
  Shield,
  Crown,
  Zap,
  TrendingUp,
  AlertTriangle,
  Mail,
  Lock,
  ExternalLink,
  Clock,
  BrainCircuit,
  Smile,
  ShieldAlert,
  ChevronRight,
  Swords,
  Bell,
  BellRing,
  Cloud,
  CloudDownload,
  CloudUpload,
  Download,
  FileUp,
  RefreshCw,
  Smartphone,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import { UserProfile, UserAnswerHistory, UserErrorRecord, RpgRace, AppUserDataBackup } from '../types';
import { INITIAL_BADGES } from '../data/sapReference';
import { ErrorDiagnosticPanel } from './ErrorDiagnosticPanel';
import { analyzeUserBehavior } from '../utils/userBehaviorAnalyzer';
import { RPG_RACES, getRpgClassForLevel, ALL_RPG_RACES } from '../data/rpgAvatars';
import { RpgAvatarRenderer } from './RpgAvatarRenderer';
import { sendStudyReminder } from '../utils/notificationService';
import {
  assembleBackupData,
  saveBackupToCloud,
  exportBackupToFile,
  importBackupFromFile,
  applyRestoredBackup,
  formatBackupDate
} from '../utils/backupManager';

interface ProgressProfileProps {
  userProfile: UserProfile;
  onUpdateProfileName: (newName: string) => void;
  onEquipTitle?: (title: string | 'auto') => void;
  onUpdateRpgRace?: (newRace: RpgRace) => void;
  answerHistory: UserAnswerHistory[];
  onResetProgress: () => void;
  onPracticeTopic?: (category: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION') => void;
  onClearResolvedErrors?: () => void;
  onOpenNotificationSettings?: () => void;
  currentCode?: string;
  onRestoreBackup?: (backup: AppUserDataBackup) => void;
  initialTab?: 'overview' | 'behavior' | 'rpg' | 'diagnostics' | 'history' | 'backup';
}

export const ProgressProfile: React.FC<ProgressProfileProps> = ({
  userProfile,
  onUpdateProfileName,
  onEquipTitle,
  onUpdateRpgRace,
  answerHistory,
  onResetProgress,
  onPracticeTopic,
  onClearResolvedErrors,
  onOpenNotificationSettings,
  currentCode,
  onRestoreBackup,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'behavior' | 'rpg' | 'diagnostics' | 'history' | 'backup'>(initialTab || 'overview');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'correct' | 'wrong'>('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [testNotifMessage, setTestNotifMessage] = useState<string | null>(null);

  // Backup & Cloud Sync States
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('sap_abap_last_cloud_sync_timestamp') : null;
  });

  const handleManualCloudSync = async () => {
    setIsSyncing(true);
    setSyncStatusMessage(null);
    try {
      const backupData = assembleBackupData(userProfile, answerHistory, currentCode || '', undefined);
      const res = await saveBackupToCloud(backupData);
      if (res.success) {
        setSyncStatusMessage('✅ Backup sincronizado com sucesso na nuvem! Se você desinstalar e reinstalar o app, poderá restaurar seu perfil imediatamente.');
        setLastSyncDate(res.savedAt);
      } else {
        setSyncStatusMessage(`❌ ${res.message}`);
      }
    } catch (err: any) {
      setSyncStatusMessage(`❌ Erro ao sincronizar: ${err?.message || 'Falha de conexão'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportJson = () => {
    const backupData = assembleBackupData(userProfile, answerHistory, currentCode || '', undefined);
    exportBackupToFile(backupData);
    setSyncStatusMessage('📥 Arquivo de backup exportado! Salve-o no seu dispositivo ou Google Drive para guardar uma cópia física.');
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const backup = await importBackupFromFile(file);
      if (onRestoreBackup) {
        onRestoreBackup(backup);
      } else {
        applyRestoredBackup(backup);
      }
      setSyncStatusMessage('✅ Backup importado com sucesso! Dados, progresso e histórico atualizados.');
    } catch (err: any) {
      setSyncStatusMessage(`❌ Erro ao importar arquivo: ${err?.message}`);
    } finally {
      e.target.value = '';
    }
  };

  const heroRace: RpgRace = userProfile.rpgRace || 'guerreiro';
  const raceMeta = RPG_RACES[heroRace] || RPG_RACES.guerreiro;
  const currentHeroClass = getRpgClassForLevel(heroRace, userProfile.level);

  // Behavioral Pattern Analysis
  const behaviorSummary = useMemo(() => {
    return analyzeUserBehavior(userProfile, answerHistory, userProfile.errorLogs || []);
  }, [userProfile, answerHistory]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateProfileName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const nextLevelXp = userProfile.level * 300;
  const currentLevelBaseXp = (userProfile.level - 1) * 300;
  const xpInLevel = userProfile.xp - currentLevelBaseXp;
  const xpNeeded = nextLevelXp - currentLevelBaseXp;
  const progressPct = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));

  const filteredHistory = answerHistory.filter((h) => {
    if (historyFilter === 'correct') return h.isCorrect;
    if (historyFilter === 'wrong') return !h.isCorrect;
    return true;
  });

  // Collect all unlocked titles
  const availableUnlockedTitles = useMemo(() => {
    const titlesSet = new Set<string>();
    titlesSet.add('Estagiária ABAP (SE38)');
    
    // XP based titles
    if (userProfile.xp >= 200) titlesSet.add('Desenvolvedora ABAP Júnior');
    if (userProfile.xp >= 500) titlesSet.add('Consultora ABAP Pleno');
    if (userProfile.xp >= 1000) titlesSet.add('Especialista ABAP Sênior');
    if (userProfile.xp >= 1800) titlesSet.add('Arquiteta SAP & Mestre em ABAP');
    if (userProfile.xp >= 2500) titlesSet.add('Especialista em Formulários & Spool');
    if (userProfile.xp >= 3200) titlesSet.add('Grã-Mestra em ABAP OO & Design Patterns');

    // Badge based unlocked titles
    INITIAL_BADGES.forEach((b) => {
      if (userProfile.badges.includes(b.id) && b.unlockedTitle) {
        titlesSet.add(b.unlockedTitle);
      }
    });

    if (userProfile.unlockedTitles) {
      userProfile.unlockedTitles.forEach((t) => titlesSet.add(t));
    }

    return Array.from(titlesSet);
  }, [userProfile.badges, userProfile.xp, userProfile.unlockedTitles]);

  const isAutoTitle = !userProfile.equippedTitle || userProfile.equippedTitle === 'auto';

  // Dynamic Visual Progression by Level (supports up to Level 7)
  const levelTheme = useMemo(() => {
    switch (userProfile.level) {
      case 1:
        return {
          bannerBg: 'bg-gradient-to-r from-[#1b2a4a] to-[#253965]',
          borderClass: 'border border-[#304875] shadow-md',
          badgePill: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
          avatarRing: 'bg-gradient-to-tr from-blue-500 to-emerald-400 p-0.5',
          levelLabel: 'Nível 1: Fundamentos ABAP & NetWeaver',
          rankCrest: '🔰',
          glowStyle: '',
        };
      case 2:
        return {
          bannerBg: 'bg-gradient-to-r from-[#0a2738] via-[#0e3b4a] to-[#0c473d]',
          borderClass: 'border-2 border-emerald-400/80 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-400/30',
          badgePill: 'bg-emerald-400/30 text-emerald-200 border border-emerald-400/70 font-bold',
          avatarRing: 'bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 p-1 shadow-lg shadow-emerald-500/30',
          levelLabel: 'Nível 2: Dicionário de Dados SE11 & Open SQL',
          rankCrest: '🛡️',
          glowStyle: 'relative overflow-hidden before:absolute before:-right-10 before:-top-10 before:w-44 before:h-44 before:bg-emerald-500/15 before:rounded-full before:blur-2xl',
        };
      case 3:
        return {
          bannerBg: 'bg-gradient-to-r from-[#181d2a] via-[#33240e] to-[#1a1104]',
          borderClass: 'border-2 border-amber-400 shadow-2xl shadow-amber-500/30 ring-2 ring-amber-400/50',
          badgePill: 'bg-amber-400/30 text-amber-200 border border-amber-400/80 font-bold text-shadow',
          avatarRing: 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 p-1 ring-2 ring-amber-400 shadow-xl shadow-amber-500/40',
          levelLabel: 'Nível 3: Consultora em ITABs & Loops',
          rankCrest: '👑',
          glowStyle: 'relative overflow-hidden before:absolute before:-right-10 before:-top-10 before:w-56 before:h-56 before:bg-amber-500/20 before:rounded-full before:blur-2xl',
        };
      case 4:
        return {
          bannerBg: 'bg-gradient-to-r from-[#1c0e33] via-[#35104f] to-[#130722]',
          borderClass: 'border-2 border-fuchsia-400 shadow-2xl shadow-purple-500/40 ring-2 ring-fuchsia-400/60',
          badgePill: 'bg-fuchsia-400/30 text-fuchsia-200 border border-fuchsia-400/80 font-bold',
          avatarRing: 'bg-gradient-to-tr from-purple-400 via-pink-400 to-indigo-400 p-1 ring-2 ring-fuchsia-300 shadow-2xl shadow-purple-500/50',
          levelLabel: 'Nível 4: Arquiteta em Modularização & BAPIs',
          rankCrest: '💎',
          glowStyle: 'relative overflow-hidden before:absolute before:-right-10 before:-top-10 before:w-64 before:h-64 before:bg-fuchsia-500/25 before:rounded-full before:blur-3xl',
        };
      case 5:
        return {
          bannerBg: 'bg-gradient-to-r from-[#090714] via-[#261304] to-[#1c0524]',
          borderClass: 'border-2 border-amber-300 shadow-2xl shadow-amber-400/50 ring-4 ring-amber-400/70',
          badgePill: 'bg-gradient-to-r from-amber-400/40 to-yellow-300/40 text-amber-100 border border-amber-300 font-extrabold',
          avatarRing: 'bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-500 p-1.5 ring-4 ring-amber-300 shadow-2xl shadow-amber-400/60',
          levelLabel: 'Nível 5: Mestre SAP S/4HANA & Clean ABAP',
          rankCrest: '🏆',
          glowStyle: 'relative overflow-hidden before:absolute before:-right-12 before:-top-12 before:w-80 before:h-80 before:bg-gradient-to-br before:from-amber-500/30 before:to-red-500/20 before:rounded-full before:blur-3xl',
        };
      case 6:
        return {
          bannerBg: 'bg-gradient-to-r from-[#200511] via-[#4c0519] to-[#1a040b]',
          borderClass: 'border-2 border-rose-400 shadow-2xl shadow-rose-500/50 ring-4 ring-rose-400/70',
          badgePill: 'bg-gradient-to-r from-rose-500/40 to-red-400/40 text-rose-100 border border-rose-300 font-extrabold',
          avatarRing: 'bg-gradient-to-tr from-rose-400 via-pink-300 to-rose-600 p-1.5 ring-4 ring-rose-300 shadow-2xl shadow-rose-500/60',
          levelLabel: 'Nível 6: Mestra de Formulários & Tradução SE63',
          rankCrest: '📜',
          glowStyle: 'relative overflow-hidden before:absolute before:-right-12 before:-top-12 before:w-80 before:h-80 before:bg-gradient-to-br before:from-rose-500/30 before:to-red-600/30 before:rounded-full before:blur-3xl',
        };
      default: // Level 7+
        return {
          bannerBg: 'bg-gradient-to-r from-[#17092b] via-[#3b0764] to-[#120324]',
          borderClass: 'border-2 border-purple-300 shadow-2xl shadow-purple-400/60 ring-4 ring-purple-400/80',
          badgePill: 'bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-yellow-300/40 text-purple-100 border border-purple-300 font-extrabold',
          avatarRing: 'bg-gradient-to-tr from-purple-300 via-fuchsia-300 to-amber-400 p-1.5 ring-4 ring-purple-300 shadow-2xl shadow-purple-400/70',
          levelLabel: 'Nível 7: Grã-Mestra Suprema em ABAP OO & Design Patterns',
          rankCrest: '🧙‍♀️',
          glowStyle: 'relative overflow-hidden before:absolute before:-right-12 before:-top-12 before:w-80 before:h-80 before:bg-gradient-to-br before:from-purple-500/40 before:to-pink-500/30 before:rounded-full before:blur-3xl',
        };
    }
  }, [userProfile.level]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Dynamic Visual Progression per Level with RPG Avatar display */}
      <div className={`${levelTheme.bannerBg} ${levelTheme.borderClass} ${levelTheme.glowStyle} text-white rounded-xl p-5 sm:p-6 transition-all duration-300`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* User Details */}
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${levelTheme.avatarRing} flex items-center justify-center shrink-0`}>
              <div className="w-full h-full bg-[#16233d] rounded-full flex items-center justify-center overflow-hidden shadow-inner">
                <RpgAvatarRenderer race={heroRace} level={userProfile.level} size="md" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="bg-slate-900 border border-blue-400 rounded px-2 py-0.5 text-sm font-semibold text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2 py-1 rounded font-semibold"
                    >
                      Salvar
                    </button>
                  </form>
                ) : (
                  <>
                    <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                      <span>{userProfile.name}</span>
                      <span className="text-xl" title={levelTheme.levelLabel}>
                        {levelTheme.rankCrest}
                      </span>
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-blue-300 hover:text-white p-1 cursor-pointer"
                      title="Editar nome"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className={`${levelTheme.badgePill} text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1`}>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {userProfile.rankTitle}
                </span>

                <span className="text-xs bg-purple-950/70 text-purple-200 border border-purple-500/40 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <span>{raceMeta.iconEmoji}</span>
                  <span>Classe: <strong>{currentHeroClass.title}</strong></span>
                </span>

                <span className="text-blue-200 text-xs flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {userProfile.streakDays} dias de streak
                </span>

                {userProfile.googleLinked && (
                  <span className="text-[10px] bg-red-500/20 text-red-200 border border-red-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Mail className="w-3 h-3 text-red-300" />
                    Conta Google Vinculada
                  </span>
                )}
              </div>

              <div className="text-[11px] text-blue-200/80 pt-0.5 font-medium">
                {levelTheme.levelLabel}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-4 sm:space-x-6 bg-slate-900/60 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-yellow-300 font-mono">{userProfile.xp}</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Total XP</div>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-blue-300 font-mono">Nível {userProfile.level}</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Graduação</div>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-mono">
                {userProfile.completedQuestionIds.length}
              </div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Concluídos</div>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-5 space-y-1.5 pt-4 border-t border-white/10">
          <div className="flex justify-between text-xs font-semibold text-blue-200">
            <span>Evolução para Nível {Math.min(7, userProfile.level + 1)}</span>
            <span>
              {xpInLevel} / {xpNeeded} XP ({Math.round(progressPct)}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-300 transition-all duration-700 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-1 text-xs sm:text-sm font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-b-2 border-[#0070f2] text-[#0070f2] bg-blue-50/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Visão Geral & Medalhas ({userProfile.badges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('behavior')}
          className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'behavior'
              ? 'border-b-2 border-purple-600 text-purple-700 bg-purple-50/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-purple-600" />
          <span>Análise Comportamental</span>
          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            Novo
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rpg')}
          className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'rpg'
              ? 'border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Swords className="w-4 h-4 text-emerald-600" />
          <span>Avatar de RPG & Classes</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'diagnostics'
              ? 'border-b-2 border-amber-500 text-amber-700 bg-amber-50/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Diagnóstico de Erros</span>
          {(userProfile.errorLogs?.length || 0) > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
              {userProfile.errorLogs?.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'history'
              ? 'border-b-2 border-[#0070f2] text-[#0070f2] bg-blue-50/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Histórico ({answerHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'backup'
              ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/60 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cloud className="w-4 h-4 text-indigo-600" />
          <span>Backup & Nuvem</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            Reinstalação Segura
          </span>
        </button>
      </div>

      {/* Cloud Status / Action Feedback Message */}
      {syncStatusMessage && (
        <div className="p-3 bg-indigo-50 border border-indigo-300 rounded-xl text-indigo-900 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <span>{syncStatusMessage}</span>
          <button
            type="button"
            onClick={() => setSyncStatusMessage(null)}
            className="text-indigo-600 hover:text-indigo-950 font-bold text-xs px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: OVERVIEW & BADGES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Cloud Sync Reassurance Bar */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white rounded-xl p-3.5 shadow-md border border-indigo-500/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0">
                <Cloud className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Proteção Pós-Desinstalação: Sincronização em Nuvem Ativa</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-400/40 px-1.5 py-0.2 rounded-full font-semibold">
                    100% Salvo
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  {lastSyncDate ? `Última sincronização na nuvem: ${formatBackupDate(lastSyncDate)}` : 'Seu progresso é salvo no servidor para que você possa restaurá-lo após reinstalar o app.'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleManualCloudSync}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : 'Fazer Backup Agora'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('backup')}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-indigo-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Gerenciar
              </button>
            </div>
          </div>
          {/* Real-Time Behavioral Pattern Summary (Shown whenever user opens Profile) */}
          <div className="bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#1e40af] text-white rounded-xl p-5 shadow-lg border border-blue-500/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      Diagnóstico Comportamental do Usuário
                    </h3>
                    <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2 py-0.2 rounded-full uppercase tracking-wider">
                      Perfil Ativo
                    </span>
                  </div>
                  <p className="text-xs text-blue-200">
                    Análise em tempo real dos seus padrões de estudo, tempo de resolução e precisão técnica.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('behavior')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-blue-100 rounded-lg text-xs font-semibold border border-white/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Métricas Detalhadas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Humorous & Constructive Feedback Quote */}
            <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-lg p-3.5 flex items-start gap-3">
              <div className="text-2xl shrink-0 mt-0.5">💬</div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>Feedback do Mentor SAP:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-100 italic leading-relaxed font-sans">
                  "{behaviorSummary.humorousQuote}"
                </p>
                <div className="text-[11px] text-blue-200 pt-0.5 font-medium">
                  Status Geral: <strong className="text-emerald-300">{behaviorSummary.behavioralVerdict}</strong> • Precisão Global: <strong className="text-yellow-300">{behaviorSummary.overallAccuracy}%</strong>
                </div>
              </div>
            </div>

            {/* Strengths & Constructive Criticisms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Pontos Fortes */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 space-y-2">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Onde Você Está Mandando Bem:</span>
                </div>
                {behaviorSummary.strengths.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-emerald-100">
                    {behaviorSummary.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold shrink-0">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-200/80">
                    Resolva mais exercícios de código para destacar suas maiores especialidades!
                  </p>
                )}
              </div>

              {/* Pontos de Atenção & Crítica Construtiva */}
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 space-y-2">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Críticas Construtivas & Atenção:</span>
                </div>
                {behaviorSummary.weaknesses.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-amber-100">
                    {behaviorSummary.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold shrink-0">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-amber-200/80">
                    Nenhuma fraqueza crítica detectada até o momento. Excelente disciplina no código!
                  </p>
                )}
              </div>
            </div>

            {/* Slowest Topic Notice */}
            {behaviorSummary.slowestTopic && (
              <div className="bg-blue-950/50 border border-blue-400/30 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-sky-300 shrink-0" />
                  <div>
                    <span className="font-bold text-sky-200">Tópico mais demorado para aprender: </span>
                    <span className="text-white font-medium">{behaviorSummary.slowestTopic.categoryLabel}</span>
                    <span className="text-slate-300 text-[11px] ml-1">
                      (Média de {behaviorSummary.slowestTopic.averageTimeSeconds}s por resposta)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onPracticeTopic && onPracticeTopic('SELECT_SQL')}
                  className="px-2.5 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/40 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Praticar Este Tópico Agora
                </button>
              </div>
            )}
          </div>

          {/* Daily Study Notifications & Streak Protection Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-300/70 dark:border-amber-700/50 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-sm shrink-0">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                      Lembretes Diários de Estudo (Notification API)
                    </h3>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                      Streak: {userProfile.streakDays || 1}d 🔥
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Mantenha sua sequência diária e receba avisos para praticar ABAP antes de o dia acabar.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={async () => {
                    const res = await sendStudyReminder(userProfile, true);
                    setTestNotifMessage(res.message);
                    setTimeout(() => setTestNotifMessage(null), 6000);
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Testar Lembrete</span>
                </button>

                {onOpenNotificationSettings && (
                  <button
                    type="button"
                    onClick={onOpenNotificationSettings}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Configurar
                  </button>
                )}
              </div>
            </div>

            {testNotifMessage && (
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{testNotifMessage}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-amber-200/50 dark:border-amber-800/40">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Horário do Lembrete: <strong className="text-slate-800 dark:text-slate-200 font-mono">{userProfile.notificationSettings?.reminderTime || '19:00'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Alerta de Streak em Risco: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{userProfile.notificationSettings?.streakProtection !== false ? 'Ativado' : 'Desativado'}</strong></span>
              </div>
            </div>
          </div>

          {/* Professional Title Selection Box */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                    Título Profissional no SAP GUI
                  </h3>
                  <p className="text-xs text-slate-500">
                    Título ativo exibido no sistema: <strong className="text-[#0070f2] font-mono">{userProfile.rankTitle}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onEquipTitle && onEquipTitle('auto')}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                    isAutoTitle
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Modo Automático (Por XP)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Seus Títulos Desbloqueados ({availableUnlockedTitles.length}):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {availableUnlockedTitles.map((title) => {
                  const isCurrent = userProfile.rankTitle === title;

                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => onEquipTitle && onEquipTitle(title)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-500 shadow-2xs text-blue-900 ring-1 ring-blue-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate space-y-0.5">
                        <div className="font-bold truncate">{title}</div>
                        <div className="text-[10px] text-slate-400">
                          {isCurrent ? 'Equipado no perfil' : 'Disponível para equipar'}
                        </div>
                      </div>

                      {isCurrent ? (
                        <Check className="w-4 h-4 text-[#0070f2] shrink-0" />
                      ) : (
                        <span className="text-[10px] text-blue-600 font-semibold shrink-0">
                          Equipar
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Badges / Conquistas */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Medalhas & Conquistas Desbloqueadas ({userProfile.badges.length} / {INITIAL_BADGES.length})</span>
              </h3>
              <span className="text-xs text-slate-400">
                Resolva desafios para desbloquear novos títulos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {INITIAL_BADGES.map((b) => {
                const isUnlocked = userProfile.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-lg border flex items-start space-x-3 transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                        : 'bg-slate-50/50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? 'bg-amber-100 text-amber-700 shadow-xs'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 truncate">
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span className="truncate">{b.title}</span>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {b.description}
                      </p>
                      {b.unlockedTitle && (
                        <div className="text-[10px] text-blue-700 font-medium pt-0.5 truncate">
                          Título: {b.unlockedTitle}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BEHAVIORAL PATTERN ANALYSIS (Requested by user) */}
      {activeTab === 'behavior' && (
        <div className="space-y-5">
          {/* Main Behavioral Summary Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#1b2a4a] text-white p-5 sm:p-6 rounded-xl shadow-lg border border-purple-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-purple-500/30 border border-purple-400/50 flex items-center justify-center text-purple-200 shadow-xs">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Diagnóstico Comportamental do Usuário
                    </h3>
                    <span className="bg-purple-400/30 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-400/40">
                      Análise Ativa
                    </span>
                  </div>
                  <p className="text-xs text-purple-200">
                    Aproveitamento Geral: <strong className="text-emerald-300 font-mono text-sm">{behaviorSummary.overallAccuracy}%</strong> • Veredito: <span className="text-amber-300 font-semibold">{behaviorSummary.behavioralVerdict}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Humorous SAP dev quote */}
            <div className="bg-black/30 border-l-4 border-purple-400 p-3 rounded-r-lg text-xs italic text-purple-100">
              {behaviorSummary.humorousQuote}
            </div>

            {/* Strengths and Constructive Criticisms side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Strengths / Elogios */}
              <div className="bg-emerald-950/50 border border-emerald-500/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Pontos Fortes & Elogios:</span>
                </div>
                <div className="space-y-1.5">
                  {behaviorSummary.strengths.map((st, sIdx) => (
                    <div key={sIdx} className="text-xs text-emerald-100 flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span className="leading-snug">{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constructive Criticisms / Humor SAP */}
              <div className="bg-amber-950/50 border border-amber-500/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs sm:text-sm">
                  <Smile className="w-4 h-4 text-amber-400" />
                  <span>Observações & Críticas Construtivas (com humor SAP):</span>
                </div>
                <div className="space-y-1.5">
                  {behaviorSummary.weaknesses.map((wk, wIdx) => (
                    <div key={wIdx} className="text-xs text-amber-100 flex items-start space-x-2">
                      <span className="text-amber-400 font-bold shrink-0">⚠️</span>
                      <span className="leading-snug">{wk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slowest topic alert */}
            {behaviorSummary.slowestTopic && (
              <div className="bg-blue-950/60 border border-blue-500/40 p-3.5 rounded-xl flex items-start space-x-3 text-xs">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-cyan-200">
                    Tópico que exige mais tempo de dedicação: <span className="text-yellow-300">{behaviorSummary.slowestTopic.categoryLabel}</span>
                  </div>
                  <p className="text-blue-100/90 leading-relaxed text-[11px]">
                    {behaviorSummary.slowestTopic.tip}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Topic Performance Grid */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
            <h4 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Taxa de Acertos e Tempo Médio por Categoria</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {behaviorSummary.categoryStats.map((cat) => (
                <div key={cat.categoryKey} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="truncate pr-2">{cat.categoryLabel}</span>
                    <span className={`font-mono ${cat.accuracyRate >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {cat.accuracyRate}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.accuracyRate >= 70 ? 'bg-emerald-500' : cat.accuracyRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${cat.accuracyRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{cat.correctCount} acertos em {cat.totalAttempts} tentativas</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      ~{cat.averageTimeSeconds}s por exercício
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RPG AVATAR & CLASSES (Requested by user) */}
      {activeTab === 'rpg' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-[#0f172a] to-[#1e293b] text-white p-5 sm:p-6 rounded-xl shadow-lg border border-slate-700 space-y-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Full body character display */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-slate-950/80 p-4 rounded-2xl border-2 border-slate-700 shadow-inner">
                  <RpgAvatarRenderer race={heroRace} level={userProfile.level} size="full" showWeaponGlow />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    {raceMeta.name} • Nível {userProfile.level}
                  </span>
                  <h3 className="text-lg font-black text-white">{currentHeroClass.title}</h3>
                  <div className="text-xs text-emerald-300 font-semibold">
                    Habilidade: {currentHeroClass.skillName}
                  </div>
                </div>
              </div>

              {/* Race description and Class switch */}
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-cyan-300 uppercase tracking-wider font-bold">
                    Sobre sua Raça de RPG
                  </span>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{raceMeta.iconEmoji}</span>
                    <span>{raceMeta.name}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {raceMeta.description}
                  </p>
                  <p className="text-[11px] text-slate-400 italic pt-1">
                    {raceMeta.lore}
                  </p>
                </div>

                {/* Choose / Switch RPG Race */}
                <div className="space-y-2 pt-3 border-t border-slate-700">
                  <label className="text-xs font-bold text-slate-300 block">
                    Escolher / Mudar Raça do Avatar (Orc, Mago, Guerreiro, Elfo, Arqueiro, Espírito):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_RPG_RACES.map((rKey) => {
                      const rInfo = RPG_RACES[rKey];
                      const isCurrent = heroRace === rKey;

                      return (
                        <button
                          key={rKey}
                          onClick={() => onUpdateRpgRace && onUpdateRpgRace(rKey)}
                          className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-600/30 border-blue-400 text-blue-200 ring-2 ring-blue-500/50 shadow-xs'
                              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <span className="text-lg">{rInfo.iconEmoji}</span>
                          <span className="truncate">{rInfo.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Class progression table across all 7 levels */}
            <div className="space-y-2 pt-4 border-t border-slate-700">
              <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Classes Desbloqueadas por Nível ({raceMeta.name}):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {[1, 2, 3, 4, 5, 6, 7].map((lvl) => {
                  const classItem = raceMeta.classesByLevel[lvl];
                  const isUnlocked = userProfile.level >= lvl;
                  const isCurrent = userProfile.level === lvl;

                  return (
                    <div
                      key={lvl}
                      className={`p-3 rounded-xl border transition-all text-xs ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400/50'
                          : isUnlocked
                          ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-[10px] uppercase font-mono text-cyan-300">
                          Nível {lvl}
                        </span>
                        {isCurrent ? (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                            Equipado
                          </span>
                        ) : isUnlocked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </div>
                      <div className="font-bold text-xs truncate text-white">{classItem.title}</div>
                      <div className="text-[10px] text-amber-200 font-mono mt-0.5 truncate">
                        ⚔️ {classItem.skillName}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {classItem.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIAGNOSTICS & RECOVERY */}
      {activeTab === 'diagnostics' && (
        <ErrorDiagnosticPanel
          errorLogs={userProfile.errorLogs || []}
          answerHistory={answerHistory}
          onPracticeTopic={onPracticeTopic}
          onClearResolvedErrors={onClearResolvedErrors}
        />
      )}

      {/* TAB 5: HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Histórico de Tentativas no Quiz
            </h3>

            <div className="flex items-center space-x-1.5 text-xs">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`px-2.5 py-1 rounded cursor-pointer ${historyFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Todas ({answerHistory.length})
              </button>
              <button
                onClick={() => setHistoryFilter('correct')}
                className={`px-2.5 py-1 rounded cursor-pointer ${historyFilter === 'correct' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Acertos ({answerHistory.filter((a) => a.isCorrect).length})
              </button>
              <button
                onClick={() => setHistoryFilter('wrong')}
                className={`px-2.5 py-1 rounded cursor-pointer ${historyFilter === 'wrong' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Erros ({answerHistory.filter((a) => !a.isCorrect).length})
              </button>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Nenhuma tentativa registrada nesta categoria.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                    item.isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-red-50/50 border-red-200 text-slate-800'
                  }`}
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="font-bold flex items-center gap-1.5">
                      {item.isCorrect ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      )}
                      <span className="truncate">{item.questionTitle}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {item.level} • {new Date(item.date).toLocaleDateString()} às {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <span className={`font-mono font-bold text-xs shrink-0 ${item.isCorrect ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {item.isCorrect ? '+30 XP' : '0 XP'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: BACKUP & REINSTALLATION RECOVERY */}
      {activeTab === 'backup' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main Informational Hero */}
          <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-indigo-500/40 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center shrink-0">
                <CloudDownload className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Proteção e Continuidade Pós-Desinstalação</span>
                  <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Garantido
                  </span>
                </h3>
                <p className="text-xs text-indigo-200">
                  Seus dados de estudo (níveis, XP, conquistas e códigos ABAP) protegidos para quando você reinstalar o app.
                </p>
              </div>
            </div>

            <div className="p-3 bg-black/30 rounded-lg border border-white/10 text-xs text-slate-200 leading-relaxed">
              <span className="font-bold text-amber-300">Como funciona a persistência?</span> Ao desinstalar qualquer aplicativo no Android ou Desktop, o sistema operacional limpa o cache local por privacidade. Para garantir que nada seja perdido, o <strong>SAP ABAP Learning Hub</strong> salva seu progresso na nuvem do servidor e permite baixar cópias de segurança em arquivo <code>.json</code>.
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Cloud Sync */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        Sincronização em Nuvem
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Servidor central do SAP Hub
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Ativo
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Usuário vinculado:</span>
                    <strong className="text-slate-800 dark:text-white font-mono">{userProfile.name}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Progresso atual:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Nível {userProfile.level} ({userProfile.xp} XP)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">Conquistas salvas:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{userProfile.badges.length} medalhas</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Último backup salvo:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                      {lastSyncDate ? formatBackupDate(lastSyncDate) : 'Pendente de sincronização'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleManualCloudSync}
                disabled={isSyncing}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sincronizando com a Nuvem...' : 'Sincronizar com a Nuvem Agora'}</span>
              </button>
            </div>

            {/* Card 2: Physical JSON File Export & Import */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Arquivo Físico de Backup (.json)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Guarde no celular, PC ou Google Drive
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Baixe um arquivo contendo 100% dos seus dados (perfil, respostas, streak e códigos). Você pode restaurar este arquivo a qualquer momento mesmo sem nenhuma conexão com a internet.
                </p>

                <div className="pt-1 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Arquivo .json</span>
                  </button>

                  <label className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                    <FileUp className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Importar .json</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                Compatível com versões Desktop Windows 11, Celulares Android e Navegadores.
              </div>
            </div>
          </div>

          {/* Guide: Step-by-Step Restoration */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
              <span>Passo a Passo: Como recuperar meus dados se eu desinstalar o app?</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-center text-xs flex items-center justify-center">1</span>
                  <span>Reinstale o App</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Baixe novamente o aplicativo no Android ou execute o instalador do Windows 11.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-center text-xs flex items-center justify-center">2</span>
                  <span>Clique em Restaurar</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Na tela de Logon SAP inicial, clique na aba <strong>"Recuperar / Restaurar Backup"</strong>.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-center text-xs flex items-center justify-center">3</span>
                  <span>Pronto! 100% De Volta</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  O sistema reconhece seu perfil na nuvem ou lê seu arquivo e recupera todo o seu XP e progresso.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone: Reset Progress */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-xs text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Todo o Progresso Deste Usuário</span>
          </button>
        ) : (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg text-xs space-y-2 max-w-md animate-in fade-in">
            <div className="font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Confirmar Reinício de Progresso</span>
            </div>
            <p className="text-red-700 dark:text-red-300 text-[11px] leading-relaxed">
              Tem certeza de que deseja resetar todo o progresso (XP, nível, streak, simulados e histórico)? Essa ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetProgress();
                }}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Sim, Resetar Progresso
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
