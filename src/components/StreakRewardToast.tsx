import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StreakRewardToastProps {
  message: string | null;
  bonusXp: number;
  streakDays: number;
  onDismiss: () => void;
}

export const StreakRewardToast: React.FC<StreakRewardToastProps> = ({
  message,
  bonusXp,
  streakDays,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2 },
      });

      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!visible || !message) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 p-3.5 rounded-xl shadow-2xl border-2 border-yellow-300 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-yellow-100 fill-yellow-200 animate-pulse" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm text-slate-950 flex items-center gap-1.5">
              <span>{streakDays} Dias de Sequência Ativa!</span>
              <span className="bg-yellow-200 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono">
                +{bonusXp} XP
              </span>
            </div>
            <p className="text-[11px] text-slate-900 font-medium leading-tight mt-0.5">
              {message}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          className="p-1 text-slate-800 hover:text-black rounded transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
