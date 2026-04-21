const NOTIFICATIONS_KEY = 'notifications';

export type NotificationType = 'borrowed' | 'returned';

export interface AppNotification {
  id: string;
  type: NotificationType;
  bookTitle: string;
  bookAuthor: string;
  date: string; // ISO string
  read: boolean;
}

function read(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function write(notifications: AppNotification[]): void {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

export function getNotifications(): AppNotification[] {
  return read();
}

export function getUnreadCount(): number {
  return read().filter((n) => !n.read).length;
}

export function addNotification(
  type: NotificationType,
  bookTitle: string,
  bookAuthor: string
): void {
  const notification: AppNotification = {
    id: `notif-${Date.now()}`,
    type,
    bookTitle,
    bookAuthor,
    date: new Date().toISOString(),
    read: false,
  };
  write([notification, ...read()]);
}

export function markAllAsRead(): void {
  write(read().map((n) => ({ ...n, read: true })));
}

export function clearNotifications(): void {
  write([]);
}
