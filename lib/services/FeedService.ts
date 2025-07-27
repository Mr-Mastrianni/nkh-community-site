// Feed service for API interactions
import axios from 'axios';
import { FeedItem, FeedFilter, Post, Like, Comment } from '../types';

export class FeedService {
  private static baseUrl = '/api/feed';

  static async getFeed(userId: string, filter: FeedFilter, page: number = 1, limit: number = 20): Promise<FeedItem[]> {
    const response = await axios.get(`${this.baseUrl}/${userId}`, {
      params: { ...filter, page, limit }
    });
    return response.data;
  }

  static async getDiscoverFeed(userId: string, page: number = 1, limit: number = 20): Promise<FeedItem[]> {
    const response = await axios.get(`${this.baseUrl}/${userId}/discover`, {
      params: { page, limit }
    });
    return response.data;
  }

  static async createPost(
    authorId: string,
    content: string,
    contentType: 'text' | 'image' | 'video' = 'text',
    mediaUrl?: string
  ): Promise<Post> {
    const response = await axios.post(`${this.baseUrl}/post`, {
      authorId,
      content,
      contentType,
      mediaUrl
    });
    return response.data;
  }

  static async likePost(postId: string, userId: string): Promise<Like> {
    const response = await axios.post(`${this.baseUrl}/post/${postId}/like`, { userId });
    return response.data;
  }

  static async unlikePost(postId: string, userId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/post/${postId}/like/${userId}`);
  }

  static async commentOnPost(postId: string, authorId: string, content: string): Promise<Comment> {
    const response = await axios.post(`${this.baseUrl}/post/${postId}/comment`, {
      authorId,
      content
    });
    return response.data;
  }

  static async getComments(postId: string, page: number = 1, limit: number = 10): Promise<Comment[]> {
    const response = await axios.get(`${this.baseUrl}/post/${postId}/comments`, {
      params: { page, limit }
    });
    return response.data;
  }

  static async sharePost(postId: string, userId: string): Promise<void> {
    await axios.post(`${this.baseUrl}/post/${postId}/share`, { userId });
  }

  static async deletePost(postId: string, authorId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/post/${postId}`, {
      data: { authorId }
    });
  }

  static async reportPost(postId: string, reporterId: string, reason: string): Promise<void> {
    await axios.post(`${this.baseUrl}/post/${postId}/report`, {
      reporterId,
      reason
    });
  }
}