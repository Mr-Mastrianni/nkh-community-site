// Notification service for API interactions
import axios from 'axios';
import { Notification, NotificationPreferences } from '../types';

export class NotificationService {
  private static baseUrl = '/api/notifications';

  static async getNotifications(userId: string, page: number = 1, limit: number = 20): Promise<Notification[]> {
    const response = await axios.get(`${this.baseUrl}/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const response = await axios.get(`${this.baseUrl}/${userId}/unread-count`);
    return response.data.count;
  }

  static async markAsRead(notificationId: string): Promise<void> {
    await axios.put(`${this.baseUrl}/${notificationId}/read`);
  }

  static async markAllAsRead(userId: string): Promise<void> {
    await axios.put(`${this.baseUrl}/${userId}/read-all`);
  }

  static async getPreferences(userId: string): Promise<NotificationPreferences> {
    const response = await axios.get(`${this.baseUrl}/${userId}/preferences`);
    return response.data;
  }

  static async updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await axios.put(`${this.baseUrl}/${userId}/preferences`, preferences);
    return response.data;
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${notificationId}`);
  }

  static async getNotificationsByType(
    userId: string,
    type: 'follow' | 'message' | 'mention' | 'comment' | 'reaction',
    page: number = 1,
    limit: number = 20
  ): Promise<Notification[]> {
    const response = await axios.get(`${this.baseUrl}/${userId}/type/${type}`, {
      params: { page, limit }
    });
    return response.data;
  }
}