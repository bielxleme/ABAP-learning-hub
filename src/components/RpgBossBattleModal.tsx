import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Award, 
  Sword, 
  Flame, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { UserProfile, SimuladoResult, QuizDifficulty } from '../types';
import { ABAP_LEVELS, AbapLevelInfo } from '../data/abapLevels';
import { getRpgClassForLevel, RPG_RACES } from '../data/rpgAvatars';
import { RpgAvatarRenderer } from './RpgAvatarRenderer';
import { RpgBossRenderer } from './RpgBossRenderer';
import { sounds } from '../utils/soundEffects';

interface RpgBossBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: QuizDifficulty;
  simuladoResult: SimuladoResult;
  userProfile: UserProfile;
  soundEnabled: boolean;
}

export const RpgBossBattleModal: React.FC<RpgBossBattleModalProps> = ({
  isOpen,
  onClose,
  level,
  simuladoResult,
  userProfile,
  soundEnabled,
}) => {
  const levelMeta: AbapLevelInfo = 
    ABAP_LEVELS.find((l) => l.id === level) || ABAP_LEVELS[0];

  const heroRace = userProfile.rpgRace || 'guerreiro';
  const heroClass = getRpgClassForLevel(heroRace, levelMeta.number);
  const raceMeta = RPG_RACES[heroRace] || RPG_RACES.guerreiro;

  // Combat States
  const [battlePhase, setBattlePhase] = useState<'intro' | 'charging' | 'strike' | 'impact' | 'victory' | 'defeat'>('intro');
  const [bossHp, setBossHp] = useState<number>(levelMeta.boss.hp);
  const [showDamageNumber, setShowDamageNumber] = useState<boolean>(false);
  const [damageAmount, setDamageAmount] = useState<number>(0);
  const [projectilePos, setProjectilePos] = useState<number>(0);

  const isVictor = simuladoResult.passed;

  useEffect(() => {
    if (!isOpen) return;

    // Reset battle state
    setBattlePhase('intro');
    setBossHp(levelMeta.boss.hp);
    setShowDamageNumber(false);
    setProjectilePos(0);

    // Sequence execution
    const t1 = setTimeout(() => {
      setBattlePhase('charging');
      if (soundEnabled) sounds.playClick();
    }, 1200);

    const t2 = setTimeout(() => {
      setBattlePhase('strike');
      if (soundEnabled) sounds.playKey();
    }, 2400);

    const t3 = setTimeout(() => {
      setBattlePhase('impact');
      setShowDamageNumber(true);
      const calculatedDamage = isVictor ? levelMeta.boss.hp : Math.round(levelMeta.boss.hp * 0.45);
      setDamageAmount(calculatedDamage);
      setBossHp((prev) => Math.max(0, prev - calculatedDamage));

      if (soundEnabled) {
        if (isVictor) sounds.playSuccess();
        else sounds.playError();
      }
    }, 3200);

    const t4 = setTimeout(() => {
      if (isVictor) {
        setBattlePhase('victory');
        if (soundEnabled) sounds.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      } else {
        setBattlePhase('defeat');
      }
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, levelMeta, isVictor, soundEnabled]);

  if (!isOpen) return null;

  const handleReplay = () => {
    setBattlePhase('charging');
    setBossHp(levelMeta.boss.hp);
    setShowDamageNumber(false);

    setTimeout(() => {
      setBattlePhase('strike');
    }, 1000);

    setTimeout(() => {
      setBattlePhase('impact');
      setShowDamageNumber(true);
      const calculatedDamage = isVictor ? levelMeta.boss.hp : Math.round(levelMeta.boss.hp * 0.45);
      setDamageAmount(calculatedDamage);
      setBossHp((prev) => Math.max(0, prev - calculatedDamage));
    }, 1800);

    setTimeout(() => {
      if (isVictor) {
        setBattlePhase('victory');
        confetti({ particleCount: 70, spread: 70 });
      } else {
        setBattlePhase('defeat');
      }
    }, 2800);
  };

  const hpPercentage = Math.round((bossHp / levelMeta.boss.hp) * 100);

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f172a] text-white rounded-2xl border-2 border-[#38bdf8]/40 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col relative my-auto">
        {/* Top Battle Header */}
        <div className="bg-[#1e293b]/90 border-b border-slate-700 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">⚔️</span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-300 tracking-wide flex items-center gap-1.5">
                <span>BATALHA DE CHEFÃO DE NÍVEL</span>
                <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-mono">
                  {levelMeta.id}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300">
                Aproveitamento no Simulado: <strong className="text-emerald-400">{simuladoResult.percentage}%</strong> ({simuladoResult.score}/{simuladoResult.totalQuestions} questões)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Boss HP Bar */}
        <div className="bg-slate-900/90 px-4 sm:px-6 py-2.5 border-b border-slate-800 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 font-bold text-red-400">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>{levelMeta.boss.name}</span>
              <span className="text-[10px] text-slate-400 font-normal">({levelMeta.boss.title})</span>
            </div>
            <div className="font-mono text-xs font-bold text-amber-400">
              HP: {bossHp} / {levelMeta.boss.hp} ({hpPercentage}%)
            </div>
          </div>

          {/* Life Bar Meter */}
          <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                hpPercentage > 50
                  ? 'bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500'
                  : hpPercentage > 20
                  ? 'bg-gradient-to-r from-red-600 to-amber-500'
                  : 'bg-red-600'
              }`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        {/* Combat Stage Arena */}
        <div className="relative min-h-[300px] sm:min-h-[360px] bg-gradient-to-b from-[#0b132b] via-[#111c38] to-[#090e1f] p-4 sm:p-6 flex items-center justify-between overflow-hidden">
          {/* Background Arcane Particles */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0,transparent_70%)]" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Floating Damage Number */}
          {showDamageNumber && (
            <div className="absolute right-20 sm:right-32 top-24 sm:top-28 z-30 animate-bounce pointer-events-none text-center">
              <span className="text-3xl sm:text-4xl font-black text-yellow-300 drop-shadow-[0_4px_10px_rgba(239,68,68,0.8)] font-mono">
                -{damageAmount}!
              </span>
              <div className="text-xs font-bold text-red-300 uppercase tracking-widest">
                {isVictor ? 'DANO CRÍTICO DE SYNTAX!' : 'DANO PARCIAL'}
              </div>
            </div>
          )}

          {/* Hero Side (Left) */}
          <div className="flex flex-col items-center text-center z-10 space-y-2">
            <div className="relative">
              <RpgAvatarRenderer
                race={heroRace}
                level={levelMeta.number}
                size="full"
                pose={
                  battlePhase === 'strike'
                    ? heroClass.attackType === 'magic'
                      ? 'cast'
                      : 'attack'
                    : battlePhase === 'victory'
                    ? 'victory'
                    : battlePhase === 'charging'
                    ? 'cast'
                    : 'idle'
                }
              />

              {/* Slash / Spell VFX Trail */}
              {battlePhase === 'strike' && (
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-28 h-28 pointer-events-none">
                  {heroClass.attackType === 'melee' ? (
                    <div className="w-full h-full border-r-4 border-amber-300 rounded-full animate-ping opacity-75" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cyan-400 blur-sm animate-ping absolute right-0 top-1/2" />
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
              <div className="text-xs font-bold text-cyan-300">{userProfile.name}</div>
              <div className="text-[10px] text-amber-300 font-semibold">{heroClass.title}</div>
            </div>
          </div>

          {/* Center Action Narrative Pill */}
          <div className="flex flex-col items-center justify-center z-20 px-2 text-center max-w-[200px] sm:max-w-xs">
            {battlePhase === 'intro' && (
              <div className="bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl text-xs text-slate-200 animate-pulse">
                ⚔️ O chefão do {levelMeta.id} se aproxima ameaçando a produção!
              </div>
            )}

            {battlePhase === 'charging' && (
              <div className="bg-blue-950/90 border border-blue-500/50 p-2.5 rounded-xl text-xs text-blue-200 animate-pulse">
                ✨ Concentrando energia: <strong className="text-amber-300">{heroClass.skillName}</strong>!
              </div>
            )}

            {battlePhase === 'strike' && (
              <div className="bg-amber-950/90 border border-amber-500/60 p-2.5 rounded-xl text-xs text-amber-200 font-bold animate-bounce">
                💥 Desferindo {heroClass.skillName}!
              </div>
            )}

            {battlePhase === 'impact' && (
              <div className="bg-red-950/90 border border-red-500/60 p-2.5 rounded-xl text-xs text-red-200 font-bold">
                🎯 Golpe certeiro no ponto fraco: {levelMeta.boss.weakness}!
              </div>
            )}

            {battlePhase === 'victory' && (
              <div className="bg-emerald-950/90 border-2 border-emerald-400 p-3 rounded-xl text-xs text-emerald-200 font-bold shadow-lg space-y-1 animate-in zoom-in-90">
                <div className="text-amber-300 text-sm flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>VITÓRIA ÉPICA!</span>
                </div>
                <p className="text-[11px] text-emerald-100 font-normal">
                  O chefão foi banido do sistema e o mandante está seguro!
                </p>
              </div>
            )}

            {battlePhase === 'defeat' && (
              <div className="bg-amber-950/90 border border-amber-500 p-3 rounded-xl text-xs text-amber-200 font-bold space-y-1">
                <div>⚠️ Treinamento Necessário!</div>
                <p className="text-[10px] text-amber-100 font-normal">
                  Você tirou {simuladoResult.percentage}%. Revise os conceitos do {levelMeta.id} para desferir o golpe fatal!
                </p>
              </div>
            )}
          </div>

          {/* Boss Side (Right) */}
          <div className="flex flex-col items-center text-center z-10 space-y-2">
            <RpgBossRenderer
              levelNumber={levelMeta.number}
              boss={levelMeta.boss}
              isHit={battlePhase === 'strike' || battlePhase === 'impact'}
              isDefeated={battlePhase === 'victory'}
            />

            <div className="bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
              <div className="text-xs font-bold text-red-400">{levelMeta.boss.name}</div>
              <div className="text-[10px] text-slate-400">Chefão de Nível</div>
            </div>
          </div>
        </div>

        {/* Bottom Battle Footer & Rewards */}
        <div className="bg-[#1e293b] p-4 sm:p-5 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-1 text-center sm:text-left">
            {isVictor ? (
              <>
                <div className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center justify-center sm:justify-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Chefão derrotado! Nova classe desbloqueada: <strong>{heroClass.title}</strong></span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Recompensa: +300 XP • Badge Oficial • Título: <em>{levelMeta.titleReward}</em>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs sm:text-sm font-bold text-amber-300">
                  O chefão resistiu ao golpe final! (Nota de corte mínima: {levelMeta.passingScore}%)
                </div>
                <div className="text-[11px] text-slate-300">
                  Pratique mais exercícios e tente o simulado novamente quando estiver pronta!
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleReplay}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repetir Golpe</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#0070f2] hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continuar Jornada</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
