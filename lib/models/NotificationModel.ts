// Notification model class for handling notification operations
import { Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class NotificationModel {
  static createNotification(
    recipientId: string,
    type: 'follow' | 'message' | 'mention' | 'comment' | 'reaction',
    actorId: string,
    entityId?: string,
    entityType?: 'post' | 'comment' | 'message'
  ): Notification {
    return {
      id: uuidv4(),
      recipientId,
      type,
      actorId,
      entityId,
      entityType,
      read: false,
      createdAt: new Date()
    };
  }

  static markAsRead(notification: Notification): Notification {
    return {
      ...notification,
      read: true
    };
  }

  static markAllAsRead(notifications: Notification[]): Notification[] {
    return notifications.map(notification => ({
      ...notification,
      read: true
    }));
  }

  static filterByType(
    notifications: Notification[],
    types: ('follow' | 'message' | 'mention' | 'comment' | 'reaction')[]
  ): Notification[] {
    return notifications.filter(notification => types.includes(notification.type));
  }

  static getUnreadCount(notifications: Notification[]): number {
    return notifications.filter(notification => !notification.read).length;
  }

  static sortByDate(notifications: Notification[], ascending: boolean = false): Notification[] {
    return [...notifications].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  static validateNotification(notification: Partial<Notification>): boolean {
    if (!notification.recipientId || !notification.type || !notification.actorId) {
      return false;
    }

    // Cannot notify yourself
    if (notification.recipientId === notification.actorId) {
      return false;
    }

    return true;
  }
}