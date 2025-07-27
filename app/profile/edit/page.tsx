// Profile editor page route
'use client';

import React from 'react';
import { ProfileEditor } from '../../../components/social/profile';
import CosmicBackground from '../../../components/CosmicBackground';
import { useRouter } from 'next/navigation';

const ProfileEditPage: React.FC = () => {
  const router = useRouter();
  
  // In a real app, you would get the current user's ID from authentication context
  const currentUserId = 'current-user-id';

  const handleSave = () => {
    // Navigate back to profile page after successful save
    router.push('/profile');
  };

  const handleCancel = () => {
    // Navigate back to profile page on cancel
    router.push('/profile');
  };

  return (
    <>
      <CosmicBackground />
      <ProfileEditor 
        userId={currentUserId} 
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </>
  );
};

export default ProfileEditPage;