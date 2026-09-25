import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Play, Terminal, HelpCircle, Code2, Bot, Award, Sparkles, BookOpen, Bug, LogIn } from 'lucide-react';
import { UserProfile, UserAnswerHistory, SimulationResult, SimuladoResult, UserErrorRecord, RpgRace } from './types';
import { INITIAL_BADGES, INITIAL_ABAP_CODE } from './data/sapReference';
import { RPG_RACES } from './data/rpgAvatars';
import { Header } from './components/Header';
import { AbapEditor } from './components/AbapEditor';
import { AbapSimulator } from './components/AbapSimulator';
import { QuizSection } from './components/QuizSection';
import { ChatAI } from './components/ChatAI';
import { ProgressProfile } from './components/ProgressProfile';
import { SapCheatSheet } from './components/SapCheatSheet';
import { SapLogonModal } from './components/SapLogonModal';
import { AbapGlossaryOverlay } from './components/AbapGlossaryOverlay';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AppUpdateToast } from './components/AppUpdateToast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StreakRewardToast } from './components/StreakRewardToast';
import { StudyReminderNotification } from './components/StudyReminderNotification';
import { StudyNotificationModal } from './components/StudyNotificationModal';
import { AppUpdateModal } from './components/AppUpdateModal';
import { DesktopWindowsModal } from './components/DesktopWindowsModal';
import { checkStudyReminderDue, sendStudyReminder } from './utils/notificationService';
import { processDailyExerciseReward } from './utils/dailyStreakTracker';
import { simulateAbapExecution } from './utils/abapLinter';
import { sounds } from './utils/soundEffects';
import { StudyNotificationSettings, AppUserDataBackup } from './types';
import {
  assembleBackupData,
  autoSyncBackupIfOnline,
  applyRestoredBackup,
  requestPersistentStorage
} from './utils/backupManager';

const STORAGE_ACTIVE_USER_KEY = 'sap_abap_active_username_v1';

export default function App() {
  // Focus on Quizzes and Challenges as primary learning tab
  const [activeTab, setActiveTab] = useState<'quiz' | 'editor' | 'chat' | 'progress' | 'reference'>('quiz');
  const [currentCode, setCurrentCode] = useState<string>(INITIAL_ABAP_CODE);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulatorInitialMode, setSimulatorInitialMode] = useState<'output' | 'debug' | 'split'>('output');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
  const [successfulSimulationsCount, setSuccessfulSimulationsCount] = useState<number>(0);
  const [isGlossaryOverlayOpen, setIsGlossaryOverlayOpen] = useState(false);
  const [glossaryOverlayInitialTerm, setGlossaryOverlayInitialTerm] = useState<string | null>('SELECT');

  // SAP Logon Modal visibility (Primary first screen for user profile login & storage)
  const [isLogonOpen, setIsLogonOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const activeUser = localStorage.getItem(STORAGE_ACTIVE_USER_KEY);
      return !activeUser; // Open logon if no active user session exists
    }
    return true;
  });
  const [logonInitialTab, setLogonInitialTab] = useState<'select' | 'create' | 'restore'>('select');
  const [profileInitialTab, setProfileInitialTab] = useState<'overview' | 'behavior' | 'rpg' | 'diagnostics' | 'history' | 'backup'>('overview');

  // Theme state persisted in localStorage & synchronized with CSS variables
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sap_abap_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      localStorage.setItem('sap_abap_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Streak Reward Toast State
  const [streakToast, setStreakToast] = useState<{
    message: string | null;
    bonusXp: number;
    streakDays: number;
  }>({ message: null, bonusXp: 0, streakDays: 1 });

  // Study Notification Modal State
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  // Real-Time Live Update Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  // Windows 11 Desktop Installer Modal State
  const [isWindowsModalOpen, setIsWindowsModalOpen] = useState<boolean>(false);

  // Current User Profile State - Defaults to Convidado (Guest) as requested
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const activeUser = localStorage.getItem(STORAGE_ACTIVE_USER_KEY);
        if (activeUser) {
          const userSaved = localStorage.getItem(`sap_abap_user_${activeUser}_profile`);
          if (userSaved) return JSON.parse(userSaved);
        }
      } catch (e) {
        console.error('Failed to load active profile', e);
      }
    }
    return {
      name: 'Convidado SAP',
      avatar: '👤',
      rpgRace: 'guerreiro',
      xp: 0,
      level: 1,
      rankTitle: 'Visitante NetWeaver (Convidado)',
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      completedQuestionIds: [],
      badges: [],
      soundEnabled: true,
      isGuest: true,
    };
  });

  // Evaluate Daily Exercise Streak Bonus
  const evaluateDailyStreak = () => {
    const result = processDailyExerciseReward(userProfile);
    if (result.awardedBonusXp > 0) {
      setUserProfile(result.updatedProfile);
      setStreakToast({
        message: result.toastMessage,
        bonusXp: result.awardedBonusXp,
        streakDays: result.streakDays,
      });
      if (userProfile.soundEnabled) sounds.playLevelUp();
    }
  };

  const handleSaveNotificationSettings = (settings: StudyNotificationSettings) => {
    setUserProfile((prev) => ({
      ...prev,
      notificationSettings: settings,
    }));
  };

  // Periodic Daily Study Reminder check
  useEffect(() => {
    const checkReminder = () => {
      if (userProfile.notificationSettings?.enabled) {
        if (checkStudyReminderDue(userProfile)) {
          sendStudyReminder(userProfile);
        }
      }
    };
    checkReminder();
    const interval = setInterval(checkReminder, 1000 * 60 * 30); // Check every 30 minutes
    return () => clearInterval(interval);
  }, [userProfile]);

  // Individual Answer History State for the active user
  const [answerHistory, setAnswerHistory] = useState<UserAnswerHistory[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const activeUser = localStorage.getItem(STORAGE_ACTIVE_USER_KEY) || 'Convidado SAP';
        const saved = localStorage.getItem(`sap_abap_user_${activeUser}_history`);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
    return [];
  });

  // Switch or Login User Callback
  const handleUserLogin = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLogonOpen(false);
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, profile.name);

    // Load individual user history
    try {
      const savedHistory = localStorage.getItem(`sap_abap_user_${profile.name}_history`);
      if (savedHistory) {
        setAnswerHistory(JSON.parse(savedHistory));
      } else {
        setAnswerHistory([]);
      }

      // Load individual user code
      const savedCode = localStorage.getItem(`sap_abap_user_${profile.name}_code`);
      if (savedCode) {
        setCurrentCode(savedCode);
      } else {
        setCurrentCode(INITIAL_ABAP_CODE);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Persist current code per user
  useEffect(() => {
    try {
      if (userProfile.name) {
        localStorage.setItem(`sap_abap_user_${userProfile.name}_code`, currentCode);
      }
    } catch (e) {}
  }, [currentCode, userProfile.name]);

  // Persist profile per user
  useEffect(() => {
    try {
      if (userProfile.name) {
        localStorage.setItem(`sap_abap_user_${userProfile.name}_profile`, JSON.stringify(userProfile));
      }
    } catch (e) {}
  }, [userProfile]);

  // Persist answer history per user
  useEffect(() => {
    try {
      if (userProfile.name) {
        localStorage.setItem(`sap_abap_user_${userProfile.name}_history`, JSON.stringify(answerHistory));
      }
    } catch (e) {}
  }, [answerHistory, userProfile.name]);

  // Request browser persistent storage on startup
  useEffect(() => {
    requestPersistentStorage();
  }, []);

  // Automatic Background Cloud Sync for reinstallation continuity
  useEffect(() => {
    if (!userProfile.name || userProfile.isGuest) return;
    const timer = setTimeout(() => {
      const backup = assembleBackupData(userProfile, answerHistory, currentCode, theme);
      autoSyncBackupIfOnline(backup);
    }, 3000);
    return () => clearTimeout(timer);
  }, [userProfile, answerHistory, currentCode, theme]);

  // Handle restoring backup snapshot
  const handleRestoreBackup = (backup: AppUserDataBackup) => {
    applyRestoredBackup(backup, (restoredUser) => {
      setUserProfile(restoredUser);
      setAnswerHistory(backup.answerHistory || []);
      if (backup.currentCode) setCurrentCode(backup.currentCode);
      if (backup.theme) setTheme(backup.theme);
      sounds.playLevelUp();
    });
  };

  // Dynamic Rank Title calculation
  const calculateRankTitle = (xp: number): { title: string; level: number } => {
    if (xp >= 3200) return { title: 'Grã-Mestra em ABAP OO & Design Patterns', level: 7 };
    if (xp >= 2500) return { title: 'Especialista em Formulários & Internacionalização', level: 6 };
    if (xp >= 1800) return { title: 'Arquiteta SAP & Mestre em ABAP', level: 5 };
    if (xp >= 1000) return { title: 'Especialista ABAP Sênior', level: 4 };
    if (xp >= 500) return { title: 'Consultora ABAP Pleno', level: 3 };
    if (xp >= 200) return { title: 'Desenvolvedora ABAP Júnior', level: 2 };
    return { title: 'Estagiária ABAP (SE38)', level: 1 };
  };

  const handleUpdateRpgRace = (newRace: RpgRace) => {
    setUserProfile((prev) => ({
      ...prev,
      rpgRace: newRace,
      avatar: RPG_RACES[newRace]?.iconEmoji || prev.avatar,
    }));
  };

  const handleEquipTitle = (title: string | 'auto') => {
    setUserProfile((prev) => {
      if (title === 'auto') {
        const { title: autoTitle } = calculateRankTitle(prev.xp);
        return {
          ...prev,
          equippedTitle: 'auto',
          rankTitle: autoTitle,
        };
      }
      return {
        ...prev,
        equippedTitle: title,
        rankTitle: title,
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setUserProfile((prev) => {
      if (prev.badges.includes(badgeId)) return prev;
      if (prev.soundEnabled) sounds.playLevelUp();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });

      // Find badge reward title if any
      const badgeObj = INITIAL_BADGES.find((b) => b.id === badgeId);
      const newUnlockedTitles = prev.unlockedTitles ? [...prev.unlockedTitles] : ['Estagiária ABAP (SE38)'];
      if (badgeObj?.unlockedTitle && !newUnlockedTitles.includes(badgeObj.unlockedTitle)) {
        newUnlockedTitles.push(badgeObj.unlockedTitle);
      }

      // If user hasn't explicitly locked a custom title, update rankTitle to this newly unlocked title
      const shouldAutoEquip = !prev.equippedTitle || prev.equippedTitle === 'auto';
      const updatedRankTitle = shouldAutoEquip && badgeObj?.unlockedTitle ? badgeObj.unlockedTitle : prev.rankTitle;

      return {
        ...prev,
        badges: [...prev.badges, badgeId],
        unlockedTitles: newUnlockedTitles,
        rankTitle: updatedRankTitle,
      };
    });
  };

  // Run execution simulation
  const handleRunSimulation = (initialMode: 'output' | 'debug' | 'split' = 'output') => {
    setSimulatorInitialMode(initialMode);
    const res = simulateAbapExecution(currentCode);
    setSimulationResult(res);

    if (res.success) {
      if (userProfile.soundEnabled) sounds.playSuccess();
      evaluateDailyStreak();
      const nextCount = successfulSimulationsCount + 1;
      setSuccessfulSimulationsCount(nextCount);
      if (nextCount >= 3) {
        unlockBadge('badge_simulator_pro');
      }
      if (currentCode.includes('VALUE #(') || currentCode.includes('DATA(')) {
        unlockBadge('badge_clean_abap');
      }
      if (initialMode === 'debug') {
        unlockBadge('badge_debugger_master');
      }
    } else {
      if (userProfile.soundEnabled) sounds.playError();
    }
  };

  const handleAnswerQuestion = (historyItem: UserAnswerHistory, xpEarned: number) => {
    setAnswerHistory((prev) => [historyItem, ...prev]);

    if (historyItem.isCorrect) {
      evaluateDailyStreak();
      const nextConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextConsecutive);
      if (nextConsecutive >= 5) {
        unlockBadge('badge_sysubrc_zero');
      }

      // Count SQL/Select questions answered correctly to trigger '10 selects' badge
      const updatedHistory = [historyItem, ...answerHistory];
      const correctSelectCount = updatedHistory.filter(
        (h) => h.isCorrect && (h.questionTitle.toLowerCase().includes('select') || h.questionTitle.toLowerCase().includes('sql') || h.questionTitle.toLowerCase().includes('mara') || h.questionTitle.toLowerCase().includes('kna1'))
      ).length;

      if (correctSelectCount >= 10) {
        unlockBadge('badge_select_10');
      }

      // Check specific badge triggers
      if (historyItem.questionId.includes('select') || historyItem.questionId === 'n2_013' || historyItem.questionId === 'n2_018') {
        unlockBadge('badge_select_master');
      }
      if (historyItem.questionId.startsWith('n2')) {
        unlockBadge('badge_loop_tamer');
      }
      if (historyItem.questionId.startsWith('n3')) {
        unlockBadge('badge_bapi_ninja');
      }

      setUserProfile((prev) => {
        const newXp = prev.xp + xpEarned;
        const { title: autoTitle, level } = calculateRankTitle(newXp);
        const completed = prev.completedQuestionIds.includes(historyItem.questionId)
          ? prev.completedQuestionIds
          : [...prev.completedQuestionIds, historyItem.questionId];

        const isCustomEquipped = prev.equippedTitle && prev.equippedTitle !== 'auto';

        return {
          ...prev,
          xp: newXp,
          level,
          rankTitle: isCustomEquipped ? prev.rankTitle : autoTitle,
          completedQuestionIds: completed,
        };
      });
    } else {
      setConsecutiveCorrect(0);
    }
  };

  const handleSimuladoCompleted = (result: SimuladoResult) => {
    setUserProfile((prev) => {
      const history = prev.simuladosHistory ? [result, ...prev.simuladosHistory] : [result];
      let newXp = prev.xp;
      let newBadges = [...prev.badges];
      let newUnlockedTitles = prev.unlockedTitles ? [...prev.unlockedTitles] : ['Estagiária ABAP (SE38)'];

      if (result.passed) {
        newXp += 200; // Bonus XP for passing certification simulation
        if (result.earnedBadge && !newBadges.includes(result.earnedBadge)) {
          newBadges.push(result.earnedBadge);
        }
        if (result.earnedTitle && !newUnlockedTitles.includes(result.earnedTitle)) {
          newUnlockedTitles.push(result.earnedTitle);
        }
      }

      const { level, title: autoTitle } = calculateRankTitle(newXp);
      const isCustomEquipped = prev.equippedTitle && prev.equippedTitle !== 'auto';
      const updatedRankTitle = isCustomEquipped
        ? prev.rankTitle
        : result.passed && result.earnedTitle
        ? result.earnedTitle
        : autoTitle;

      return {
        ...prev,
        xp: newXp,
        level,
        badges: newBadges,
        unlockedTitles: newUnlockedTitles,
        rankTitle: updatedRankTitle,
        simuladosHistory: history,
      };
    });
  };

  const handleSendToChat = (codeToSend: string) => {
    setActiveTab('chat');
  };

  const handleAskAi = () => {
    unlockBadge('badge_ai_mentee');
  };

  const handleToggleSound = () => {
    setUserProfile((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleUpdateProfileName = (newName: string) => {
    setUserProfile((prev) => ({ ...prev, name: newName }));
  };

  const handleRecordError = (
    category: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION' | 'GENERAL_SYNTAX',
    title: string,
    detail: string,
    codeSnippet?: string
  ) => {
    const newRecord: UserErrorRecord = {
      id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      category,
      title,
      detail,
      codeSnippet,
      timestamp: new Date().toISOString(),
      resolved: false,
      source: codeSnippet ? 'editor_syntax' : 'quiz_challenge',
    };

    setUserProfile((prev) => {
      const existing = prev.errorLogs || [];
      if (existing.length > 0 && existing[0].title === title) {
        return prev;
      }
      return {
        ...prev,
        errorLogs: [newRecord, ...existing.slice(0, 49)],
      };
    });
  };

  const handleClearResolvedErrors = () => {
    setUserProfile((prev) => ({
      ...prev,
      errorLogs: [],
    }));
  };

  const handleResetProgress = () => {
    if (userProfile.name) {
      localStorage.removeItem(`sap_abap_user_${userProfile.name}_profile`);
      localStorage.removeItem(`sap_abap_user_${userProfile.name}_history`);
      localStorage.removeItem(`sap_abap_user_${userProfile.name}_code`);
    }
    setUserProfile({
      name: userProfile.name || 'Convidado SAP',
      avatar: userProfile.avatar || '👤',
      xp: 0,
      level: 1,
      rankTitle: userProfile.isGuest ? 'Visitante NetWeaver (Convidado)' : 'Estagiária ABAP (SE38)',
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      completedQuestionIds: [],
      badges: [],
      soundEnabled: true,
      isGuest: userProfile.isGuest ?? true,
    });
    setAnswerHistory([]);
    setCurrentCode(INITIAL_ABAP_CODE);
    setConsecutiveCorrect(0);
    setSuccessfulSimulationsCount(0);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col font-sans w-full max-w-full overflow-x-hidden transition-colors duration-200">
      {/* Daily Consecutive Login/Exercise Streak Reward Toast */}
      <StreakRewardToast
        message={streakToast.message}
        bonusXp={streakToast.bonusXp}
        streakDays={streakToast.streakDays}
        onDismiss={() => setStreakToast({ message: null, bonusXp: 0, streakDays: 1 })}
      />

      {/* SAP Logon Modal: Shown first or when user requests to switch accounts */}
      <SapLogonModal
        isOpen={isLogonOpen}
        initialTab={logonInitialTab}
        currentProfile={userProfile}
        onLogin={handleUserLogin}
        canCancel={Boolean(userProfile.name)}
        onClose={() => setIsLogonOpen(false)}
      />

      {/* Top SAP Header with Global Theme Switcher & User Status */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab as any}
        userProfile={userProfile}
        toggleSound={handleToggleSound}
        onOpenLogon={() => {
          setLogonInitialTab('select');
          setIsLogonOpen(true);
        }}
        onOpenGlossary={() => {
          setGlossaryOverlayInitialTerm('SELECT');
          setIsGlossaryOverlayOpen(true);
        }}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenUpdates={() => setIsUpdateModalOpen(true)}
        onOpenWindowsInstaller={() => setIsWindowsModalOpen(true)}
        onOpenBackup={() => {
          setProfileInitialTab('backup');
          setActiveTab('progress');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 space-y-5 pb-24 md:pb-8 max-w-full overflow-x-hidden">
        {/* Mobile Instructional Quick Guide ("Onde ir agora" - Claro e sem confusão de botões) */}
        <div className="md:hidden bg-gradient-to-r from-blue-900 to-[#1b2a4a] text-white p-3 rounded-lg shadow-sm border border-blue-700/50 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <span className="font-bold text-amber-300">O que fazer agora: </span>
              {activeTab === 'quiz' && 'Escolha um desafio ou laboratório abaixo e clique em "Verificar Código".'}
              {activeTab === 'editor' && 'Escreva seu programa ABAP e clique em "Executar (F8)".'}
              {activeTab === 'chat' && 'Tire dúvidas conceituais com o SAP Mentor IA.'}
              {activeTab === 'progress' && 'Acompanhe seu nível, medalhas e gráfico de erros.'}
              {activeTab === 'reference' && 'Consulte tabelas e comandos da SE11.'}
            </div>
          </div>
        </div>

        {/* Tab 1: Quizzes & Desafios de Código (FOCO PRINCIPAL DE APRENDIZADO) */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            {/* Primary Track Welcome Banner */}
            <div className="bg-gradient-to-r from-[#1b2a4a] via-[#1f3765] to-[#0070f2] text-white p-4 sm:p-5 rounded-lg shadow-md border border-blue-800/40 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Foco Principal
                  </span>
                  <span className="text-blue-200 text-xs font-mono">Trilha de Aprendizado SAP ABAP</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-white">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  <span>Quizzes, Desafios de Código & Testes Práticos</span>
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Ganhe XP, avance de nível e conquiste medalhas SAP resolvendo questões de múltipla escolha e exercícios práticos de código com validação imediata.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('editor')}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold border border-white/20 transition-colors"
                >
                  <Code2 className="w-4 h-4 text-blue-300" />
                  <span>Editor SE38 (Apoio)</span>
                </button>

                <button
                  onClick={() => setActiveTab('progress')}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs shadow-md transition-all active:scale-95"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>Ver Meu Progresso</span>
                </button>
              </div>
            </div>

            <QuizSection
              completedQuestionIds={userProfile.completedQuestionIds}
              onAnswerQuestion={handleAnswerQuestion}
              onSimuladoCompleted={handleSimuladoCompleted}
              errorLogs={userProfile.errorLogs || []}
              answerHistory={answerHistory}
              onRecordError={handleRecordError}
              soundEnabled={userProfile.soundEnabled}
              userProfile={userProfile}
            />
          </div>
        )}

        {/* Tab 2: Editor ABAP SE38 (NetWeaver Authentico com Cores e Depurador Linha a Linha) */}
        {activeTab === 'editor' && (
          <div className="space-y-4">
            <AbapEditor
              code={currentCode}
              setCode={setCurrentCode}
              onSendToChat={handleSendToChat}
              onSuccessfulSimulation={() => handleRunSimulation('output')}
              onRunSimulation={handleRunSimulation}
              onRecordError={handleRecordError}
              onNavigateToLab={() => setActiveTab('quiz')}
              soundEnabled={userProfile.soundEnabled}
            />
          </div>
        )}

        {/* Tab 3: Chat with Specialized SAP AI */}
        {activeTab === 'chat' && (
          <ChatAI
            currentEditorCode={currentCode}
            onCodeSuggested={(suggested) => {
              setCurrentCode(suggested);
              setActiveTab('editor');
            }}
            onAskAi={handleAskAi}
          />
        )}

        {/* Tab 4: Progress & Badges Profile */}
        {activeTab === 'progress' && (
          <ProgressProfile
            userProfile={userProfile}
            initialTab={profileInitialTab}
            onUpdateProfileName={handleUpdateProfileName}
            onEquipTitle={handleEquipTitle}
            onUpdateRpgRace={handleUpdateRpgRace}
            answerHistory={answerHistory}
            onResetProgress={handleResetProgress}
            onPracticeTopic={() => {
              setActiveTab('quiz');
            }}
            onClearResolvedErrors={handleClearResolvedErrors}
            currentCode={currentCode}
            onRestoreBackup={handleRestoreBackup}
          />
        )}

        {/* Tab 5: Data Dictionary & Reference */}
        {activeTab === 'reference' && <SapCheatSheet />}
      </main>

      {/* SAP Execution Simulator Modal */}
      {simulationResult && (
        <AbapSimulator
          result={simulationResult}
          initialViewMode={simulatorInitialMode}
          onClose={() => setSimulationResult(null)}
          onReRun={() => handleRunSimulation(simulatorInitialMode)}
        />
      )}

      {/* Global Searchable Glossary Overlay */}
      <AbapGlossaryOverlay
        isOpen={isGlossaryOverlayOpen}
        onClose={() => setIsGlossaryOverlayOpen(false)}
        initialTerm={glossaryOverlayInitialTerm}
        onSelectTermInEditor={(snippet) => {
          setIsGlossaryOverlayOpen(false);
          setActiveTab('editor');
          setCurrentCode((prev) => `${prev}\n\n" Inserido do Glossário:\n${snippet}`);
        }}
      />

      {/* Live Application Update Notification (Android & Desktop) */}
      <AppUpdateToast onOpenModal={() => setIsUpdateModalOpen(true)} />

      {/* Real-Time Live Update Details & Testing Modal */}
      <AppUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />

      {/* Windows 11 Desktop Installer Modal */}
      <DesktopWindowsModal
        isOpen={isWindowsModalOpen}
        onClose={() => setIsWindowsModalOpen(false)}
      />

      {/* Daily Study Reminder Notification Alert */}
      <StudyReminderNotification
        onGoToQuiz={() => setActiveTab('quiz')}
        onOpenSettings={() => setIsNotificationModalOpen(true)}
      />

      {/* Study Notification Settings Modal */}
      <StudyNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        userProfile={userProfile}
        onUpdateSettings={handleSaveNotificationSettings}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Footer */}
      <footer className="bg-[#121f36] text-slate-400 border-t border-[#233555] py-4 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">SAP ABAP Learning Hub</span>
            <span>•</span>
            <span>Usuário Ativo: <strong className="text-white font-mono">{userProfile.name}</strong></span>
            <span>(Mandante 100)</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>SAP NetWeaver 7.50 / S/4HANA</span>
            <span>•</span>
            <span>Suporte com Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab as any}
        badgeCount={userProfile.badges.length}
      />
    </div>
  );
}
