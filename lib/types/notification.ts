// Notification-related type definitions

export interface Notification {
  id: string;
  recipientId: string;
  type: 'follow' | 'message' | 'mention' | 'comment' | 'reaction';
  actorId: string;
  entityId?: string;
  entityType?: 'post' | 'comment' | 'message';
  read: boolean;
  createdAt: Date;
}

export interface NotificationPreferences {
  userId: string;
  followNotifications: boolean;
  messageNotifications: boolean;
  mentionNotifications: boolean;
  commentNotifications: boolean;
  reactionNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}