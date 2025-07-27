// Blog-related type definitions
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Rich HTML content
  excerpt: string;
  featuredImage?: MediaFile;
  tags: string[];
  status: PostStatus;
  publishedAt?: Date;
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  metadata: PostMetadata;
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived'
}

export interface PostMetadata {
  readingTime: number;
  wordCount: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  uploadedAt: Date;
  metadata: MediaMetadata;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number; // For videos
  format: string;
  optimized: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: Permission[];
  lastLoginAt: Date;
  createdAt: Date;
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  EDITOR = 'editor',
  AUTHOR = 'author'
}

export enum Permission {
  CREATE_POST = 'create_post',
  EDIT_POST = 'edit_post',
  DELETE_POST = 'delete_post',
  PUBLISH_POST = 'publish_post',
  MANAGE_MEDIA = 'manage_media'
}

// Blog search and filter types
export interface BlogSearchParams {
  query?: string;
  tags?: string[];
  status?: PostStatus;
  authorId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export interface BlogSearchResult {
  posts: BlogPost[];
  totalCount: number;
  hasMore: boolean;
}

// Blog creation and update types
export interface CreateBlogPostData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: PostStatus;
  featuredImage?: string; // Media file ID
  scheduledFor?: Date;
  metadata?: Partial<PostMetadata>;
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}