import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  add(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    const notification: Notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    this.notifications.unshift(notification);
    this.notificationsSubject.next([...this.notifications]);

    // Auto-disparaît après 5 secondes
    setTimeout(() => this.remove(notification.id), 5000);
  }

  remove(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsSubject.next([...this.notifications]);
  }

  markAllRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next([...this.notifications]);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  clear(): void {
    this.notifications = [];
    this.notificationsSubject.next([]);
  }
}