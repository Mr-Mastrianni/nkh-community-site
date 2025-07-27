// Current user's profile page route
'use client';

import React from 'react';
import { ProfilePage } from '../../components/social/profile';
import CosmicBackground from '../../components/CosmicBackground';

const MyProfilePage: React.FC = () => {
  // In a real app, you would get the current user's ID from authentication context
  // For now, we'll use a placeholder ID
  const currentUserId = 'current-user-id';

  return (
    <>
      <CosmicBackground />
      <ProfilePage userId={currentUserId} isOwnProfile={true} />
    </>
  );
};

export default MyProfilePage;