import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Play, Terminal, HelpCircle, Code2, Bot, Award, Sparkles, BookOpen, Bug, LogIn } from 'lucide-react';
import { UserProfile, UserAnswerHistory, SimulationResult, SimuladoResult } from './types';
import { INITIAL_BADGES, INITIAL_ABAP_CODE } from './data/sapReference';
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
import { simulateAbapExecution } from './utils/abapLinter';
import { sounds } from './utils/soundEffects';

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

  // Current User Profile State
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
      name: 'BLEME',
      avatar: '👩‍💻',
      xp: 150,
      level: 1,
      rankTitle: 'Estagiária ABAP (SE38)',
      streakDays: 2,
      lastActiveDate: new Date().toISOString(),
      completedQuestionIds: [],
      badges: ['badge_first_step'],
      soundEnabled: true,
    };
  });

  // Individual Answer History State for the active user
  const [answerHistory, setAnswerHistory] = useState<UserAnswerHistory[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const activeUser = localStorage.getItem(STORAGE_ACTIVE_USER_KEY) || 'BLEME';
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

  // Dynamic Rank Title calculation
  const calculateRankTitle = (xp: number): { title: string; level: number } => {
    if (xp >= 1800) return { title: 'Arquiteta SAP & Mestre em ABAP', level: 3 };
    if (xp >= 1000) return { title: 'Especialista ABAP Sênior', level: 3 };
    if (xp >= 500) return { title: 'Consultora ABAP Pleno', level: 2 };
    if (xp >= 200) return { title: 'Desenvolvedora ABAP Júnior', level: 2 };
    return { title: 'Estagiária ABAP (SE38)', level: 1 };
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

  const handleResetProgress = () => {
    if (userProfile.name) {
      localStorage.removeItem(`sap_abap_user_${userProfile.name}_profile`);
      localStorage.removeItem(`sap_abap_user_${userProfile.name}_history`);
      localStorage.removeItem(`sap_abap_user_${userProfile.name}_code`);
    }
    setUserProfile({
      name: userProfile.name || 'BLEME',
      avatar: userProfile.avatar || '👩‍💻',
      xp: 0,
      level: 1,
      rankTitle: 'Estagiária ABAP (SE38)',
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      completedQuestionIds: [],
      badges: ['badge_first_step'],
      soundEnabled: true,
    });
    setAnswerHistory([]);
    setCurrentCode(INITIAL_ABAP_CODE);
    setConsecutiveCorrect(0);
    setSuccessfulSimulationsCount(0);
  };

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-slate-800 flex flex-col font-sans">
      {/* SAP Logon Modal: Shown first or when user requests to switch accounts */}
      <SapLogonModal
        isOpen={isLogonOpen}
        currentProfile={userProfile}
        onLogin={handleUserLogin}
        canCancel={Boolean(userProfile.name)}
        onClose={() => setIsLogonOpen(false)}
      />

      {/* Top SAP Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab as any}
        userProfile={userProfile}
        toggleSound={handleToggleSound}
        onOpenLogon={() => setIsLogonOpen(true)}
        onOpenGlossary={() => {
          setGlossaryOverlayInitialTerm('SELECT');
          setIsGlossaryOverlayOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 space-y-6">
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
              soundEnabled={userProfile.soundEnabled}
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
            onUpdateProfileName={handleUpdateProfileName}
            onEquipTitle={handleEquipTitle}
            answerHistory={answerHistory}
            onResetProgress={handleResetProgress}
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
    </div>
  );
}
