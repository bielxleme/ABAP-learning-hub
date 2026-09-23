import React, { useState, useMemo } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { UserProfile, UserAnswerHistory, UserErrorRecord } from '../types';
import { INITIAL_BADGES } from '../data/sapReference';
import { ErrorDiagnosticPanel } from './ErrorDiagnosticPanel';

interface ProgressProfileProps {
  userProfile: UserProfile;
  onUpdateProfileName: (newName: string) => void;
  onEquipTitle?: (title: string | 'auto') => void;
  answerHistory: UserAnswerHistory[];
  onResetProgress: () => void;
  onPracticeTopic?: (category: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION') => void;
  onClearResolvedErrors?: () => void;
}

export const ProgressProfile: React.FC<ProgressProfileProps> = ({
  userProfile,
  onUpdateProfileName,
  onEquipTitle,
  answerHistory,
  onResetProgress,
  onPracticeTopic,
  onClearResolvedErrors,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'diagnostics' | 'history'>('overview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'correct' | 'wrong'>('all');

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

  // Dynamic Visual Progression by Level (User requested prominent evolution per level)
  const levelTheme = useMemo(() => {
    switch (userProfile.level) {
      case 1:
        return {
          bannerBg: 'bg-gradient-to-r from-[#1b2a4a] to-[#253965]',
          borderClass: 'border border-[#304875] shadow-md',
          badgePill: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
          avatarRing: 'bg-gradient-to-tr from-blue-500 to-emerald-400 p-0.5',
          levelLabel: 'Fundamentos ABAP & NetWeaver',
          rankCrest: '🔰',
          glowStyle: '',
        };
      case 2:
        return {
          bannerBg: 'bg-gradient-to-r from-[#0a2738] via-[#0e3b4a] to-[#0c473d]',
          borderClass: 'border-2 border-emerald-400/80 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-400/30',
          badgePill: 'bg-emerald-400/30 text-emerald-200 border border-emerald-400/70 font-bold',
          avatarRing: 'bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 p-1 shadow-lg shadow-emerald-500/30',
          levelLabel: 'Dicionário de Dados SE11 & Open SQL',
          rankCrest: '🛡️',
          glowStyle: 'relative overflow-hidden before:absolute before:-right-10 before:-top-10 before:w-44 before:h-44 before:bg-emerald-500/15 before:rounded-full before:blur-2xl',
        };
      case 3:
        return {
          bannerBg: 'bg-gradient-to-r from-[#181d2a] via-[#33240e] to-[#1a1104]',
          borderClass: 'border-2 border-amber-400 shadow-2xl shadow-amber-500/30 ring-2 ring-amber-400/50',
          badgePill: 'bg-amber-400/30 text-amber-200 border border-amber-400/80 font-bold text-shadow',
          avatarRing: 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 p-1 ring-2 ring-amber-400 shadow-xl shadow-amber-500/40',
          levelLabel: 'Consultora ABAP Pleno VIP (ITAB & BAPIs)',
          rankCrest: '👑',
          glowStyle: 'relative overflow-hidden before:absolute before:-right-10 before:-top-10 before:w-56 before:h-56 before:bg-amber-500/20 before:rounded-full before:blur-2xl',
        };
      case 4:
        return {
          bannerBg: 'bg-gradient-to-r from-[#1c0e33] via-[#35104f] to-[#130722]',
          borderClass: 'border-2 border-fuchsia-400 shadow-2xl shadow-purple-500/40 ring-2 ring-fuchsia-400/60',
          badgePill: 'bg-fuchsia-400/30 text-fuchsia-200 border border-fuchsia-400/80 font-bold',
          avatarRing: 'bg-gradient-to-tr from-purple-400 via-pink-400 to-indigo-400 p-1 ring-2 ring-fuchsia-300 shadow-2xl shadow-purple-500/50',
          levelLabel: 'Arquiteta ABAP OO & Design Patterns',
          rankCrest: '💎',
          glowStyle: 'relative overflow-hidden before:absolute before:-right-10 before:-top-10 before:w-64 before:h-64 before:bg-fuchsia-500/25 before:rounded-full before:blur-3xl',
        };
      default: // Level 5+
        return {
          bannerBg: 'bg-gradient-to-r from-[#090714] via-[#261304] to-[#1c0524]',
          borderClass: 'border-2 border-amber-300 shadow-2xl shadow-amber-400/50 ring-4 ring-amber-400/70',
          badgePill: 'bg-gradient-to-r from-amber-400/40 to-yellow-300/40 text-amber-100 border border-amber-300 font-extrabold',
          avatarRing: 'bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-500 p-1.5 ring-4 ring-amber-300 shadow-2xl shadow-amber-400/60',
          levelLabel: 'Mestre SAP S/4HANA & ABAP RAP Guru',
          rankCrest: '🏆',
          glowStyle: 'relative overflow-hidden before:absolute before:-right-12 before:-top-12 before:w-80 before:h-80 before:bg-gradient-to-br before:from-amber-500/30 before:to-red-500/20 before:rounded-full before:blur-3xl',
        };
    }
  }, [userProfile.level]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Dynamic Visual Progression per Level */}
      <div className={`${levelTheme.bannerBg} ${levelTheme.borderClass} ${levelTheme.glowStyle} text-white rounded-xl p-5 sm:p-6 transition-all duration-300`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* User Details */}
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${levelTheme.avatarRing} flex items-center justify-center shrink-0`}>
              <div className="w-full h-full bg-[#16233d] rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-inner">
                {userProfile.avatar || userProfile.name.charAt(0).toUpperCase()}
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
                      className="text-blue-300 hover:text-white p-1"
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
            <span>Evolução para Nível {userProfile.level + 1}</span>
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
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-b-2 border-[#0070f2] text-[#0070f2] bg-blue-50/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Visão Geral & Conquistas ({userProfile.badges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'diagnostics'
              ? 'border-b-2 border-amber-500 text-amber-700 bg-amber-50/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Diagnóstico de Erros & Recuperação</span>
          {(userProfile.errorLogs?.length || 0) > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
              {userProfile.errorLogs?.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-2 rounded-t-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'border-b-2 border-[#0070f2] text-[#0070f2] bg-blue-50/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Histórico de Respostas ({answerHistory.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & BADGES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
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
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${
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
                  const isSelected = userProfile.equippedTitle === title;

                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => onEquipTitle && onEquipTitle(title)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 ${
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

      {/* TAB 2: DIAGNOSTICS & RECOVERY */}
      {activeTab === 'diagnostics' && (
        <ErrorDiagnosticPanel
          errorLogs={userProfile.errorLogs || []}
          answerHistory={answerHistory}
          onPracticeTopic={onPracticeTopic}
          onClearResolvedErrors={onClearResolvedErrors}
        />
      )}

      {/* TAB 3: HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Histórico de Tentativas no Quiz
            </h3>

            <div className="flex items-center space-x-1.5 text-xs">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`px-2.5 py-1 rounded ${historyFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Todas ({answerHistory.length})
              </button>
              <button
                onClick={() => setHistoryFilter('correct')}
                className={`px-2.5 py-1 rounded ${historyFilter === 'correct' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Acertos ({answerHistory.filter((a) => a.isCorrect).length})
              </button>
              <button
                onClick={() => setHistoryFilter('wrong')}
                className={`px-2.5 py-1 rounded ${historyFilter === 'wrong' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
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

      {/* Danger Zone: Reset Progress */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          onClick={() => {
            if (window.confirm('Tem certeza de que deseja resetar todo o progresso do usuário? Essa ação não pode ser desfeita.')) {
              onResetProgress();
            }
          }}
          className="text-xs text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Todo o Progresso Deste Usuário</span>
        </button>
      </div>
    </div>
  );
};
