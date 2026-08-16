'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Building2, MapPin, User, Mail, Phone, GraduationCap, Clock, ExternalLink, X, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function JobLeadModal({ job, isOpen, onClose, onSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('B.Tech / B.E (CS/IT/ECE/Other)');
  const [experience, setExperience] = useState('Fresher (0 - 1 Year)');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill from previous session cache if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bdps_applicant_info');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.qualification) setQualification(parsed.qualification);
          if (parsed.experience) setExperience(parsed.experience);
          if (parsed.city) setCity(parsed.city);
        }
      } catch (e) {}
    }
  }, [isOpen]);

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

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        jobTitle: job.title || 'Indian Job Opening',
        company: job.company || 'Direct Employer',
        qualification,
        experience,
        city: city.trim() || 'India',
        appliedJobUrl: job.redirectUrl || 'https://www.adzuna.in',
        notes: notes.trim(),
      };

      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('bdps_job_lead_submitted', 'true');
            localStorage.setItem(
              'bdps_applicant_info',
              JSON.stringify({ fullName, email, phone, qualification, experience, city })
            );
          } catch (e) {}
        }
        if (onSuccess) {
          onSuccess(job.redirectUrl || 'https://www.adzuna.in');
        }
      } else {
        setErrorMessage(data.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content-card job-lead-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Banner */}
        <div className="job-lead-modal-header">
          {onClose && (
            <button onClick={onClose} className="modal-close-btn" aria-label="Close form">
              <X size={18} />
            </button>
          )}

          <div className="job-lead-header-tag">
            <ShieldCheck size={14} /> Quick One-Time Candidate Verification
          </div>

          <h3 className="job-lead-modal-title">Apply on Official Portal</h3>
          <p className="job-lead-modal-subtitle">
            Enter your details once to unlock direct application access and placement assistance from BDPS.
          </p>

          {/* Target Job Summary Badge */}
          <div className="job-lead-target-badge">
            <Briefcase size={16} className="target-badge-icon" />
            <div className="target-badge-info">
              <span className="target-badge-title">{job.title}</span>
              <span className="target-badge-meta">
                <Building2 size={12} /> {job.company || 'Direct Employer'} &nbsp;•&nbsp; 
                <MapPin size={12} /> {job.location || 'India'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="job-lead-form-body">
          {errorMessage && (
            <div className="form-error-banner">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="form-two-col">
            <div className="form-field-group">
              <label className="form-field-label">Full Name *</label>
              <div className="form-input-wrapper">
                <User size={16} className="form-field-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input-control"
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">WhatsApp / Mobile *</label>
              <div className="form-input-wrapper">
                <Phone size={16} className="form-field-icon" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input-control"
                />
              </div>
            </div>
          </div>

          <div className="form-two-col">
            <div className="form-field-group">
              <label className="form-field-label">Email Address *</label>
              <div className="form-input-wrapper">
                <Mail size={16} className="form-field-icon" />
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input-control"
                />
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Current City / Location *</label>
              <div className="form-input-wrapper">
                <MapPin size={16} className="form-field-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Kakinada / Hyderabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input-control"
                />
              </div>
            </div>
          </div>

          <div className="form-two-col">
            <div className="form-field-group">
              <label className="form-field-label">Highest Qualification</label>
              <div className="form-input-wrapper">
                <GraduationCap size={16} className="form-field-icon" />
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="form-input-control form-select-control"
                >
                  <option value="B.Tech / B.E (CS/IT/ECE/Other)">B.Tech / B.E (CS/IT/ECE/Other)</option>
                  <option value="B.Sc / B.Com / B.A Degree">B.Sc / B.Com / B.A Degree</option>
                  <option value="BCA / MCA">BCA / MCA</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                  <option value="Post Graduate (M.Tech/MBA)">Post Graduate (M.Tech/MBA)</option>
                  <option value="Intermediate / +2">Intermediate / +2</option>
                </select>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Experience Level</label>
              <div className="form-input-wrapper">
                <Clock size={16} className="form-field-icon" />
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="form-input-control form-select-control"
                >
                  <option value="Fresher (0 - 1 Year)">Fresher (0 - 1 Year)</option>
                  <option value="1 - 2 Years Experience">1 - 2 Years Experience</option>
                  <option value="2 - 4 Years Experience">2 - 4 Years Experience</option>
                  <option value="4+ Years Experience">4+ Years Experience</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-privacy-note">
            🔒 Your details are safely stored in BDPS Placement Records and will redirect you directly to the official portal.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-job-lead-submit"
          >
            {submitting ? (
              <span>Connecting to Official Portal...</span>
            ) : (
              <>
                <span>Submit & Apply on Official Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
