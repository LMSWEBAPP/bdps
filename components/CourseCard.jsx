'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Share2, Check, ArrowRight, Clock, User, Star } from 'lucide-react';

function RatingStars({ rating }) {
  const numRating = Number(rating) || 5;
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          style={{
            color: i < fullStars || (i === fullStars && hasHalfStar) ? '#F59E0B' : '#E2E8F0',
            fill: i < fullStars || (i === fullStars && hasHalfStar) ? '#F59E0B' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

export default function CourseCard({ course, showSubtitle = false }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  if (!course) return null;

  const courseId = course.id || course._id;
  const courseUrl = `/courses/${courseId}`;

  const handleCardClick = (e) => {
    // If clicked on share button or direct link, don't trigger parent handler
    if (e.target.closest('.catalog-share-overlay-btn') || e.target.closest('.btn-share-course')) {
      return;
    }
    router.push(courseUrl);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${courseUrl}` : courseUrl;
    const shareData = {
      title: course.title,
      text: `Check out ${course.title} course at BDPS Computer Education!`,
      url: fullUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard if user cancels Web Share dialog
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div 
      className="catalog-course-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(courseUrl);
        }
      }}
    >
      <div className="catalog-card-image-box">
        <img
          src={course.image || 'https://picsum.photos/seed/bdps/800/600'}
          alt={course.title}
          className="catalog-card-img"
        />
        <span className="catalog-badge-category">
          {course.category || 'Certification'}
        </span>
        {course.fee && (
          <span className="catalog-badge-fee">₹{course.fee}</span>
        )}

        <button
          onClick={handleShare}
          className={`catalog-share-overlay-btn ${copied ? 'copied' : ''}`}
          title={copied ? 'Link Copied!' : 'Share Course'}
          aria-label="Share Course"
        >
          {copied ? <Check size={15} /> : <Share2 size={15} />}
          {copied && <span className="share-toast-pop">Copied!</span>}
        </button>
      </div>

      <div className="catalog-card-body">
        <h3 className="catalog-card-title" title={course.title}>
          {course.title}
        </h3>

        {showSubtitle && (
          <p className="catalog-card-desc">
            {course.subtitle || course.tagline || 'Comprehensive hands-on training with lab practice.'}
          </p>
        )}

        <div className="course-rating-row">
          <RatingStars rating={course.rating} />
          <span className="course-rating-text">
            {course.rating ? Number(course.rating).toFixed(1) : '5.0'} ({course.reviewsCount || '120+ reviews'})
          </span>
        </div>

        <div className="course-meta-divider">
          <div className="course-meta-item">
            <Clock size={14} className="course-meta-icon" />
            <span>Duration: {course.duration || '3-4 Months'}</span>
          </div>
          <div className="course-meta-item">
            <User size={14} className="course-meta-icon" />
            <span>Mentor: {course.instructor || 'Certified Coach'}</span>
          </div>
        </div>

        <div className="catalog-card-actions">
          <Link href={courseUrl} className="btn-catalog-details" onClick={(e) => e.stopPropagation()}>
            <span>Enroll</span> <ArrowRight size={14} />
          </Link>
          <button
            onClick={handleShare}
            className={`btn-share-course ${copied ? 'copied' : ''}`}
            title={copied ? 'Link Copied!' : 'Share Course'}
            aria-label="Share Course"
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
