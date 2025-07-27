// Message inbox component placeholder
'use client';

import React from 'react';
import { MessageThread } from '../../../lib/types';

interface MessageInboxProps {
  userId: string;
  threads: MessageThread[];
  onThreadSelect?: (threadId: string) => void;
}

const MessageInbox: React.FC<MessageInboxProps> = ({ 
  userId, 
  threads, 
  onThreadSelect 
}) => {
  return (
    <div className="message-inbox">
      <h2>Messages</h2>
      <p>Threads count: {threads.length}</p>
      {/* Component implementation will be added in subsequent tasks */}
    </div>
  );
};

export default MessageInbox;