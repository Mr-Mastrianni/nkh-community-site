// Profile page route
'use client';

import React from 'react';
import { ProfilePage } from '../../../components/social/profile';
import CosmicBackground from '../../../components/CosmicBackground';

interface ProfilePageRouteProps {
  params: {
    userId: string;
  };
}

const ProfilePageRoute: React.FC<ProfilePageRouteProps> = ({ params }) => {
  return (
    <>
      <CosmicBackground />
      <ProfilePage userId={params.userId} />
    </>
  );
};

export default ProfilePageRoute;