'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PopupAdModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [adData, setAdData] = useState(null);

  useEffect(() => {
    // Fetch live popup ad from Sanity CMS via API with no-store cache
    fetch('/api/popup-ad', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.ad && data.ad.image) {
          setAdData(data.ad);
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 1000);
          return () => clearTimeout(timer);
        } else {
          // Fallback if no image uploaded in Sanity CMS
          setAdData({
            title: 'BDPS Computer Education',
            image: 'https://picsum.photos/seed/bdps-ad/800/1200',
            targetUrl: '/contact?type=student',
            buttonText: 'Learn More'
          });
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 1000);
          return () => clearTimeout(timer);
        }
      })
      .catch(err => {
        console.error('Error fetching popup ad:', err);
      });
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || !adData) return null;

  return (
    <div className="poster-modal-backdrop">
      <div onClick={handleClose} className="poster-modal-overlay" />
      
      <div className="poster-modal-card">
        {/* Floating Close Button */}
        <button
          onClick={handleClose}
          className="poster-close-btn"
          aria-label="Close advertisement"
        >
          <X size={18} />
        </button>

        {/* 9:16 Vertical Poster Banner */}
        <Link 
          href={adData.targetUrl || '/contact?type=student'} 
          onClick={handleClose}
          className="poster-image-link"
        >
          <img
            src={adData.image}
            alt={adData.title || 'BDPS Advertisement'}
            className="poster-banner-img"
            width="473"
            height="711"
            loading="lazy"
          />
        </Link>

        {/* Sleek Compact Bottom CTA Bar */}
        <div className="poster-footer-bar">
          <Link
            href={adData.targetUrl || '/contact?type=student'}
            onClick={handleClose}
            className="poster-cta-btn"
          >
            {adData.buttonText || 'Learn More'} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
