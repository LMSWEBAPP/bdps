import { getSanityBlogPostBySlug } from '@/lib/sanity.client';
import { DEFAULT_BLOG_POSTS } from '@/app/api/blogs/route';
import BlogPostClientView from './BlogPostClientView';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bdpsit.com';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  let post = null;
  try {
    post = await getSanityBlogPostBySlug(slug);
  } catch (error) {
    console.error(`Error loading metadata for blog post ${slug}:`, error);
  }

  // Fallback to default blog posts if not found in Sanity
  if (!post) {
    post = DEFAULT_BLOG_POSTS.find((p) => p.slug === slug);
  }

  const title = post?.seoTitle || (post?.title ? `${post.title} | BDPS Education Blog` : 'BDPS Computer Education Blog');
  const description = post?.seoDescription || post?.excerpt || 'Explore practical IT career guidance, programming tutorials, and diploma course breakdowns at BDPS Kakinada.';

  let rawImageUrl = post?.coverImage || `${siteUrl}/icon.png`;
  if (rawImageUrl.startsWith('/')) {
    rawImageUrl = `${siteUrl}${rawImageUrl}`;
  }

  const canonicalUrl = `${siteUrl}/blog/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'BDPS Computer Education',
      locale: 'en_IN',
      type: 'article',
      publishedTime: post?.publishedAt,
      authors: [post?.author || 'BDPS Academic Desk'],
      images: [
        {
          url: rawImageUrl,
          width: 1200,
          height: 630,
          alt: post?.title || 'BDPS Article Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [rawImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  let post = null;
  try {
    post = await getSanityBlogPostBySlug(slug);
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
  }

  if (!post) {
    post = DEFAULT_BLOG_POSTS.find((p) => p.slug === slug) || DEFAULT_BLOG_POSTS[0];
  }

  return <BlogPostClientView post={post} />;
}
