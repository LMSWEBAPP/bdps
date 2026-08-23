'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, UserCheck, PhoneCall, ExternalLink, X, ArrowRight, BookOpen } from 'lucide-react';

export default function StudentLoginModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL;

  return (
    <div className="modal-backdrop student-login-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content-card student-login-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <div className="student-login-header">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn student-login-close-btn"
              aria-label="Close modal"
              title="Close Notice"
            >
              <X size={20} />
            </button>
          )}

          <div className="student-login-badge">
            <ShieldCheck size={14} /> Registered Student Access Only
          </div>
          <h2 className="student-login-title">
            BDPS Student Login Portal
          </h2>
          <p className="student-login-subtitle">
            Secure portal access for enrolled candidates & course students
          </p>
        </div>

        {/* Modal Body / Notice Box */}
        <div className="modal-body student-login-body">
          <div className="student-notice-box">
            <div className="student-notice-icon-wrapper">
              <Lock size={28} className="student-notice-icon" />
            </div>
            <div className="student-notice-content">
              <h3 className="student-notice-heading">Official Registration Required</h3>
              <p className="student-notice-text">
                This login portal is exclusively accessible to candidates who have officially completed their course registration with <strong>BDPS Computer Education</strong>.
              </p>
              <p className="student-notice-subtext">
                Enrolled students can log in using their credentials issued at registration. If you are a new applicant or need account activation, please reach out to our administration desk.
              </p>
            </div>
          </div>

          {/* Key Actions */}
          <div className="student-modal-actions">
            {frappeUrl ? (
              <a
                href={`${frappeUrl}/login`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-student-proceed"
              >
                <span>Proceed to ERP Portal</span>
                <ExternalLink size={16} />
              </a>
            ) : (
              <Link
                href="/contact?type=student"
                onClick={onClose}
                className="btn-student-proceed"
              >
                <span>Contact Admissions Desk for Access</span>
                <ArrowRight size={16} />
              </Link>
            )}

            <div className="student-modal-secondary-row">
              <Link
                href="/courses"
                onClick={onClose}
                className="btn-student-outline"
              >
                <BookOpen size={15} />
                <span>Explore BDPS Courses</span>
              </Link>
              <Link
                href="/contact?type=student"
                onClick={onClose}
                className="btn-student-outline"
              >
                <PhoneCall size={15} />
                <span>Contact Support</span>
              </Link>
            </div>
          </div>

          <div className="student-notice-footer">
            <span>🔒 Protected by BDPS Computer Education & IT Solutions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
