// Message Redux slice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Message, MessageThread, Thread } from '../../types';
import { MessageService } from '../../services';

interface MessageState {
  threads: MessageThread[];
  currentThread: Thread | null;
  messages: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
  typingUsers: Record<string, string[]>; // threadId -> userIds
}

const initialState: MessageState = {
  threads: [],
  currentThread: null,
  messages: {},
  loading: false,
  error: null,
  typingUsers: {},
};

// Async thunks
export const fetchThreads = createAsyncThunk(
  'message/fetchThreads',
  async (userId: string) => {
    const threads = await MessageService.getThreads(userId);
    return threads;
  }
);

export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async ({ threadId, page = 1 }: { threadId: string; page?: number }) => {
    const messages = await MessageService.getMessages(threadId, page);
    return { threadId, messages, page };
  }
);

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async ({
    threadId,
    senderId,
    content,
    contentType = 'text',
    mediaUrl
  }: {
    threadId: string;
    senderId: string;
    content: string;
    contentType?: 'text' | 'voice' | 'image';
    mediaUrl?: string;
  }) => {
    const message = await MessageService.sendMessage(threadId, senderId, content, contentType, mediaUrl);
    return message;
  }
);

export const createThread = createAsyncThunk(
  'message/createThread',
  async (participants: string[]) => {
    const thread = await MessageService.createThread(participants);
    return thread;
  }
);

export const markMessageAsRead = createAsyncThunk(
  'message/markAsRead',
  async ({ messageId, userId }: { messageId: string; userId: string }) => {
    await MessageService.markAsRead(messageId, userId);
    return { messageId, userId };
  }
);

export const addReaction = createAsyncThunk(
  'message/addReaction',
  async ({ messageId, userId, emoji }: { messageId: string; userId: string; emoji: string }) => {
    await MessageService.addReaction(messageId, userId, emoji);
    return { messageId, userId, emoji };
  }
);

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.threads = [];
      state.currentThread = null;
      state.messages = {};
      state.error = null;
    },
    setCurrentThread: (state, action: PayloadAction<Thread>) => {
      state.currentThread = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      if (!state.messages[message.threadId]) {
        state.messages[message.threadId] = [];
      }
      state.messages[message.threadId].push(message);
      
      // Update thread's last message
      const threadIndex = state.threads.findIndex(t => t.id === message.threadId);
      if (threadIndex !== -1) {
        state.threads[threadIndex].lastMessage = message;
        state.threads[threadIndex].updatedAt = message.createdAt;
      }
    },
    updateMessageReadStatus: (state, action: PayloadAction<{ messageId: string; userId: string }>) => {
      const { messageId, userId } = action.payload;
      
      // Find and update the message
      Object.values(state.messages).forEach(threadMessages => {
        const message = threadMessages.find(m => m.id === messageId);
        if (message && !message.readBy.includes(userId)) {
          message.readBy.push(userId);
        }
      });
    },
    setTypingUsers: (state, action: PayloadAction<{ threadId: string; userIds: string[] }>) => {
      state.typingUsers[action.payload.threadId] = action.payload.userIds;
    },
    addTypingUser: (state, action: PayloadAction<{ threadId: string; userId: string }>) => {
      const { threadId, userId } = action.payload;
      if (!state.typingUsers[threadId]) {
        state.typingUsers[threadId] = [];
      }
      if (!state.typingUsers[threadId].includes(userId)) {
        state.typingUsers[threadId].push(userId);
      }
    },
    removeTypingUser: (state, action: PayloadAction<{ threadId: string; userId: string }>) => {
      const { threadId, userId } = action.payload;
      if (state.typingUsers[threadId]) {
        state.typingUsers[threadId] = state.typingUsers[threadId].filter(id => id !== userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch threads
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch threads';
      })
      // Fetch messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { threadId, messages, page } = action.payload;
        if (page === 1) {
          state.messages[threadId] = messages;
        } else {
          state.messages[threadId] = [...messages, ...(state.messages[threadId] || [])];
        }
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        if (!state.messages[message.threadId]) {
          state.messages[message.threadId] = [];
        }
        state.messages[message.threadId].push(message);
        
        // Update thread's last message
        const threadIndex = state.threads.findIndex(t => t.id === message.threadId);
        if (threadIndex !== -1) {
          state.threads[threadIndex].lastMessage = message;
          state.threads[threadIndex].updatedAt = message.createdAt;
        }
      })
      // Create thread
      .addCase(createThread.fulfilled, (state, action) => {
        state.currentThread = action.payload;
      });
  },
});

export const {
  clearMessages,
  setCurrentThread,
  addMessage,
  updateMessageReadStatus,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
} = messageSlice.actions;

export default messageSlice.reducer;