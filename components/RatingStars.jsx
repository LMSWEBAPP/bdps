'use client';

import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5.0 }) {
  const num = Math.min(5, Math.max(0, Number(rating) || 5));

  return (
    <div className="course-stars-flex">
      <svg width="0" height="0" className="svg-defs-hidden">
        <defs>
          <linearGradient id="bdpsHalfStarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#FF7518" />
            <stop offset="50%" stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
      </svg>

      {[0, 1, 2, 3, 4].map((index) => {
        const fillAmount = Math.max(0, Math.min(1, num - index));

        if (fillAmount >= 0.8) {
          // Full Star
          return (
            <Star key={index} size={14} fill="#FF7518" color="#FF7518" />
          );
        } else if (fillAmount >= 0.25) {
          // Half Star with 100% crisp linearGradient
          return (
            <svg key={index} width={14} height={14} viewBox="0 0 24 24" className="star-icon-half">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="url(#bdpsHalfStarGrad)"
              />
            </svg>
          );
        } else {
          // Empty Star
          return (
            <Star key={index} size={14} color="#D1D5DB" fill="#D1D5DB" />
          );
        }
      })}
    </div>
  );
}
