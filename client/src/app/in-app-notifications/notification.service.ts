import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppNotification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notifications.asObservable();

  addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: AppNotification = {
      ...notification,
      id: Math.random().toString(36).substring(2),
      timestamp: new Date(),
      read: false
    };
    this.notifications.next([newNotification, ...this.notifications.value]);
  }

  markAsRead(id: string) {
    const updated = this.notifications.value.map(n => 
      n.id === id ? {...n, read: true} : n
    );
    this.notifications.next(updated);
  }

  clearNotification(id: string) {
    const updated = this.notifications.value.filter(n => n.id !== id);
    this.notifications.next(updated);
  }

  clearAll() {
    this.notifications.next([]);
  }
}