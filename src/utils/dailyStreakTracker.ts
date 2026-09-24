import { UserProfile } from '../types';

export interface StreakEvaluationResult {
  updatedProfile: UserProfile;
  awardedBonusXp: number;
  streakDays: number;
  toastMessage: string | null;
}

export function processDailyExerciseReward(profile: UserProfile): StreakEvaluationResult {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
  
  const yesterday = new Date(Date.now() - 86400000);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // If already claimed bonus for today, just update lastActiveDate
  if (profile.dailyStreakBonusClaimedDate === todayStr) {
    return {
      updatedProfile: {
        ...profile,
        lastActiveDate: now.toISOString(),
      },
      awardedBonusXp: 0,
      streakDays: profile.streakDays || 1,
      toastMessage: null,
    };
  }

  let newStreak = profile.streakDays || 1;
  let bonusXp = 50;

  if (profile.lastExerciseDate === yesterdayStr) {
    // Perfect consecutive day!
    newStreak += 1;
    // Scale bonus: 50 -> 75 -> 100 -> 125 -> 150 max
    bonusXp = 50 + Math.min(150, (newStreak - 1) * 25);
  } else if (!profile.lastExerciseDate || profile.lastExerciseDate < yesterdayStr) {
    // Missed a day or first time
    newStreak = 1;
    bonusXp = 50;
  } else if (profile.lastExerciseDate === todayStr) {
    // Same day
    newStreak = Math.max(1, profile.streakDays || 1);
  }

  const message = newStreak > 1
    ? `🔥 Bônus de Streak Diário Ativo! ${newStreak} dias seguidos no SAP Learning Hub! +${bonusXp} XP Extra Concedido!`
    : `🔥 Primeiro exercício do dia concluído! Sequência diária iniciada! +${bonusXp} XP Extra Concedido!`;

  return {
    updatedProfile: {
      ...profile,
      xp: profile.xp + bonusXp,
      streakDays: newStreak,
      lastActiveDate: now.toISOString(),
      lastExerciseDate: todayStr,
      dailyStreakBonusClaimedDate: todayStr,
    },
    awardedBonusXp: bonusXp,
    streakDays: newStreak,
    toastMessage: message,
  };
}
