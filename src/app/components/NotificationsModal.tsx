import { useState, useEffect } from 'react';
import { Bell, BookOpen, CheckCircle2, Trash2, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  AppNotification,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  clearNotifications,
} from '../services/notificationService';

interface NotificationsModalProps {
  onCountChange?: (count: number) => void;
}

export function NotificationsModal({ onCountChange }: NotificationsModalProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);

  function refresh() {
    const list = getNotifications();
    const count = getUnreadCount();
    setNotifications(list);
    setUnread(count);
    onCountChange?.(count);
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleOpen() {
    setOpen(true);
    markAllAsRead();
    setUnread(0);
    onCountChange?.(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleClose() {
    setOpen(false);
  }

  function handleClear() {
    clearNotifications();
    setNotifications([]);
    setUnread(0);
    onCountChange?.(0);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent transition-colors"
      >
        <Bell className="w-5 h-5" />
        <span className="flex-1 text-left">Notifications</span>
        {unread > 0 && (
          <Badge className="bg-destructive text-destructive-foreground">
            {unread}
          </Badge>
        )}
      </button>

      {/* Backdrop + modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-start md:justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleClose}
          />

          {/* Panel */}
          <div className="relative z-10 w-full md:w-96 md:m-4 bg-card border border-border rounded-xl shadow-2xl flex flex-col max-h-[70vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-secondary">Notificações</h3>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground h-7 px-2 gap-1"
                    onClick={handleClear}
                  >
                    <Trash2 className="w-3 h-3" />
                    Limpar
                  </Button>
                )}
                <button
                  onClick={handleClose}
                  className="p-1 rounded-md hover:bg-accent text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                  <Bell className="w-8 h-8 opacity-30" />
                  <p className="text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`flex items-start gap-3 p-4 ${!n.read ? 'bg-primary/5' : ''}`}
                    >
                      <div
                        className={`mt-0.5 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                          n.type === 'borrowed'
                            ? 'bg-primary/15 text-primary'
                            : 'bg-success/15 text-success'
                        }`}
                      >
                        {n.type === 'borrowed' ? (
                          <BookOpen className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary leading-snug">
                          {n.type === 'borrowed'
                            ? 'Livro emprestado'
                            : 'Livro devolvido'}
                        </p>
                        <p className="text-sm text-foreground truncate">{n.bookTitle}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {n.bookAuthor}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(n.date)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
