'use client';

import { useState, useEffect } from 'react';
import { Briefcase, User, Phone, Mail, GraduationCap, Clock, CheckCircle2, X, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export default function InternshipModal({ isOpen, onClose, onSuccess, siteSettings }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('Python Full Stack Development');
  const [qualification, setQualification] = useState('B.Tech');
  const [preferredBatch, setPreferredBatch] = useState('Morning (9 AM - 11 AM)');
  const [notes, setNotes] = useState('');
  const [bHp, setBHp] = useState('');

  const [availableCourses, setAvailableCourses] = useState([
    'Python Full Stack Development',
    'Core & Advanced Java',
    'Web Development & MERN Stack',
    'Tally Prime & Financial Accounting',
    'PGDCA / Computer Applications',
    'C, C++ & Data Structures',
    'Data Science & Analytics',
    'Digital Marketing & Graphic Design',
    'General Tech Internship'
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isFormActive = siteSettings === null || siteSettings?.internshipActive !== false;
  const closedNotice = siteSettings?.internshipNoticeText || 'Internship applications for the current batch are currently closed. Please check back for upcoming announcements.';

  useEffect(() => {
    // Dynamically update available courses from siteSettings or API if provided
    if (siteSettings?.internshipCourses && Array.isArray(siteSettings.internshipCourses) && siteSettings.internshipCourses.length > 0) {
      setAvailableCourses(siteSettings.internshipCourses);
      if (!siteSettings.internshipCourses.includes(course)) {
        setCourse(siteSettings.internshipCourses[0]);
      }
    } else {
      // Fetch active courses from backend if available
      fetch('/api/courses')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
            const courseTitles = data.courses.map((c) => c.title).filter(Boolean);
            if (courseTitles.length > 0) {
              setAvailableCourses(courseTitles);
              setCourse(courseTitles[0]);
            }
          }
        })
        .catch(() => {});
    }
  }, [siteSettings]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      try {
        if (localStorage.getItem('bdps_internship_submitted') === 'true') {
          setSubmittedSuccess(true);
        }
      } catch (e) {}
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return false;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    if (!course) {
      setErrorMessage('Please select your preferred internship course / domain.');
      return false;
    }

    if (!qualification) {
      setErrorMessage('Please select your educational qualification.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isFormActive) {
      setErrorMessage(closedNotice);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        course,
        qualification,
        preferredBatch,
        notes: notes.trim(),
        b_hp: bHp
      };

      const res = await fetch('/api/submit-internship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        try {
          localStorage.setItem('bdps_internship_submitted', 'true');
        } catch (e) {}
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(data.message || 'Failed to submit application. Please try again.');
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
        <div className="course-gate-header" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn course-gate-close-btn"
              aria-label="Close modal"
              title="Close modal"
            >
              <X size={20} />
            </button>
          )}

          <div className="course-gate-badge" style={{ backgroundColor: 'rgba(255, 117, 24, 0.15)', color: '#FF7518', borderColor: 'rgba(255, 117, 24, 0.3)' }}>
            <Sparkles size={14} /> BDPS Career Launchpad
          </div>
          <h2 className="course-gate-title">
            Apply for BDPS Internship Program
          </h2>
          <p className="course-gate-subtitle">
            Gain hands-on real-world experience, mentorship, and industry-recognized certification with top tech teams.
          </p>
        </div>

        {/* Modal Form Body */}
        <div className="modal-body course-gate-body">
          {!isFormActive ? (
            <div style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '14px' }}>
                <AlertCircle size={40} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                Internship Registrations Closed
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '20px', lineHeight: '1.6' }}>
                {closedNotice}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-enroll-submit course-gate-submit-btn"
                style={{ backgroundColor: '#64748b' }}
              >
                Close Window
              </button>
            </div>
          ) : submittedSuccess ? (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', marginBottom: '16px' }}>
                <CheckCircle2 size={48} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>
                Application Received!
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>
                Thank you for applying to the BDPS Internship Program. Our academic selection team will review your application and contact you shortly.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-enroll-submit course-gate-submit-btn"
              >
                Close & Return to Website
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form-block-column">
              {/* Honeypot field (hidden from real users) */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="b_hp"
                  tabIndex={-1}
                  value={bHp}
                  onChange={(e) => setBHp(e.target.value)}
                  autoComplete="off"
                />
              </div>

              {errorMessage && (
                <div className="form-error-alert">
                  {errorMessage}
                </div>
              )}

              {/* Selected Course Field */}
              <div className="form-group-block">
                <label className="form-label-text">Select Internship Course / Domain *</label>
                <div className="course-selected-input-box">
                  <BookOpen size={16} className="icon-orange" />
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="form-select-plain"
                    style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontWeight: '600' }}
                  >
                    {availableCourses.map((c, idx) => (
                      <option key={idx} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
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
                  <label className="form-label-text">Educational Qualification *</label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="form-select-plain"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="B.Com">B.Com</option>
                    <option value="B.A">B.A</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                    <option value="Intermediate / 10+2">Intermediate / 10+2</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group-block">
                  <label className="form-label-text">Preferred Batch / Shift</label>
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

              {/* Notes / Message */}
              <div className="form-group-block">
                <label className="form-label-text">Cover Note / Project Goals (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Mention your key project goals or specific technical skills..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-input-with-icon"
                  style={{ paddingLeft: '12px', minHeight: '65px' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-enroll-submit course-gate-submit-btn"
              >
                {submitting ? 'Submitting Application...' : 'Submit Internship Application'}
              </button>

              <p className="form-lock-subtext text-center">
                🔒 Application details are securely saved in BDPS Sanity Applicants database.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
