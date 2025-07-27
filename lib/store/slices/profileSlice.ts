// Profile Redux slice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, Badge, UserSuggestion } from '../../types';
import { ProfileService } from '../../services';

interface ProfileState {
  currentProfile: UserProfile | null;
  suggestions: UserSuggestion[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  currentProfile: null,
  suggestions: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string) => {
    const profile = await ProfileService.getProfile(userId);
    return profile;
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, updates }: { userId: string; updates: Partial<UserProfile> }) => {
    const profile = await ProfileService.updateProfile(userId, updates);
    return profile;
  }
);

export const fetchSuggestions = createAsyncThunk(
  'profile/fetchSuggestions',
  async (userId: string) => {
    const suggestions = await ProfileService.getUserSuggestions(userId);
    return suggestions;
  }
);

export const generateAvatar = createAsyncThunk(
  'profile/generateAvatar',
  async ({ userId, birthChart }: { userId: string; birthChart: any }) => {
    const avatarUrl = await ProfileService.generateCosmicAvatar(userId, birthChart);
    return avatarUrl;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.currentProfile = null;
      state.suggestions = [];
      state.error = null;
    },
    addBadge: (state, action: PayloadAction<Badge>) => {
      if (state.currentProfile) {
        const existingBadge = state.currentProfile.badges.find(b => b.id === action.payload.id);
        if (!existingBadge) {
          state.currentProfile.badges.push(action.payload);
        }
      }
    },
    addInterest: (state, action: PayloadAction<string>) => {
      if (state.currentProfile && !state.currentProfile.interests.includes(action.payload)) {
        state.currentProfile.interests.push(action.payload);
      }
    },
    removeInterest: (state, action: PayloadAction<string>) => {
      if (state.currentProfile) {
        state.currentProfile.interests = state.currentProfile.interests.filter(
          interest => interest !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      // Fetch suggestions
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      // Generate avatar
      .addCase(generateAvatar.fulfilled, (state, action) => {
        if (state.currentProfile) {
          state.currentProfile.cosmicAvatar = action.payload;
        }
      });
  },
});

export const { clearProfile, addBadge, addInterest, removeInterest } = profileSlice.actions;
export default profileSlice.reducer;