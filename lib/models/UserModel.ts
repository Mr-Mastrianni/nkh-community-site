// User model class for handling user data operations
import { User, UserProfile, FollowStats, NotificationPreferences } from '../types';

export class UserModel {
  static createDefaultProfile(userId: string, email: string): UserProfile {
    return {
      userId,
      displayName: email.split('@')[0],
      cosmicAvatar: '',
      spiritualBio: '',
      joinDate: new Date(),
      astrologicalSummary: {
        sunSign: '',
        moonSign: '',
        ascendant: ''
      },
      ayurvedicType: {
        primaryDosha: '',
        secondaryDosha: '',
        balance: [0, 0, 0]
      },
      badges: [],
      interests: []
    };
  }

  static createDefaultFollowStats(userId: string): FollowStats {
    return {
      userId,
      followerCount: 0,
      followingCount: 0
    };
  }

  static createDefaultNotificationPreferences(userId: string): NotificationPreferences {
    return {
      userId,
      followNotifications: true,
      messageNotifications: true,
      mentionNotifications: true,
      commentNotifications: true,
      reactionNotifications: true,
      emailNotifications: false,
      pushNotifications: true
    };
  }

  static createUser(id: string, email: string): User {
    return {
      id,
      email,
      profile: this.createDefaultProfile(id, email),
      followStats: this.createDefaultFollowStats(id),
      notificationPreferences: this.createDefaultNotificationPreferences(id),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}