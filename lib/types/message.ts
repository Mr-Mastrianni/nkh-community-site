// Message-related type definitions

export interface MessageThread {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  contentType: 'text' | 'voice' | 'image';
  mediaUrl?: string;
  reactions: MessageReaction[];
  readBy: string[];
  createdAt: Date;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface Thread {
  id: string;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
}