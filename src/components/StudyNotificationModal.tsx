import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Check, 
  Clock, 
  Flame, 
  ShieldAlert, 
  X, 
  Sparkles, 
  AlertTriangle,
  Send,
  Volume2
} from 'lucide-react';
import { UserProfile, StudyNotificationSettings } from '../types';
import { 
  getNotificationPermission, 
  isNotificationSupported, 
  requestNotificationPermission, 
  sendStudyReminder,
  NotificationStatus,
  DEFAULT_NOTIFICATION_SETTINGS
} from '../utils/notificationService';

interface StudyNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateSettings: (settings: StudyNotificationSettings) => void;
}

export const StudyNotificationModal: React.FC<StudyNotificationModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateSettings,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationStatus>('default');
  const [enabled, setEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>('19:00');
  const [streakProtection, setStreakProtection] = useState<boolean>(true);
  const [weekendReminders, setWeekendReminders] = useState<boolean>(true);
  const [testStatusMessage, setTestStatusMessage] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPermissionStatus(getNotificationPermission());
      const current = userProfile.notificationSettings || DEFAULT_NOTIFICATION_SETTINGS;
      setEnabled(current.enabled);
      setReminderTime(current.reminderTime || '19:00');
      setStreakProtection(current.streakProtection ?? true);
      setWeekendReminders(current.weekendReminders ?? true);
      setTestStatusMessage(null);
    }
  }, [isOpen, userProfile.notificationSettings]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const status = await requestNotificationPermission();
    setPermissionStatus(status);
    if (status === 'granted') {
      setTestStatusMessage('Permissão concedida pelo navegador! Agora você receberá os alertas.');
    } else if (status === 'denied') {
      setTestStatusMessage('Notificações bloqueadas pelo navegador. Você pode liberá-las nas configurações do site (ícone de cadeado na barra de endereços).');
    }
  };

  const handleSendTestNotification = async () => {
    setIsSendingTest(true);
    setTestStatusMessage(null);

    // If permission is default, try to request it first
    if (permissionStatus === 'default') {
      const status = await requestNotificationPermission();
      setPermissionStatus(status);
    }

    const result = await sendStudyReminder(userProfile, true);
    setIsSendingTest(false);
    setTestStatusMessage(result.message);
  };

  const handleSave = () => {
    const updated: StudyNotificationSettings = {
      enabled,
      reminderTime,
      streakProtection,
      weekendReminders,
      lastNotificationDate: userProfile.notificationSettings?.lastNotificationDate,
    };
    onUpdateSettings(updated);
    onClose();
  };

  const timePresets = [
    { label: '09:00 (Manhã)', value: '09:00' },
    { label: '13:00 (Almoço)', value: '13:00' },
    { label: '18:00 (Fim de Tarde)', value: '18:00' },
    { label: '20:00 (Noite)', value: '20:00' },
    { label: '21:30 (Antes de Dormir)', value: '21:30' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col font-sans">
        
        {/* Modal Header */}
        <div className="bg-[#1b2a4a] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#2d4373]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg">
              <BellRing className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                <span>Lembretes Diários de Estudo</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                  Streak Protection
                </span>
              </h3>
              <p className="text-xs text-blue-200">
                Mantenha sua disciplina e sequência diária de logins com a Notification API
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-700/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs sm:text-sm overflow-y-auto max-h-[75vh]">
          
          {/* Browser Permission Status Card */}
          <div className="p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <span>Status da Permissão no Navegador:</span>
                {permissionStatus === 'granted' && (
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Permitido
                  </span>
                )}
                {permissionStatus === 'default' && (
                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-2 py-0.5 rounded text-[11px] font-bold">
                    Pendente
                  </span>
                )}
                {permissionStatus === 'denied' && (
                  <span className="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Bloqueado
                  </span>
                )}
                {permissionStatus === 'unsupported' && (
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                    Não Suportado
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {permissionStatus === 'granted'
                  ? 'O navegador enviará notificações mesmo com a aba em segundo plano.'
                  : permissionStatus === 'denied'
                  ? 'Você bloqueou as notificações para este site. Desbloqueie nas permissões do navegador se desejar alertas do sistema.'
                  : 'Clique no botão ao lado para autorizar o navegador a enviar notificações de estudo.'}
              </p>
            </div>

            {permissionStatus !== 'granted' && isNotificationSupported() && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-3 py-1.5 bg-[#0070f2] hover:bg-blue-600 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer shadow-sm transition-colors"
              >
                Autorizar Notificações
              </button>
            )}
          </div>

          {/* Test Status Alert */}
          {testStatusMessage && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>{testStatusMessage}</span>
            </div>
          )}

          {/* Setting 1: Enable Study Reminders */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <div className="space-y-0.5">
              <label className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                <span>Ativar Lembretes Diários de Estudo</span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Receba avisos para praticar ABAP todos os dias e aumentar seu streak
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Setting 2: Streak Protection */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <div className="space-y-0.5">
              <label className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Alerta de Risco de Streak</span>
                <span className="bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  Recomendado
                </span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Avisa no final da tarde se você ainda não tiver resolvido nenhum exercício no dia
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={streakProtection}
                disabled={!enabled}
                onChange={(e) => setStreakProtection(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500 disabled:opacity-50"></div>
            </label>
          </div>

          {/* Setting 3: Preferred Reminder Time */}
          <div className={`space-y-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Horário Preferido do Lembrete:</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Escolha um dos horários recomendados ou defina o horário exato:
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {timePresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setReminderTime(preset.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    reminderTime === preset.value
                      ? 'bg-[#0070f2] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Horário Personalizado:</span>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-2.5 py-1 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Test Notification Trigger */}
          <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-300/40 dark:border-amber-700/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Testar Notificação Agora</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Dispara um lembrete imediato para testar o envio nativo e o banner visual no app.
              </p>
            </div>

            <button
              type="button"
              disabled={isSendingTest}
              onClick={handleSendTestNotification}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isSendingTest ? 'Enviando...' : 'Testar Agora'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Sequência Atual: <strong className="text-amber-600 dark:text-amber-400">{userProfile.streakDays || 1} dias</strong>
          </span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Preferências</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
