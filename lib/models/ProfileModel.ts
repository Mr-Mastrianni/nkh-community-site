// Profile model class for handling profile data operations
import { UserProfile, Badge, UserSuggestion } from '../types';

export class ProfileModel {
  static validateProfile(profile: Partial<UserProfile>): boolean {
    if (!profile.userId || !profile.displayName) {
      return false;
    }
    
    if (profile.displayName.length < 2 || profile.displayName.length > 50) {
      return false;
    }
    
    if (profile.spiritualBio && profile.spiritualBio.length > 500) {
      return false;
    }
    
    return true;
  }

  static updateProfile(currentProfile: UserProfile, updates: Partial<UserProfile>): UserProfile {
    return {
      ...currentProfile,
      ...updates,
      userId: currentProfile.userId, // Prevent userId from being changed
      joinDate: currentProfile.joinDate // Prevent joinDate from being changed
    };
  }

  static addBadge(profile: UserProfile, badge: Badge): UserProfile {
    const existingBadge = profile.badges.find(b => b.id === badge.id);
    if (existingBadge) {
      return profile;
    }
    
    return {
      ...profile,
      badges: [...profile.badges, badge]
    };
  }

  static addInterest(profile: UserProfile, interest: string): UserProfile {
    if (profile.interests.includes(interest)) {
      return profile;
    }
    
    return {
      ...profile,
      interests: [...profile.interests, interest]
    };
  }

  static removeInterest(profile: UserProfile, interest: string): UserProfile {
    return {
      ...profile,
      interests: profile.interests.filter(i => i !== interest)
    };
  }

  static calculateRelevanceScore(userProfile: UserProfile, targetProfile: UserProfile): number {
    let score = 0;
    
    // Shared interests
    const sharedInterests = userProfile.interests.filter(interest => 
      targetProfile.interests.includes(interest)
    );
    score += sharedInterests.length * 10;
    
    // Astrological compatibility (simplified)
    if (userProfile.astrologicalSummary.sunSign === targetProfile.astrologicalSummary.sunSign) {
      score += 5;
    }
    
    // Ayurvedic compatibility
    if (userProfile.ayurvedicType.primaryDosha === targetProfile.ayurvedicType.primaryDosha) {
      score += 3;
    }
    
    return score;
  }
}