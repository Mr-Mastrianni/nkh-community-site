// Message model class for handling message operations
import { Message, MessageThread, MessageReaction, Thread } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class MessageModel {
  static createThread(participants: string[]): Thread {
    return {
      id: uuidv4(),
      participants: [...new Set(participants)], // Remove duplicates
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static createMessage(
    threadId: string,
    senderId: string,
    content: string,
    contentType: 'text' | 'voice' | 'image' = 'text',
    mediaUrl?: string
  ): Message {
    return {
      id: uuidv4(),
      threadId,
      senderId,
      content,
      contentType,
      mediaUrl,
      reactions: [],
      readBy: [senderId], // Sender has read their own message
      createdAt: new Date()
    };
  }

  static addReaction(message: Message, userId: string, emoji: string): Message {
    // Remove existing reaction from this user
    const filteredReactions = message.reactions.filter(r => r.userId !== userId);
    
    const newReaction: MessageReaction = {
      id: uuidv4(),
      messageId: message.id,
      userId,
      emoji,
      createdAt: new Date()
    };

    return {
      ...message,
      reactions: [...filteredReactions, newReaction]
    };
  }

  static markAsRead(message: Message, userId: string): Message {
    if (message.readBy.includes(userId)) {
      return message;
    }

    return {
      ...message,
      readBy: [...message.readBy, userId]
    };
  }

  static createMessageThread(thread: Thread, lastMessage: Message, unreadCount: number = 0): MessageThread {
    return {
      id: thread.id,
      participants: thread.participants,
      lastMessage,
      unreadCount,
      updatedAt: thread.updatedAt
    };
  }

  static validateMessage(content: string, contentType: 'text' | 'voice' | 'image'): boolean {
    if (contentType === 'text') {
      return content.trim().length > 0 && content.length <= 1000;
    }
    
    if (contentType === 'voice' || contentType === 'image') {
      return content.length > 0; // Should be a URL or base64 string
    }
    
    return false;
  }
}