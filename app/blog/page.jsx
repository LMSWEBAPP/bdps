import { getSanityBlogPosts } from '@/lib/sanity.client';
import { DEFAULT_BLOG_POSTS } from '@/app/api/blogs/route';
import BlogCatalogClient from './BlogCatalogClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bdpsit.com';

export const metadata = {
  title: 'Tech & Career Blog | BDPS Computer Education Kakinada',
  description: 'Read the latest IT career guidance, software development tutorials, PGDCA diploma tips, and Tally Prime accounting guides from BDPS Computer Education.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Tech & Career Blog | BDPS Computer Education',
    description: 'Expert IT career advice, full-stack programming guides, and computer education insights from Kakinada’s top institute.',
    url: `${siteUrl}/blog`,
    siteName: 'BDPS Computer Education',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech & Career Blog | BDPS Computer Education',
    description: 'Expert IT career advice, full-stack programming guides, and computer education insights.',
  },
};

export default async function BlogPage() {
  let posts = [];
  try {
    posts = await getSanityBlogPosts();
  } catch (error) {
    console.error('Error loading blog posts for /blog page:', error);
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    posts = DEFAULT_BLOG_POSTS;
  }

  return <BlogCatalogClient initialPosts={posts} />;
}
