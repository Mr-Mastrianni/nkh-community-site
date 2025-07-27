// Follow service for API interactions
import axios from 'axios';
import { Follow, FollowStats, UserProfile, UserSuggestion } from '../types';

/**
 * Service for handling follow-related API interactions
 * Implements requirements 2.1, 2.2, 2.5 from the requirements document
 */
export class FollowService {
  private static baseUrl = '/api/follow';

  /**
   * Creates a follow relationship between two users
   * @param followerId The ID of the user who is following
   * @param followingId The ID of the user being followed
   * @returns The created follow relationship
   */
  static async followUser(followerId: string, followingId: string): Promise<Follow> {
    const response = await axios.post(`${this.baseUrl}`, {
      followerId,
      followingId
    });
    return response.data;
  }

  /**
   * Removes a follow relationship between two users
   * @param followerId The ID of the user who is following
   * @param followingId The ID of the user being followed
   */
  static async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${followerId}/${followingId}`);
  }

  /**
   * Gets the follow statistics for a user
   * @param userId The ID of the user
   * @returns The follow statistics
   */
  static async getFollowStats(userId: string): Promise<FollowStats> {
    const response = await axios.get(`${this.baseUrl}/${userId}/stats`);
    return response.data;
  }

  /**
   * Gets the followers of a user with pagination
   * @param userId The ID of the user
   * @param page The page number for pagination
   * @param limit The number of items per page
   * @returns Array of user profiles who follow the specified user
   */
  static async getFollowers(userId: string, page: number = 1, limit: number = 20): Promise<UserProfile[]> {
    const response = await axios.get(`${this.baseUrl}/${userId}/followers`, {
      params: { page, limit }
    });
    return response.data;
  }

  /**
   * Gets the users that a user is following with pagination
   * @param userId The ID of the user
   * @param page The page number for pagination
   * @param limit The number of items per page
   * @returns Array of user profiles that the specified user follows
   */
  static async getFollowing(userId: string, page: number = 1, limit: number = 20): Promise<UserProfile[]> {
    const response = await axios.get(`${this.baseUrl}/${userId}/following`, {
      params: { page, limit }
    });
    return response.data;
  }

  /**
   * Checks if a user is following another user
   * @param followerId The ID of the potential follower
   * @param followingId The ID of the potential followed user
   * @returns Boolean indicating if the follow relationship exists
   */
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const response = await axios.get(`${this.baseUrl}/${followerId}/is-following/${followingId}`);
    return response.data.isFollowing;
  }

  /**
   * Gets mutual connections between two users
   * @param userId1 The ID of the first user
   * @param userId2 The ID of the second user
   * @returns Array of user profiles that both users follow
   */
  static async getMutualConnections(userId1: string, userId2: string): Promise<UserProfile[]> {
    const response = await axios.get(`${this.baseUrl}/${userId1}/mutual/${userId2}`);
    return response.data;
  }

  /**
   * Gets user suggestions for a user to follow
   * @param userId The ID of the user
   * @param limit The maximum number of suggestions to return
   * @returns Array of user suggestions
   */
  static async getUserSuggestions(userId: string, limit: number = 10): Promise<UserSuggestion[]> {
    const response = await axios.get(`${this.baseUrl}/${userId}/suggestions`, {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Gets user suggestions based on shared interests
   * @param userId The ID of the user
   * @param interests Array of interest tags
   * @param limit The maximum number of suggestions to return
   * @returns Array of user suggestions with shared interests
   */
  static async getSuggestionsBasedOnInterests(userId: string, interests: string[], limit: number = 10): Promise<UserSuggestion[]> {
    const response = await axios.get(`${this.baseUrl}/${userId}/suggestions/interests`, {
      params: { interests: interests.join(','), limit }
    });
    return response.data;
  }

  /**
   * Gets user suggestions based on mutual connections
   * @param userId The ID of the user
   * @param limit The maximum number of suggestions to return
   * @returns Array of user suggestions with mutual connections
   */
  static async getSuggestionsBasedOnMutualConnections(userId: string, limit: number = 10): Promise<UserSuggestion[]> {
    const response = await axios.get(`${this.baseUrl}/${userId}/suggestions/mutual`, {
      params: { limit }
    });
    return response.data;
  }
}