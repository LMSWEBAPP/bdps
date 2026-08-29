'use client';

import Link from 'next/link';
import { Calendar, User, Clock, Share2, ArrowLeft, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';

export default function BlogPostClientView({ post }) {
  if (!post) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://www.bdpsit.com/blog/${post.slug}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Article link copied to clipboard!');
    }
  };

  // Zero-dependency inline markdown formatter (**bold**, *italic*, [link])
  const parseInlineMarkdown = (str) => {
    if (!str) return '';
    // Match **bold** or *italic* or plain text
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={index} style={{ fontWeight: '700', color: '#0f172a' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  // Safe renderer for Sanity portable text blocks or string text with inline Markdown support
  const renderContentBlocks = (content) => {
    if (!content) return <p>{parseInlineMarkdown(post.excerpt)}</p>;
    if (typeof content === 'string') {
      const paragraphs = content.split('\n');
      return paragraphs.map((para, idx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} style={{ fontSize: '1.3rem', fontWeight: '700', margin: '24px 0 12px', color: '#1e293b' }}>{parseInlineMarkdown(trimmed.replace(/^###\s+/, ''))}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} style={{ fontSize: '1.6rem', fontWeight: '800', margin: '30px 0 14px', color: '#0f172a' }}>{parseInlineMarkdown(trimmed.replace(/^##\s+/, ''))}</h2>;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return <li key={idx} style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155', marginLeft: '20px', marginBottom: '8px' }}>{parseInlineMarkdown(trimmed.replace(/^[-*]\s+/, ''))}</li>;
        }
        return <p key={idx} style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155', marginBottom: '18px' }}>{parseInlineMarkdown(trimmed)}</p>;
      });
    }
    if (Array.isArray(content)) {
      return content.map((block, idx) => {
        if (block._type === 'block') {
          const textContent = block.children?.map((c) => c.text).join('') || '';
          if (block.style === 'h2') {
            return <h2 key={idx} style={{ fontSize: '1.6rem', fontWeight: '800', margin: '28px 0 14px', color: '#0f172a' }}>{parseInlineMarkdown(textContent)}</h2>;
          }
          if (block.style === 'h3') {
            return <h3 key={idx} style={{ fontSize: '1.3rem', fontWeight: '700', margin: '22px 0 10px', color: '#1e293b' }}>{parseInlineMarkdown(textContent)}</h3>;
          }
          return <p key={idx} style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155', marginBottom: '18px' }}>{parseInlineMarkdown(textContent)}</p>;
        }
        if (block._type === 'image' && block.asset?.url) {
          return (
            <img
              key={idx}
              src={block.asset.url}
              alt="Blog Content Illustration"
              style={{ width: '100%', borderRadius: '12px', margin: '24px 0' }}
            />
          );
        }
        return null;
      });
    }
    return null;
  };

  return (
    <div className="visitor-landing-page">
      <VisitorHeader />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Back Link */}
        <Link
          href="/blog"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', fontWeight: '600', textDecoration: 'none', marginBottom: '24px', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={18} /> Back to All Articles
        </Link>

        {/* Category & Meta Header */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>
            {post.category || 'Career Insights'}
          </span>
        </div>

        {/* Post Title */}
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.25', marginBottom: '20px' }}>
          {post.title}
        </h1>

        {/* Author & Info Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '16px 0', marginBottom: '32px', color: '#64748b', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#1e293b' }}>
              <User size={16} className="text-red-500" /> {post.author || 'BDPS Desk'}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> {post.readTime || '5 min read'}
            </span>
          </div>

          <button
            onClick={handleShare}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', color: '#0f172a', cursor: 'pointer' }}
          >
            <Share2 size={16} /> Share Article
          </button>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <img
              src={post.coverImage}
              alt={post.title}
              style={{ width: '100%', maxHeight: '480px', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Lead Excerpt */}
        {post.excerpt && (
          <div style={{ background: '#f8fafc', borderLeft: '4px solid #dc2626', padding: '20px 24px', borderRadius: '0 12px 12px 0', fontSize: '1.15rem', color: '#334155', lineHeight: '1.6', fontWeight: '500', marginBottom: '36px' }}>
            {parseInlineMarkdown(post.excerpt)}
          </div>
        )}

        {/* Main Body Content */}
        <div style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.8' }}>
          {renderContentBlocks(post.content)}
        </div>

        {/* Course CTA Banner Box */}
        <div style={{ marginTop: '60px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '20px', padding: '36px 30px', color: '#ffffff', textAlign: 'center', boxShadow: '0 12px 35px rgba(15,23,42,0.15)' }}>
          <BookOpen size={40} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '10px' }}>
            Ready to Start Your Career at BDPS Computer Education?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 24px' }}>
            Get 100% practical lab training in Full Stack Development, Java, Python AI, PGDCA, or Tally Prime GST with job placement assistance.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/courses"
              style={{ background: '#dc2626', color: '#ffffff', padding: '12px 26px', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Explore All Courses <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '12px 26px', borderRadius: '10px', fontWeight: '600', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Request Free Counseling
            </Link>
          </div>
        </div>
      </div>

      <VisitorFooter />
    </div>
  );
}
