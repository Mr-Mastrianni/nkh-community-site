// Notification center component placeholder
'use client';

import React from 'react';
import { Notification } from '../../../lib/types';

interface NotificationCenterProps {
  userId: string;
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  userId, 
  notifications, 
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  return (
    <div className="notification-center">
      <h2>Notifications</h2>
      <p>Notifications count: {notifications.length}</p>
      {/* Component implementation will be added in subsequent tasks */}
    </div>
  );
};

export default NotificationCenter;