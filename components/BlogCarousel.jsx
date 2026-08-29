'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, User } from 'lucide-react';
import { DEFAULT_BLOG_POSTS } from '@/app/api/blogs/route';

const categoryColors = {
  'Career Guidance': '#ef4444',
  'Software Engineering': '#10b981',
  'Financial Accounting': '#3b82f6',
  'Scholarships & Diplomas': '#8b5cf6',
  'Tech Trends': '#f97316',
};

const stripMarkdown = (str) => {
  if (!str) return '';
  return str.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^#+\s+/g, '');
};

export default function BlogCarousel() {
  const [blogs, setBlogs] = useState(DEFAULT_BLOG_POSTS.slice(0, 5));

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setBlogs(data.posts.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load homepage blogs:', err);
      }
    }
    loadBlogs();
  }, []);

  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="homepage-section" style={{ background: '#f8fafc', padding: '70px 20px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fecaca', padding: '6px 16px', borderRadius: '30px', color: '#dc2626', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
            <Sparkles size={15} /> Knowledge Hub & Tech Trends
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2' }}>
            Featured Career Articles & Guides
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '650px', margin: '10px auto 0' }}>
            Explore practical computer training roadmaps, MERN stack, Python AI, PGDCA syllabus, and commercial accounting insights.
          </p>
        </div>

        {/* Pinterest / Bento Magazine 5-Card Layout Matching Exact Screenshot */}
        <div className="bento-magazine-grid">
          {blogs.map((post, idx) => {
            const isMainHero = idx === 0;
            const badgeBg = categoryColors[post.category] || '#ef4444';
            const formattedDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Recent';

            return (
              <motion.div
                key={post._id || post.slug}
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.2 }}
                className={`bento-card bento-item-${idx}`}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  }}
                >
                  {/* Background Image */}
                  <img
                    src={post.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'}
                    alt={post.title}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />

                  {/* Gradient Overlay for White Text Contrast */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.5) 55%, rgba(15, 23, 42, 0.1) 100%)',
                    }}
                  />

                  {/* Card Bottom Text Overlay */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      padding: isMainHero ? '26px' : '18px',
                    }}
                  >
                    {/* Category Pill Badge */}
                    <div style={{ marginBottom: '8px' }}>
                      <span
                        style={{
                          background: badgeBg,
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'inline-block',
                        }}
                      >
                        {post.category || 'Tech'}
                      </span>
                    </div>

                    {/* Article Title */}
                    <h3
                      style={{
                        color: '#ffffff',
                        fontSize: isMainHero ? '1.45rem' : '1.025rem',
                        fontWeight: '800',
                        lineHeight: '1.3',
                        marginBottom: '10px',
                        display: '-webkit-box',
                        WebkitLineClamp: isMainHero ? 4 : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                      }}
                    >
                      {stripMarkdown(post.title)}
                    </h3>

                    {/* Author Avatar & Date Meta */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: '500',
                        minWidth: 0,
                        maxWidth: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <User size={11} style={{ color: '#ffffff' }} />
                      </div>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>
                        <strong style={{ color: '#ffffff' }}>{post.author || 'BDPS Desk'}</strong> in {formattedDate}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Knowledge Hub Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#dc2626',
              color: '#ffffff',
              padding: '12px 30px',
              borderRadius: '12px',
              fontWeight: '700',
              textDecoration: 'none',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(220,38,38,0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            Explore Knowledge Hub & All Articles <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
