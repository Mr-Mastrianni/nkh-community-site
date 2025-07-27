// Follow Redux slice
// Implements requirements 2.1, 2.2, 2.5 from the requirements document
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Follow, FollowStats, UserProfile, UserSuggestion } from '../../types';
import { FollowService } from '../../services';

/**
 * State interface for the follow slice
 */
interface FollowState {
  followStats: FollowStats | null;
  followers: UserProfile[];
  following: UserProfile[];
  suggestions: UserSuggestion[];
  isFollowingMap: Record<string, boolean>;
  loading: boolean;
  error: string | null;
  recentFollows: Follow[]; // Track recent follow relationships
}

const initialState: FollowState = {
  followStats: null,
  followers: [],
  following: [],
  suggestions: [],
  isFollowingMap: {},
  loading: false,
  error: null,
  recentFollows: [],
};

// Async thunks
export const followUser = createAsyncThunk(
  'follow/followUser',
  async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
    const relationship = await FollowService.followUser(followerId, followingId);
    return { relationship, followingId };
  }
);

export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
    await FollowService.unfollowUser(followerId, followingId);
    return { followingId };
  }
);

export const fetchFollowStats = createAsyncThunk(
  'follow/fetchFollowStats',
  async (userId: string) => {
    const stats = await FollowService.getFollowStats(userId);
    return stats;
  }
);

export const fetchFollowers = createAsyncThunk(
  'follow/fetchFollowers',
  async ({ userId, page = 1 }: { userId: string; page?: number }) => {
    const followers = await FollowService.getFollowers(userId, page);
    return { followers, page };
  }
);

export const fetchFollowing = createAsyncThunk(
  'follow/fetchFollowing',
  async ({ userId, page = 1 }: { userId: string; page?: number }) => {
    const following = await FollowService.getFollowing(userId, page);
    return { following, page };
  }
);

export const checkIsFollowing = createAsyncThunk(
  'follow/checkIsFollowing',
  async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
    const isFollowing = await FollowService.isFollowing(followerId, followingId);
    return { followingId, isFollowing };
  }
);

export const fetchUserSuggestions = createAsyncThunk(
  'follow/fetchUserSuggestions',
  async ({ userId, limit = 10 }: { userId: string; limit?: number }) => {
    const suggestions = await FollowService.getUserSuggestions(userId, limit);
    return suggestions;
  }
);

export const fetchSuggestionsBasedOnInterests = createAsyncThunk(
  'follow/fetchSuggestionsBasedOnInterests',
  async ({ userId, interests, limit = 10 }: { userId: string; interests: string[]; limit?: number }) => {
    const suggestions = await FollowService.getSuggestionsBasedOnInterests(userId, interests, limit);
    return suggestions;
  }
);

export const fetchSuggestionsBasedOnMutualConnections = createAsyncThunk(
  'follow/fetchSuggestionsBasedOnMutualConnections',
  async ({ userId, limit = 10 }: { userId: string; limit?: number }) => {
    const suggestions = await FollowService.getSuggestionsBasedOnMutualConnections(userId, limit);
    return suggestions;
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    clearFollowData: (state) => {
      state.followStats = null;
      state.followers = [];
      state.following = [];
      state.suggestions = [];
      state.isFollowingMap = {};
      state.error = null;
    },
    setIsFollowing: (state, action: PayloadAction<{ userId: string; isFollowing: boolean }>) => {
      state.isFollowingMap[action.payload.userId] = action.payload.isFollowing;
    },
  },
  extraReducers: (builder) => {
    builder
      // Follow user
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isFollowingMap[action.payload.followingId] = true;
        // Add to recent follows
        state.recentFollows.unshift(action.payload.relationship);
        // Keep only the 10 most recent follows
        if (state.recentFollows.length > 10) {
          state.recentFollows = state.recentFollows.slice(0, 10);
        }
        if (state.followStats) {
          state.followStats.followingCount += 1;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to follow user';
      })
      // Unfollow user
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isFollowingMap[action.payload.followingId] = false;
        if (state.followStats) {
          state.followStats.followingCount = Math.max(0, state.followStats.followingCount - 1);
        }
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to unfollow user';
      })
      // Fetch follow stats
      .addCase(fetchFollowStats.fulfilled, (state, action) => {
        state.followStats = action.payload;
      })
      // Fetch followers
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.followers = action.payload.followers;
        } else {
          state.followers.push(...action.payload.followers);
        }
      })
      // Fetch following
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.following = action.payload.following;
        } else {
          state.following.push(...action.payload.following);
        }
      })
      // Check is following
      .addCase(checkIsFollowing.fulfilled, (state, action) => {
        state.isFollowingMap[action.payload.followingId] = action.payload.isFollowing;
      })
      // Fetch user suggestions
      .addCase(fetchUserSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      // Fetch suggestions based on interests
      .addCase(fetchSuggestionsBasedOnInterests.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      // Fetch suggestions based on mutual connections
      .addCase(fetchSuggestionsBasedOnMutualConnections.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const { clearFollowData, setIsFollowing } = followSlice.actions;
export default followSlice.reducer;