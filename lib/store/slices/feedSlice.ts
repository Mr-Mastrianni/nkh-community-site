// Feed Redux slice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FeedItem, FeedFilter, Post, Like, Comment } from '../../types';
import { FeedService } from '../../services';

interface FeedState {
  feedItems: FeedItem[];
  discoverItems: FeedItem[];
  currentFilter: FeedFilter;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: FeedState = {
  feedItems: [],
  discoverItems: [],
  currentFilter: {
    sortBy: 'recent',
    followingOnly: true,
  },
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
};

// Async thunks
export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async ({ userId, filter, page = 1 }: { userId: string; filter: FeedFilter; page?: number }) => {
    const feedItems = await FeedService.getFeed(userId, filter, page);
    return { feedItems, page, filter };
  }
);

export const fetchDiscoverFeed = createAsyncThunk(
  'feed/fetchDiscoverFeed',
  async ({ userId, page = 1 }: { userId: string; page?: number }) => {
    const feedItems = await FeedService.getDiscoverFeed(userId, page);
    return { feedItems, page };
  }
);

export const createPost = createAsyncThunk(
  'feed/createPost',
  async ({
    authorId,
    content,
    contentType = 'text',
    mediaUrl
  }: {
    authorId: string;
    content: string;
    contentType?: 'text' | 'image' | 'video';
    mediaUrl?: string;
  }) => {
    const post = await FeedService.createPost(authorId, content, contentType, mediaUrl);
    return post;
  }
);

export const likePost = createAsyncThunk(
  'feed/likePost',
  async ({ postId, userId }: { postId: string; userId: string }) => {
    const like = await FeedService.likePost(postId, userId);
    return { postId, like };
  }
);

export const unlikePost = createAsyncThunk(
  'feed/unlikePost',
  async ({ postId, userId }: { postId: string; userId: string }) => {
    await FeedService.unlikePost(postId, userId);
    return { postId, userId };
  }
);

export const commentOnPost = createAsyncThunk(
  'feed/commentOnPost',
  async ({ postId, authorId, content }: { postId: string; authorId: string; content: string }) => {
    const comment = await FeedService.commentOnPost(postId, authorId, content);
    return { postId, comment };
  }
);

export const sharePost = createAsyncThunk(
  'feed/sharePost',
  async ({ postId, userId }: { postId: string; userId: string }) => {
    await FeedService.sharePost(postId, userId);
    return { postId };
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.feedItems = [];
      state.discoverItems = [];
      state.error = null;
      state.hasMore = true;
      state.page = 1;
    },
    setFilter: (state, action: PayloadAction<FeedFilter>) => {
      state.currentFilter = action.payload;
      state.feedItems = [];
      state.page = 1;
      state.hasMore = true;
    },
    addFeedItem: (state, action: PayloadAction<FeedItem>) => {
      state.feedItems.unshift(action.payload);
    },
    updateFeedItem: (state, action: PayloadAction<Partial<FeedItem> & { id: string }>) => {
      const index = state.feedItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.feedItems[index] = { ...state.feedItems[index], ...action.payload };
      }
      
      const discoverIndex = state.discoverItems.findIndex(item => item.id === action.payload.id);
      if (discoverIndex !== -1) {
        state.discoverItems[discoverIndex] = { ...state.discoverItems[discoverIndex], ...action.payload };
      }
    },
    removeFeedItem: (state, action: PayloadAction<string>) => {
      state.feedItems = state.feedItems.filter(item => item.id !== action.payload);
      state.discoverItems = state.discoverItems.filter(item => item.id !== action.payload);
    },
    incrementLikeCount: (state, action: PayloadAction<string>) => {
      const feedItem = state.feedItems.find(item => item.id === action.payload);
      if (feedItem) {
        feedItem.likeCount += 1;
      }
      
      const discoverItem = state.discoverItems.find(item => item.id === action.payload);
      if (discoverItem) {
        discoverItem.likeCount += 1;
      }
    },
    decrementLikeCount: (state, action: PayloadAction<string>) => {
      const feedItem = state.feedItems.find(item => item.id === action.payload);
      if (feedItem) {
        feedItem.likeCount = Math.max(0, feedItem.likeCount - 1);
      }
      
      const discoverItem = state.discoverItems.find(item => item.id === action.payload);
      if (discoverItem) {
        discoverItem.likeCount = Math.max(0, discoverItem.likeCount - 1);
      }
    },
    incrementCommentCount: (state, action: PayloadAction<string>) => {
      const feedItem = state.feedItems.find(item => item.id === action.payload);
      if (feedItem) {
        feedItem.commentCount += 1;
      }
      
      const discoverItem = state.discoverItems.find(item => item.id === action.payload);
      if (discoverItem) {
        discoverItem.commentCount += 1;
      }
    },
    incrementShareCount: (state, action: PayloadAction<string>) => {
      const feedItem = state.feedItems.find(item => item.id === action.payload);
      if (feedItem) {
        feedItem.shareCount += 1;
      }
      
      const discoverItem = state.discoverItems.find(item => item.id === action.payload);
      if (discoverItem) {
        discoverItem.shareCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feed
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        const { feedItems, page, filter } = action.payload;
        
        if (page === 1) {
          state.feedItems = feedItems;
        } else {
          state.feedItems.push(...feedItems);
        }
        
        state.currentFilter = filter;
        state.page = page;
        state.hasMore = feedItems.length === 20; // Assuming 20 items per page
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feed';
      })
      // Fetch discover feed
      .addCase(fetchDiscoverFeed.fulfilled, (state, action) => {
        const { feedItems, page } = action.payload;
        
        if (page === 1) {
          state.discoverItems = feedItems;
        } else {
          state.discoverItems.push(...feedItems);
        }
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        const newFeedItem: FeedItem = {
          id: action.payload.id,
          authorId: action.payload.authorId,
          contentType: action.payload.contentType,
          content: action.payload.content,
          mediaUrl: action.payload.mediaUrl,
          likeCount: 0,
          commentCount: 0,
          shareCount: 0,
          createdAt: action.payload.createdAt,
        };
        state.feedItems.unshift(newFeedItem);
      })
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const feedItem = state.feedItems.find(item => item.id === postId);
        if (feedItem) {
          feedItem.likeCount += 1;
        }
        
        const discoverItem = state.discoverItems.find(item => item.id === postId);
        if (discoverItem) {
          discoverItem.likeCount += 1;
        }
      })
      // Unlike post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const feedItem = state.feedItems.find(item => item.id === postId);
        if (feedItem) {
          feedItem.likeCount = Math.max(0, feedItem.likeCount - 1);
        }
        
        const discoverItem = state.discoverItems.find(item => item.id === postId);
        if (discoverItem) {
          discoverItem.likeCount = Math.max(0, discoverItem.likeCount - 1);
        }
      })
      // Comment on post
      .addCase(commentOnPost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const feedItem = state.feedItems.find(item => item.id === postId);
        if (feedItem) {
          feedItem.commentCount += 1;
        }
        
        const discoverItem = state.discoverItems.find(item => item.id === postId);
        if (discoverItem) {
          discoverItem.commentCount += 1;
        }
      })
      // Share post
      .addCase(sharePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const feedItem = state.feedItems.find(item => item.id === postId);
        if (feedItem) {
          feedItem.shareCount += 1;
        }
        
        const discoverItem = state.discoverItems.find(item => item.id === postId);
        if (discoverItem) {
          discoverItem.shareCount += 1;
        }
      });
  },
});

export const {
  clearFeed,
  setFilter,
  addFeedItem,
  updateFeedItem,
  removeFeedItem,
  incrementLikeCount,
  decrementLikeCount,
  incrementCommentCount,
  incrementShareCount,
} = feedSlice.actions;

export default feedSlice.reducer;