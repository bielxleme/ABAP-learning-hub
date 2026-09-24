import { UserProfile, StudyNotificationSettings } from '../types';

export type NotificationStatus = 'granted' | 'denied' | 'default' | 'unsupported';

export interface StudyReminderEventDetail {
  title: string;
  body: string;
  isTest?: boolean;
  streakDays: number;
  hasExercisedToday: boolean;
  timestamp: string;
}

/**
 * Checks whether the browser supports the Web Notification API
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Returns current permission status ('granted', 'denied', 'default', or 'unsupported')
 */
export function getNotificationPermission(): NotificationStatus {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission as NotificationStatus;
}

/**
 * Requests permission to show notifications from the user.
 * Catches errors if running in restricted sandboxes/iframes.
 */
export async function requestNotificationPermission(): Promise<NotificationStatus> {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationStatus;
  } catch (error) {
    console.warn('Notification permission request was restricted or blocked:', error);
    return Notification.permission as NotificationStatus;
  }
}

/**
 * Dispatches the in-app notification event so the UI banner/toast reacts immediately
 */
export function dispatchInAppStudyReminder(detail: StudyReminderEventDetail): void {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent<StudyReminderEventDetail>('sap-study-reminder', {
    detail,
  });
  window.dispatchEvent(event);
}

/**
 * Sends a native browser notification if permitted, and always emits the in-app study reminder event
 */
export async function sendStudyReminder(
  profile: UserProfile,
  isTest = false
): Promise<{ success: boolean; nativeSent: boolean; message: string }> {
  const todayStr = new Date().toISOString().slice(0, 10);
  const hasExercisedToday = profile.lastExerciseDate === todayStr;
  const streak = profile.streakDays || 1;

  let title = '';
  let body = '';

  if (isTest) {
    title = `🔔 SAP ABAP Hub: Notificação Ativa!`;
    body = `Perfeito, ${profile.name}! Seus lembretes diários de estudo estão configurados. Seu streak atual é de ${streak} dias seguidos!`;
  } else if (!hasExercisedToday) {
    title = `🔥 Atenção ao seu Streak SAP: ${streak} ${streak === 1 ? 'dia' : 'dias'} em jogo!`;
    body = `Olá ${profile.name}! Você ainda não completou seu treino de ABAP hoje. Resolva 1 exercício para manter sua sequência e ganhar bônus de XP!`;
  } else {
    title = `🌟 Treino em Dia no SAP ABAP Hub!`;
    body = `Excelente disciplina, ${profile.name}! Seu streak de ${streak} dias está garantido hoje. Pronto para encarar mais um desafio?`;
  }

  const detail: StudyReminderEventDetail = {
    title,
    body,
    isTest,
    streakDays: streak,
    hasExercisedToday,
    timestamp: new Date().toISOString(),
  };

  // Always dispatch the in-app event so users inside iframes and background tabs see it
  dispatchInAppStudyReminder(detail);

  let nativeSent = false;

  // Try sending native Web Notification if permission is granted
  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      // Try service worker first for mobile PWA support
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        const registration = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 500)),
        ]);

        if (registration && 'showNotification' in registration) {
          await registration.showNotification(title, {
            body,
            icon: '/pwa-192x192.png',
            badge: '/favicon.png',
            tag: 'sap-abap-study-reminder',
            data: { url: '/' },
          });
          nativeSent = true;
        }
      }

      // Fallback to window.Notification constructor
      if (!nativeSent) {
        const notif = new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
          tag: 'sap-abap-study-reminder',
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
        nativeSent = true;
      }
    } catch (err) {
      console.warn('Native notification failed (likely sandbox or iframe restriction):', err);
    }
  }

  return {
    success: true,
    nativeSent,
    message: nativeSent
      ? 'Notificação enviada com sucesso no navegador e aplicativo!'
      : 'Lembrete ativado no aplicativo! (Notificações do navegador podem requerer permissão).',
  };
}

/**
 * Checks if a daily reminder should be triggered based on user settings and current time
 */
export function checkStudyReminderDue(profile: UserProfile): boolean {
  const settings = profile.notificationSettings;
  if (!settings || !settings.enabled) return false;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // Already notified today
  if (settings.lastNotificationDate === todayStr) {
    return false;
  }

  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinutes;

  // Target reminder time
  const [targetH, targetM] = (settings.reminderTime || '19:00')
    .split(':')
    .map((v) => parseInt(v, 10) || 0);
  const targetTimeMinutes = targetH * 60 + targetM;

  const hasExercisedToday = profile.lastExerciseDate === todayStr;

  // Streak protection: if evening (after 18:00) and user hasn't trained yet
  if (settings.streakProtection && !hasExercisedToday && currentHour >= 18) {
    return true;
  }

  // Regular scheduled time check (within 45 minutes of scheduled time)
  if (currentTimeMinutes >= targetTimeMinutes && currentTimeMinutes <= targetTimeMinutes + 45) {
    return true;
  }

  return false;
}

/**
 * Default notification configuration
 */
export const DEFAULT_NOTIFICATION_SETTINGS: StudyNotificationSettings = {
  enabled: true,
  reminderTime: '19:00',
  streakProtection: true,
  weekendReminders: true,
};
