// Follow model class for handling follow relationship operations
import { FollowRelationship, FollowStats } from '../types';

export class FollowModel {
  static createFollowRelationship(followerId: string, followingId: string): FollowRelationship {
    return {
      id: `${followerId}-${followingId}`,
      followerId,
      followingId,
      createdAt: new Date()
    };
  }

  static updateFollowStats(stats: FollowStats, action: 'follow' | 'unfollow', type: 'follower' | 'following'): FollowStats {
    const increment = action === 'follow' ? 1 : -1;
    
    if (type === 'follower') {
      return {
        ...stats,
        followerCount: Math.max(0, stats.followerCount + increment)
      };
    } else {
      return {
        ...stats,
        followingCount: Math.max(0, stats.followingCount + increment)
      };
    }
  }

  static validateFollowAction(followerId: string, followingId: string): boolean {
    // Cannot follow yourself
    if (followerId === followingId) {
      return false;
    }
    
    // Basic validation
    if (!followerId || !followingId) {
      return false;
    }
    
    return true;
  }
}