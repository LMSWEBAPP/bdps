'use client';

import { useState, useEffect } from 'react';
import { BookOpen, User, Phone, Mail, GraduationCap, Clock, CheckCircle2, Lock, X } from 'lucide-react';

export default function CourseLeadGateModal({ course, isOpen, onSuccess, onClose }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('Degree (B.Sc / B.Com / B.A)');
  const [preferredBatch, setPreferredBatch] = useState('Morning (9 AM - 11 AM)');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        course: course?.title || 'General Course Inquiry',
        message: `Qualification: ${qualification} | Preferred Batch: ${preferredBatch}${notes.trim() ? ` | Notes: ${notes.trim()}` : ''}`
      };

      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined' && course?.id) {
          try {
            localStorage.setItem(`bdps_course_unlocked_${course.id}`, 'true');
            localStorage.setItem(`bdps_user_lead_${course.id}`, JSON.stringify({ fullName, email, phone }));
          } catch (e) {
            console.warn('LocalStorage error:', e);
          }
        }
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(data.message || 'Failed to submit details. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop course-gate-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content-card course-gate-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Banner */}
        <div className="course-gate-header">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn course-gate-close-btn"
              aria-label="Close modal"
              title="Close & return to courses"
            >
              <X size={20} />
            </button>
          )}

          <div className="course-gate-badge">
            <Lock size={14} /> Course Access Required
          </div>
          <h2 className="course-gate-title">
            Unlock Full Syllabus & Course Details
          </h2>
          <p className="course-gate-subtitle">
            Please submit your contact details to access full course curriculum, schedule, and fee breakdown for <strong>{course?.title || 'this course'}</strong>.
          </p>
        </div>

        {/* Modal Form Body */}
        <div className="modal-body course-gate-body">
          <form onSubmit={handleSubmit} className="form-block-column">
            {errorMessage && (
              <div className="form-error-alert">
                {errorMessage}
              </div>
            )}

            {/* Selected Course Field (Pre-selected & Locked) */}
            <div className="form-group-block">
              <label className="form-label-text">Selected Course</label>
              <div className="course-selected-input-box">
                <BookOpen size={16} className="icon-orange" />
                <input
                  type="text"
                  readOnly
                  value={course?.title || 'Course Details'}
                  className="course-selected-readonly"
                />
              </div>
            </div>

            {/* Full Name & Phone */}
            <div className="form-row-2col">
              <div className="form-group-block">
                <label className="form-label-text">Full Name *</label>
                <div className="input-icon-wrapper">
                  <User size={15} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input-with-icon"
                  />
                </div>
              </div>

              <div className="form-group-block">
                <label className="form-label-text">Phone Number *</label>
                <div className="input-icon-wrapper">
                  <Phone size={15} className="input-icon" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input-with-icon"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-group-block">
              <label className="form-label-text">Email Address *</label>
              <div className="input-icon-wrapper">
                <Mail size={15} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input-with-icon"
                />
              </div>
            </div>

            {/* Qualification & Preferred Batch */}
            <div className="form-row-2col">
              <div className="form-group-block">
                <label className="form-label-text">Qualification</label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="form-select-plain"
                >
                  <option value="Intermediate / 10+2">Intermediate / 10+2</option>
                  <option value="Degree (B.Sc / B.Com / B.A)">Degree (B.Sc / B.Com / B.A)</option>
                  <option value="B.Tech / M.Tech">B.Tech / M.Tech</option>
                  <option value="Post Graduate (MCA / M.Sc)">Post Graduate (MCA / M.Sc)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group-block">
                <label className="form-label-text">Preferred Batch</label>
                <select
                  value={preferredBatch}
                  onChange={(e) => setPreferredBatch(e.target.value)}
                  className="form-select-plain"
                >
                  <option value="Morning (9 AM - 11 AM)">Morning (9 AM - 11 AM)</option>
                  <option value="Afternoon (2 PM - 4 PM)">Afternoon (2 PM - 4 PM)</option>
                  <option value="Evening (5 PM - 7 PM)">Evening (5 PM - 7 PM)</option>
                  <option value="Weekend Batch">Weekend Batch</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-enroll-submit course-gate-submit-btn"
            >
              {submitting ? 'Unlocking Course Content...' : 'Submit & Access Course Details'}
            </button>

            <p className="form-lock-subtext text-center">
              🔒 Form details are saved to BDPS Leads database in Sanity CMS.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
