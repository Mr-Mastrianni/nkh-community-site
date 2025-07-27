// User-related type definitions
import { UserProfile } from './profile';
import { FollowStats } from './follow';
import { NotificationPreferences } from './notification';

export interface User {
  id: string;
  email: string;
  profile: UserProfile;
  followStats: FollowStats;
  notificationPreferences: NotificationPreferences;
  createdAt: Date;
  updatedAt: Date;
}