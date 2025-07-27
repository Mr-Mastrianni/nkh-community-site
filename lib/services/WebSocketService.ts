// WebSocket service for real-time communication
import { io, Socket } from 'socket.io-client';
import { Message, Notification } from '../types';

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private userId: string | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(userId: string, token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.userId = userId;
    this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001', {
      auth: {
        token,
        userId
      }
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  // Message events
  onNewMessage(callback: (message: Message) => void): void {
    this.socket?.on('new_message', callback);
  }

  onMessageRead(callback: (data: { messageId: string; userId: string }) => void): void {
    this.socket?.on('message_read', callback);
  }

  onMessageReaction(callback: (data: { messageId: string; userId: string; emoji: string }) => void): void {
    this.socket?.on('message_reaction', callback);
  }

  sendMessage(message: Omit<Message, 'id' | 'createdAt' | 'reactions' | 'readBy'>): void {
    this.socket?.emit('send_message', message);
  }

  joinMessageThread(threadId: string): void {
    this.socket?.emit('join_thread', threadId);
  }

  leaveMessageThread(threadId: string): void {
    this.socket?.emit('leave_thread', threadId);
  }

  // Notification events
  onNewNotification(callback: (notification: Notification) => void): void {
    this.socket?.on('new_notification', callback);
  }

  // Follow events
  onNewFollower(callback: (data: { followerId: string; followingId: string }) => void): void {
    this.socket?.on('new_follower', callback);
  }

  // Feed events
  onFeedUpdate(callback: (data: { type: 'new_post' | 'post_liked' | 'post_commented'; postId: string }) => void): void {
    this.socket?.on('feed_update', callback);
  }

  // Typing indicators
  onUserTyping(callback: (data: { threadId: string; userId: string; isTyping: boolean }) => void): void {
    this.socket?.on('user_typing', callback);
  }

  emitTyping(threadId: string, isTyping: boolean): void {
    this.socket?.emit('typing', { threadId, isTyping });
  }

  // Online status
  onUserOnline(callback: (data: { userId: string; isOnline: boolean }) => void): void {
    this.socket?.on('user_status', callback);
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getCurrentUserId(): string | null {
    return this.userId;
  }
}