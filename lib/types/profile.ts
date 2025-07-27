// Profile-related type definitions

export interface UserProfile {
  userId: string;
  displayName: string;
  cosmicAvatar: string;
  spiritualBio: string;
  joinDate: Date;
  astrologicalSummary: {
    sunSign: string;
    moonSign: string;
    ascendant: string;
  };
  ayurvedicType: {
    primaryDosha: string;
    secondaryDosha: string;
    balance: number[];
  };
  badges: Badge[];
  interests: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  dateEarned: Date;
}

export interface UserSuggestion {
  userId: string;
  displayName: string;
  cosmicAvatar: string;
  mutualConnections: number;
  sharedInterests: string[];
  relevanceScore: number;
}