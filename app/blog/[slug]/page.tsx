import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Calendar, Clock, Tag, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { BlogService } from '@/lib/services/blogService';
import { PostStatus } from '@/lib/types/blog';
import { formatDate } from '@/lib/utils/date';
import { calculateReadingTime } from '@/lib/utils/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

// Revalidate every hour
export const revalidate = 3600;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await BlogService.getPostBySlug(params.slug);
  
  if (!post || post.status !== PostStatus.PUBLISHED) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nkhcommunity.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: 'NKH Community' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      url: postUrl,
      images: post.featuredImage ? [{
        url: post.featuredImage.url,
        width: 1200,
        height: 630,
        alt: post.featuredImage.altText || post.title,
      }] : [{
        url: `${siteUrl}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'NKH Community Blog',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage.url] : [`${siteUrl}/images/og-default.jpg`],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

// Helper function to get related posts
async function getRelatedPosts(currentPost: any, limit: number = 3) {
  const allPosts = await BlogService.getAllPosts();
  const publishedPosts = allPosts.filter(
    post => post.status === PostStatus.PUBLISHED && post.id !== currentPost.id
  );
  
  // Find posts with similar tags
  const relatedPosts = publishedPosts.filter(post => 
    post.tags.some(tag => currentPost.tags.includes(tag))
  );
  
  // If not enough related posts, fill with recent posts
  if (relatedPosts.length < limit) {
    const recentPosts = publishedPosts
      .filter(post => !relatedPosts.includes(post))
      .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
      .slice(0, limit - relatedPosts.length);
    
    return [...relatedPosts, ...recentPosts].slice(0, limit);
  }
  
  return relatedPosts.slice(0, limit);
}

// Helper function to get post navigation
async function getPostNavigation(currentPost: any) {
  const allPosts = await BlogService.getAllPosts();
  const publishedPosts = allPosts
    .filter(post => post.status === PostStatus.PUBLISHED)
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
  
  const currentIndex = publishedPosts.findIndex(post => post.id === currentPost.id);
  
  return {
    previous: currentIndex > 0 ? publishedPosts[currentIndex - 1] : null,
    next: currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null,
  };
}

// Social sharing URLs
function getShareUrls(post: any, siteUrl: string) {
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(post.title);
  
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await BlogService.getPostBySlug(params.slug);
  
  if (!post || post.status !== PostStatus.PUBLISHED) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nkhcommunity.com';
  const shareUrls = getShareUrls(post, siteUrl);
  const relatedPosts = await getRelatedPosts(post);
  const postNavigation = await getPostNavigation(post);

  // Custom components for MDX
  const components = {
    h1: (props: any) => <h1 className="text-3xl font-bold text-gray-900 mb-6" {...props} />,
    h2: (props: any) => <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8" {...props} />,
    h3: (props: any) => <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6" {...props} />,
    p: (props: any) => <p className="text-gray-700 mb-4 leading-relaxed" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-6 text-gray-600" {...props} />
    ),
    code: (props: any) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
    ),
    pre: (props: any) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4" {...props} />
    ),
    img: (props: any) => (
      <img className="rounded-lg my-6" alt={props.alt || ''} {...props} />
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/blog" className="text-gray-500 hover:text-gray-700">
                Blog
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{post.title}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Blog Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.altText || post.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
              priority
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <time dateTime={post.publishedAt?.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{post.metadata.readingTime} min read</span>
            </div>
            
            <div className="flex items-center">
              <span>{post.metadata.wordCount} words</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Link>
            ))}
          </div>
        </header>

        {/* Social Share Buttons */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b">
          <span className="text-sm font-medium text-gray-700">Share this post:</span>
          <div className="flex gap-2">
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 rounded-md bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Tweet
            </a>
            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 rounded-md bg-[#1877F2] text-white hover:bg-[#166fe5] transition-colors"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Share
            </a>
            <a
              href={shareUrls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 rounded-md bg-[#0A66C2] text-white hover:bg-[#0855b3] transition-colors"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </a>
          </div>
        </div>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={post.content} components={components} />
        </div>

        {/* Post Navigation */}
        {(postNavigation.previous || postNavigation.next) && (
          <nav className="mt-12 pt-8 border-t">
            <div className="flex justify-between items-center">
              {postNavigation.previous && (
                <Link
                  href={`/blog/${postNavigation.previous.slug}`}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  <div>
                    <div className="text-sm text-gray-600">Previous</div>
                    <div className="font-medium">{postNavigation.previous.title}</div>
                  </div>
                </Link>
              )}
              
              {postNavigation.next && (
                <Link
                  href={`/blog/${postNavigation.next.slug}`}
                  className="flex items-center text-right text-indigo-600 hover:text-indigo-800 transition-colors ml-auto"
                >
                  <div>
                    <div className="text-sm text-gray-600">Next</div>
                    <div className="font-medium">{postNavigation.next.title}</div>
                  </div>
                  <ChevronLeft className="w-5 h-5 ml-2 rotate-180" />
                </Link>
              )}
            </div>
          </nav>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{relatedPost.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(relatedPost.publishedAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}