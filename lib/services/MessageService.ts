// Message service for API interactions
import axios from 'axios';
import { Message, MessageThread, Thread } from '../types';

export class MessageService {
  private static baseUrl = '/api/messages';

  static async getThreads(userId: string): Promise<MessageThread[]> {
    const response = await axios.get(`${this.baseUrl}/threads/${userId}`);
    return response.data;
  }

  static async getThread(threadId: string): Promise<Thread> {
    const response = await axios.get(`${this.baseUrl}/thread/${threadId}`);
    return response.data;
  }

  static async getMessages(threadId: string, page: number = 1, limit: number = 50): Promise<Message[]> {
    const response = await axios.get(`${this.baseUrl}/thread/${threadId}/messages`, {
      params: { page, limit }
    });
    return response.data;
  }

  static async sendMessage(
    threadId: string,
    senderId: string,
    content: string,
    contentType: 'text' | 'voice' | 'image' = 'text',
    mediaUrl?: string
  ): Promise<Message> {
    const response = await axios.post(`${this.baseUrl}/send`, {
      threadId,
      senderId,
      content,
      contentType,
      mediaUrl
    });
    return response.data;
  }

  static async createThread(participants: string[]): Promise<Thread> {
    const response = await axios.post(`${this.baseUrl}/thread`, { participants });
    return response.data;
  }

  static async markAsRead(messageId: string, userId: string): Promise<void> {
    await axios.put(`${this.baseUrl}/${messageId}/read`, { userId });
  }

  static async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    await axios.post(`${this.baseUrl}/${messageId}/reaction`, { userId, emoji });
  }

  static async removeReaction(messageId: string, userId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${messageId}/reaction/${userId}`);
  }

  static async uploadVoiceMessage(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await axios.post(`${this.baseUrl}/upload/voice`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.url;
  }
}