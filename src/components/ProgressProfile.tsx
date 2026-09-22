import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  User, 
  Calendar, 
  History, 
  RotateCcw, 
  Lock, 
  Unlock,
  BookOpen,
  Filter,
  Check,
  Edit2
} from 'lucide-react';
import { UserProfile, UserAnswerHistory, Badge } from '../types';
import { INITIAL_BADGES } from '../data/sapReference';

interface ProgressProfileProps {
  userProfile: UserProfile;
  onUpdateProfileName: (newName: string) => void;
  onEquipTitle?: (title: string | 'auto') => void;
  answerHistory: UserAnswerHistory[];
  onResetProgress: () => void;
}

export const ProgressProfile: React.FC<ProgressProfileProps> = ({
  userProfile,
  onUpdateProfileName,
  onEquipTitle,
  answerHistory,
  onResetProgress,
}) => {
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

  // Collect all unlocked titles: base titles + titles from unlocked badges
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

  return (
    <div className="space-y-6">
      {/* Top Banner: User Card + XP Stats */}
      <div className="bg-gradient-to-r from-[#1b2a4a] to-[#253965] text-white rounded-lg p-5 sm:p-6 shadow-md border border-[#304875]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* User Details */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-md shrink-0">
              <div className="w-full h-full bg-[#16233d] rounded-full flex items-center justify-center text-xl font-bold text-white">
                {userProfile.name.charAt(0).toUpperCase()}
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
                    <h2 className="text-lg sm:text-xl font-bold text-white">{userProfile.name}</h2>
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

              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {userProfile.rankTitle}
                </span>
                <span className="text-blue-200 text-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {userProfile.streakDays} dias de streak
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-4 sm:space-x-6 bg-slate-900/40 p-3.5 rounded-lg border border-white/10">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-yellow-300">{userProfile.xp}</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Total XP</div>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-blue-300">Nível {userProfile.level}</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Graduação</div>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-300">
                {userProfile.completedQuestionIds.length}
              </div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Concluídos</div>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-5 space-y-1.5 pt-4 border-t border-white/10">
          <div className="flex justify-between text-xs font-semibold text-blue-200">
            <span>Progresso para Nível {userProfile.level + 1}</span>
            <span>
              {xpInLevel} / {xpNeeded} XP ({Math.round(progressPct)}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Gamification Titles Selector (User requested custom unlocked titles) */}
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
                Título atual exibido abaixo do seu usuário: <strong className="text-[#0070f2] font-mono">{userProfile.rankTitle}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEquipTitle && onEquipTitle('auto')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                isAutoTitle
                  ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              Modo Automático (Evolução por XP)
            </button>
          </div>
        </div>

        {/* Unlocked Titles Grid */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-600 block">
            Títulos Desbloqueados ({availableUnlockedTitles.length}):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {availableUnlockedTitles.map((title) => {
              const isEquipped = userProfile.rankTitle === title && (!isAutoTitle || userProfile.equippedTitle === title);

              return (
                <button
                  key={title}
                  onClick={() => onEquipTitle && onEquipTitle(title)}
                  className={`p-3 rounded-md text-left transition-all border flex items-center justify-between cursor-pointer ${
                    isEquipped
                      ? 'bg-blue-50/90 border-[#0070f2] text-blue-950 shadow-xs ring-1 ring-[#0070f2]'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-xs truncate flex items-center gap-1.5">
                      <span>{title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {title === 'Estagiária ABAP (SE38)'
                        ? 'Título Inicial Padrão'
                        : title.includes('Banco de Dados')
                        ? 'Conquista: 10 Consultas SQL'
                        : title.includes('Simulado') || title.includes('Certificação')
                        ? 'Conquista: Aprovada em Simulado'
                        : 'Conquista Desbloqueada'}
                    </span>
                  </div>
                  {isEquipped ? (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[11px] text-blue-600 font-semibold hover:underline shrink-0">
                      Equipar
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Conquistas e Badges Desbloqueáveis ({userProfile.badges.length}/{INITIAL_BADGES.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Reconhecimento de Maestria SAP</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INITIAL_BADGES.map((badge) => {
            const isUnlocked = userProfile.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-lg border flex items-start space-x-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/50 border-amber-300 text-slate-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-65'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold truncate ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                      {badge.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                        Desbloqueado
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{badge.description}</p>
                  
                  {/* Badge Unlocked Title Reward */}
                  {badge.unlockedTitle && (
                    <div className="mt-1 pt-1 border-t border-amber-200/60 flex items-center justify-between text-[10px]">
                      <span className="text-amber-900 font-medium truncate">
                        👑 Título: <strong className="font-bold text-amber-950">{badge.unlockedTitle}</strong>
                      </span>
                      {isUnlocked && onEquipTitle && (
                        <button
                          onClick={() => onEquipTitle(badge.unlockedTitle!)}
                          className="ml-2 text-blue-700 hover:text-blue-900 font-bold shrink-0 underline"
                        >
                          {userProfile.rankTitle === badge.unlockedTitle ? 'Ativo' : 'Usar'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer History & Study Review */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Histórico de Respostas para Revisão ({answerHistory.length})
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500">Filtrar:</span>
            <button
              onClick={() => setHistoryFilter('all')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                historyFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setHistoryFilter('correct')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                historyFilter === 'correct'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Acertos
            </button>
            <button
              onClick={() => setHistoryFilter('wrong')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                historyFilter === 'wrong'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Erros
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-sans">
            Nenhum histórico registrado com este filtro. Comece a resolver desafios na aba de Quizzes!
          </div>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredHistory.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  item.isCorrect
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                    : 'bg-red-50/50 border-red-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold">
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span className="text-slate-900">{item.questionTitle}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
                </div>

                <div className="text-[11px] text-slate-600 bg-white/70 p-2 rounded border border-slate-200/60 font-sans">
                  <span className="font-semibold text-slate-700">Explicação: </span>
                  {item.feedback}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-700">Redefinir Dados de Aprendizado</div>
          <div className="text-[11px] text-slate-500">Zera os pontos XP, histórico e badges desbloqueadas.</div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Tem certeza de que deseja resetar todo o seu progresso no Learning Hub?')) {
              onResetProgress();
            }
          }}
          className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Resetar Progresso</span>
        </button>
      </div>
    </div>
  );
};
