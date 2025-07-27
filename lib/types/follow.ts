// Follow-related type definitions

/**
 * Represents a follow relationship between two users
 * Implements requirements 2.1, 2.2, 2.5 from the requirements document
 */
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

/**
 * Alias for Follow to maintain backward compatibility
 * @deprecated Use Follow instead
 */
export interface FollowRelationship extends Follow {}

/**
 * Represents the follow statistics for a user
 * Implements requirements 2.3 from the requirements document
 */
export interface FollowStats {
  userId: string;
  followerCount: number;
  followingCount: number;
}

/**
 * Represents a mutual connection between users
 * Implements requirements 2.7 from the requirements document
 */
export interface MutualConnection {
  userId: string;
  displayName: string;
  cosmicAvatar: string;
}

/**
 * Represents a user suggestion for following
 * Implements requirements 2.6 from the requirements document
 */
export interface UserSuggestion {
  userId: string;
  displayName: string;
  cosmicAvatar: string;
  mutualConnections: number;
  sharedInterests: string[];
  relevanceScore: number;
}