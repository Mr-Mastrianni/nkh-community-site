// Feed-related type definitions

export interface FeedItem {
  id: string;
  authorId: string;
  contentType: 'text' | 'image' | 'video';
  content: string;
  mediaUrl?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: Date;
}

export interface FeedFilter {
  sortBy: 'recent' | 'popular' | 'relevant';
  contentTypes?: ('text' | 'image' | 'video')[];
  followingOnly: boolean;
  interestTags?: string[];
}

export interface Post {
  id: string;
  authorId: string;
  contentType: 'text' | 'image' | 'video';
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}