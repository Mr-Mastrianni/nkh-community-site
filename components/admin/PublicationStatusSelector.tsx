'use client';

import React from 'react';
import { PostStatus } from '../../lib/types/blog';

interface PublicationStatusSelectorProps {
  status: PostStatus;
  onChange: (status: PostStatus) => void;
}

const PublicationStatusSelector: React.FC<PublicationStatusSelectorProps> = ({
  status,
  onChange
}) => {
  const statusOptions = [
    {
      value: PostStatus.DRAFT,
      label: 'Draft',
      description: 'Save as a draft, not visible to the public',
      icon: '📝',
      color: 'bg-gray-600'
    },
    {
      value: PostStatus.PUBLISHED,
      label: 'Published',
      description: 'Publish immediately, visible to the public',
      icon: '🌟',
      color: 'bg-green-600'
    },
    {
      value: PostStatus.SCHEDULED,
      label: 'Scheduled',
      description: 'Schedule for future publication',
      icon: '🕒',
      color: 'bg-blue-600'
    },
    {
      value: PostStatus.ARCHIVED,
      label: 'Archived',
      description: 'Archive and hide from the public',
      icon: '🗄️',
      color: 'bg-amber-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {statusOptions.map((option) => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex items-start p-3 rounded-md cursor-pointer transition-all ${
            status === option.value
              ? 'bg-purple-700 bg-opacity-70 border-2 border-purple-400'
              : 'bg-purple-900 bg-opacity-50 border border-purple-700 hover:bg-purple-800'
          }`}
        >
          <div className={`${option.color} p-2 rounded-full mr-3 flex-shrink-0`}>
            <span role="img" aria-label={option.label}>
              {option.icon}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-white">{option.label}</h3>
            <p className="text-sm text-purple-200">{option.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicationStatusSelector;