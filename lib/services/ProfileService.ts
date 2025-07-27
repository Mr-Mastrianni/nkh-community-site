// Profile service for API interactions
import axios from 'axios';
import { UserProfile, Badge, UserSuggestion } from '../types';

export class ProfileService {
  private static baseUrl = '/api/profile';

  static async getProfile(userId: string): Promise<UserProfile> {
    const response = await axios.get(`${this.baseUrl}/${userId}`);
    return response.data;
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await axios.put(`${this.baseUrl}/${userId}`, updates);
    return response.data;
  }

  static async generateCosmicAvatar(userId: string, birthChart: any): Promise<string> {
    const response = await axios.post(`${this.baseUrl}/${userId}/avatar`, { birthChart });
    return response.data.avatarUrl;
  }

  static async addBadge(userId: string, badgeId: string): Promise<Badge> {
    const response = await axios.post(`${this.baseUrl}/${userId}/badges`, { badgeId });
    return response.data;
  }

  static async getUserSuggestions(userId: string, limit: number = 10): Promise<UserSuggestion[]> {
    const response = await axios.get(`${this.baseUrl}/${userId}/suggestions?limit=${limit}`);
    return response.data;
  }

  static async searchProfiles(query: string, filters?: any): Promise<UserProfile[]> {
    const response = await axios.get(`${this.baseUrl}/search`, {
      params: { query, ...filters }
    });
    return response.data;
  }
}