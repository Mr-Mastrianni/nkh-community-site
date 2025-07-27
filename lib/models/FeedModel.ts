// Feed model class for handling feed operations
import { FeedItem, FeedFilter, Post, Like, Comment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class FeedModel {
  static createPost(
    authorId: string,
    content: string,
    contentType: 'text' | 'image' | 'video' = 'text',
    mediaUrl?: string
  ): Post {
    return {
      id: uuidv4(),
      authorId,
      contentType,
      content,
      mediaUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static createFeedItem(
    post: Post,
    likeCount: number = 0,
    commentCount: number = 0,
    shareCount: number = 0
  ): FeedItem {
    return {
      id: post.id,
      authorId: post.authorId,
      contentType: post.contentType,
      content: post.content,
      mediaUrl: post.mediaUrl,
      likeCount,
      commentCount,
      shareCount,
      createdAt: post.createdAt
    };
  }

  static createLike(postId: string, userId: string): Like {
    return {
      id: uuidv4(),
      postId,
      userId,
      createdAt: new Date()
    };
  }

  static createComment(postId: string, authorId: string, content: string): Comment {
    return {
      id: uuidv4(),
      postId,
      authorId,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static applyFilter(feedItems: FeedItem[], filter: FeedFilter): FeedItem[] {
    let filtered = [...feedItems];

    // Filter by content types
    if (filter.contentTypes && filter.contentTypes.length > 0) {
      filtered = filtered.filter(item => filter.contentTypes!.includes(item.contentType));
    }

    // Sort by criteria
    switch (filter.sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount));
        break;
      case 'relevant':
        // For now, use a combination of recency and popularity
        filtered.sort((a, b) => {
          const scoreA = (a.likeCount + a.commentCount) * 0.7 + (Date.now() - new Date(a.createdAt).getTime()) * 0.3;
          const scoreB = (b.likeCount + b.commentCount) * 0.7 + (Date.now() - new Date(b.createdAt).getTime()) * 0.3;
          return scoreB - scoreA;
        });
        break;
    }

    return filtered;
  }

  static validatePost(content: string, contentType: 'text' | 'image' | 'video'): boolean {
    if (contentType === 'text') {
      return content.trim().length > 0 && content.length <= 2000;
    }
    
    if (contentType === 'image' || contentType === 'video') {
      return content.length > 0; // Should be a URL or identifier
    }
    
    return false;
  }

  static updateFeedItemCounts(
    feedItem: FeedItem,
    likes: Like[],
    comments: Comment[]
  ): FeedItem {
    const likeCount = likes.filter(like => like.postId === feedItem.id).length;
    const commentCount = comments.filter(comment => comment.postId === feedItem.id).length;

    return {
      ...feedItem,
      likeCount,
      commentCount
    };
  }
}