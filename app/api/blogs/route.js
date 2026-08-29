import { NextResponse } from 'next/server';
import { getSanityBlogPosts } from '@/lib/sanity.client';

export const revalidate = 60; // Cache API response for 60 seconds for <50ms speeds

export const DEFAULT_BLOG_POSTS = [
  {
    _id: 'default-blog-1',
    title: 'Top 7 Job-Oriented Computer Courses After 10th & 12th in 2026',
    slug: 'top-job-oriented-computer-courses-after-12th',
    publishedAt: new Date().toISOString(),
    category: 'Career Guidance',
    author: 'BDPS Academic Desk',
    readTime: '6 min read',
    excerpt: 'Discover high-demand IT & software diplomas including PGDCA, Full Stack Web Development, Python AI, and Tally Prime to build a lucrative career after school.',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Choosing the right career path after 10th or 12th standard is one of the most critical decisions for any student. With technology advancing rapidly, specialized computer certifications and diplomas offer immediate practical job skills and placement support.'
          }
        ]
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: '1. PGDCA (Post Graduate Diploma in Computer Applications): A comprehensive 1-year course covering programming, office applications, and database management.'
          }
        ]
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: '2. Core Java & Software Engineering: Perfect for students aspiring to join software companies as backend developers.'
          }
        ]
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: '3. Tally Prime with GST: Essential for commerce graduates looking for accounting roles in corporations and firms.'
          }
        ]
      }
    ]
  },
  {
    _id: 'default-blog-2',
    title: 'Why Full Stack Developers are in High Demand Across India & AP',
    slug: 'why-full-stack-developers-are-in-high-demand',
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'Software Engineering',
    author: 'Senior Technical Lead',
    readTime: '5 min read',
    excerpt: 'Explore why MERN stack and Python web developers command top salaries in IT companies, startups, and remote tech roles.',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Full Stack Developers master both frontend user interfaces (React, HTML, CSS) and backend database servers (Node.js, Express, MongoDB, Python). Companies prefer hiring full-stack talent because they can manage end-to-end web applications.'
          }
        ]
      }
    ]
  },
  {
    _id: 'default-blog-3',
    title: 'Mastering Tally Prime GST Taxation: Scope & Salary for Commerce Students',
    slug: 'mastering-tally-prime-gst-taxation-scope-and-salary',
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    category: 'Financial Accounting',
    author: 'BDPS Finance Faculty',
    readTime: '4 min read',
    excerpt: 'Learn how computerized accounting with Tally Prime opens job doors in corporate audit, banking, GST filing, and bookkeeping.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    content: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Tally Prime remains India’s standard accounting software. Mastering commercial bookkeeping, GST calculations, inventory tracking, and e-invoicing is a guaranteed pathway into accounting jobs.'
          }
        ]
      }
    ]
  }
];

export async function GET() {
  try {
    const sanityPosts = await getSanityBlogPosts();
    if (Array.isArray(sanityPosts) && sanityPosts.length > 0) {
      return NextResponse.json({ success: true, posts: sanityPosts });
    }
    return NextResponse.json({ success: true, posts: DEFAULT_BLOG_POSTS, source: 'default' });
  } catch (error) {
    console.error('Error in /api/blogs API:', error);
    return NextResponse.json({ success: true, posts: DEFAULT_BLOG_POSTS, source: 'fallback' });
  }
}
