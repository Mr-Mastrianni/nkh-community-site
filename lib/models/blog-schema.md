# Blog Database Schema

This document outlines the database schema for the blog system. The actual database implementation will depend on your chosen database solution (PostgreSQL, MongoDB, etc.).

## Tables/Collections

### blog_posts
```sql
CREATE TABLE blog_posts (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500) NOT NULL,
  featured_image_id VARCHAR(255),
  tags JSON, -- Array of strings
  status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  scheduled_for TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  author_id VARCHAR(255) NOT NULL,
  
  -- Metadata fields
  word_count INT DEFAULT 0,
  reading_time INT DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description VARCHAR(500),
  canonical_url VARCHAR(500),
  
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  INDEX idx_author_id (author_id),
  INDEX idx_slug (slug),
  INDEX idx_scheduled_for (scheduled_for),
  FOREIGN KEY (author_id) REFERENCES admin_users(id),
  FOREIGN KEY (featured_image_id) REFERENCES media_files(id)
);
```

### media_files
```sql
CREATE TABLE media_files (
  id VARCHAR(255) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  alt_text VARCHAR(255),
  caption TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Media metadata
  width INT,
  height INT,
  duration DECIMAL(10,2), -- For videos, in seconds
  format VARCHAR(50),
  optimized BOOLEAN DEFAULT FALSE,
  
  INDEX idx_mime_type (mime_type),
  INDEX idx_uploaded_at (uploaded_at)
);
```

### admin_users
```sql
CREATE TABLE admin_users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'editor', 'author') DEFAULT 'author',
  permissions JSON, -- Array of permission strings
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

### blog_tags (Optional - for tag management)
```sql
CREATE TABLE blog_tags (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_usage_count (usage_count)
);
```

### post_tags (Many-to-many relationship)
```sql
CREATE TABLE post_tags (
  post_id VARCHAR(255),
  tag_id VARCHAR(255),
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE
);
```

## Indexes for Performance

### Search Optimization
```sql
-- Full-text search index for blog posts
CREATE FULLTEXT INDEX idx_blog_search ON blog_posts(title, content, excerpt);

-- Composite indexes for common queries
CREATE INDEX idx_status_published_at ON blog_posts(status, published_at DESC);
CREATE INDEX idx_author_status ON blog_posts(author_id, status);
```

### Tag Search
```sql
-- For tag-based filtering (if using JSON column)
CREATE INDEX idx_tags ON blog_posts((CAST(tags AS CHAR(255) ARRAY)));
```

## Sample Queries

### Get Published Posts with Pagination
```sql
SELECT bp.*, mf.url as featured_image_url, au.name as author_name
FROM blog_posts bp
LEFT JOIN media_files mf ON bp.featured_image_id = mf.id
LEFT JOIN admin_users au ON bp.author_id = au.id
WHERE bp.status = 'published' 
  AND bp.published_at <= NOW()
ORDER BY bp.published_at DESC
LIMIT 10 OFFSET 0;
```

### Search Posts by Content
```sql
SELECT bp.*, MATCH(title, content, excerpt) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
FROM blog_posts bp
WHERE bp.status = 'published' 
  AND MATCH(title, content, excerpt) AGAINST(? IN NATURAL LANGUAGE MODE)
ORDER BY relevance DESC, bp.published_at DESC;
```

### Get Posts by Tag
```sql
SELECT bp.*
FROM blog_posts bp
WHERE bp.status = 'published'
  AND JSON_CONTAINS(bp.tags, JSON_QUOTE(?))
ORDER BY bp.published_at DESC;
```

### Get Scheduled Posts to Publish
```sql
SELECT * FROM blog_posts 
WHERE status = 'scheduled' 
  AND scheduled_for <= NOW();
```

## Data Relationships

- **blog_posts** → **admin_users** (author_id)
- **blog_posts** → **media_files** (featured_image_id)
- **blog_posts** ↔ **blog_tags** (many-to-many via post_tags)

## Notes

1. **UUIDs**: All ID fields use VARCHAR(255) to support UUIDs or other ID formats
2. **JSON Fields**: Tags are stored as JSON arrays for flexibility
3. **Timestamps**: All timestamps should be stored in UTC
4. **File Storage**: Media files should be stored externally (CDN/cloud storage) with URLs in the database
5. **Search**: Full-text search is implemented for content discovery
6. **Performance**: Indexes are optimized for common query patterns