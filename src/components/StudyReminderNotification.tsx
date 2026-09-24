import React, { useEffect, useState } from 'react';
import { Bell, Flame, X, ArrowRight, Settings, CheckCircle2 } from 'lucide-react';
import { StudyReminderEventDetail } from '../utils/notificationService';

interface StudyReminderNotificationProps {
  onGoToQuiz: () => void;
  onOpenSettings: () => void;
}

export const StudyReminderNotification: React.FC<StudyReminderNotificationProps> = ({
  onGoToQuiz,
  onOpenSettings,
}) => {
  const [activeReminder, setActiveReminder] = useState<StudyReminderEventDetail | null>(null);

  useEffect(() => {
    const handleReminderEvent = (e: Event) => {
      const customEvent = e as CustomEvent<StudyReminderEventDetail>;
      if (customEvent.detail) {
        setActiveReminder(customEvent.detail);
      }
    };

    window.addEventListener('sap-study-reminder', handleReminderEvent);
    return () => {
      window.removeEventListener('sap-study-reminder', handleReminderEvent);
    };
  }, []);

  if (!activeReminder) return null;

  return (
    <div className="fixed top-16 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="bg-slate-900/95 dark:bg-slate-950/95 border-2 border-amber-500 text-white rounded-xl shadow-2xl p-4 backdrop-blur-md overflow-hidden relative">
        {/* Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white shadow-lg shrink-0 flex items-center justify-center">
              {activeReminder.hasExercisedToday ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <Flame className="w-5 h-5 text-white animate-pulse" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  Lembrete de Estudo
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  Streak: {activeReminder.streakDays}d 🔥
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-100 leading-tight">
                {activeReminder.title}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                {activeReminder.body}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveReminder(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={() => {
              setActiveReminder(null);
              onOpenSettings();
            }}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px] hover:underline"
          >
            <Settings className="w-3 h-3" />
            <span>Configurar horário</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveReminder(null)}
              className="px-2.5 py-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 text-[11px]"
            >
              Depois
            </button>

            <button
              onClick={() => {
                setActiveReminder(null);
                onGoToQuiz();
              }}
              className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-md transition-all cursor-pointer"
            >
              <span>Praticar Agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
