'use client';

import { useState } from 'react';
import { X, Award, CheckCircle, AlertCircle, Calendar, GraduationCap, Building2, User, Mail, Phone, MapPin } from 'lucide-react';

export default function StipendRegistrationModal({ isOpen, onClose, siteSettings }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [graduationDetails, setGraduationDetails] = useState('');
  const [passingYear, setPassingYear] = useState('2024');
  const [college, setCollege] = useState('');
  const [location, setLocation] = useState('');
  const [mode, setMode] = useState('Online');
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const isStipendActive = siteSettings?.stipendRegistrationActive !== false;
  const noticeMsg = siteSettings?.stipendNoticeText || 'Stipend registrations for the current batch are now closed. Please check back for upcoming cohort announcements.';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStipendActive) return;

    setError('');
    setSuccessMsg('');

    if (!consent) {
      setError('Please accept the privacy consent checkbox to proceed.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          dob,
          gender,
          graduationDetails,
          passingYear,
          college,
          location,
          mode
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit stipend registration.');
      }

      setSuccessMsg('Stipend Registration Submitted Successfully! Our admissions team will review your application.');

      setFullName('');
      setEmail('');
      setPhone('');
      setDob('');
      setGender('Male');
      setGraduationDetails('');
      setPassingYear('2024');
      setCollege('');
      setLocation('');
      setConsent(false);

    } catch (err) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-card">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-tag">
              <Award size={16} /> Scholarship & Stipend Intake
            </div>
            <h2 className="modal-title">
              Stipend Registration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {/* If disabled by Sanity CMS site settings */}
          {!isStipendActive && (
            <div className="form-error-alert" style={{ marginBottom: '18px', backgroundColor: '#FEF2F2', borderColor: '#EF4444', color: '#991B1B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '14.5px', marginBottom: '4px' }}>
                <AlertCircle size={18} color="#EF4444" />
                <span>Stipend Intake Currently Closed</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.45' }}>
                {noticeMsg}
              </p>
            </div>
          )}

          {successMsg ? (
            <div className="section-header-center">
              <CheckCircle size={56} className="contact-icon" />
              <h3 className="contact-card-title">
                Application Recorded
              </h3>
              <p className="about-paragraph">
                {successMsg}
              </p>
              <button
                onClick={() => { setSuccessMsg(''); onClose(); }}
                className="btn-explore"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <fieldset disabled={!isStipendActive} style={{ border: 'none', padding: 0, margin: 0 }}>
                <div className="modal-form-grid">
                  
                  {/* Full Name & Email */}
                  <div className="form-row-2col">
                    <div>
                      <label className="form-label">
                        FULL NAME <span className="form-required">*</span>
                      </label>
                      <div className="input-icon-wrapper">
                        <User size={15} className="input-icon" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Reddy"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="form-input-with-icon"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        EMAIL ADDRESS <span className="form-required">*</span>
                      </label>
                      <div className="input-icon-wrapper">
                        <Mail size={15} className="input-icon" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. ramesh@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input-with-icon"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & DOB */}
                  <div className="form-row-2col">
                    <div>
                      <label className="form-label">
                        PHONE NUMBER <span className="form-required">*</span>
                      </label>
                      <div className="input-icon-wrapper">
                        <Phone size={15} className="input-icon" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="form-input-with-icon"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        DATE OF BIRTH <span className="form-required">*</span>
                      </label>
                      <div className="input-icon-wrapper">
                        <Calendar size={15} className="input-icon" />
                        <input
                          type="date"
                          required
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="form-input-with-icon"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gender & Graduation Details */}
                  <div className="form-row-2col">
                    <div>
                      <label className="form-label">
                        GENDER <span className="form-required">*</span>
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="form-select-plain"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">
                        HIGHEST QUALIFICATION <span className="form-required">*</span>
                      </label>
                      <div className="input-icon-wrapper">
                        <GraduationCap size={15} className="input-icon" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. B.Tech CSE / B.Sc / Degree"
                          value={graduationDetails}
                          onChange={(e) => setGraduationDetails(e.target.value)}
                          className="form-input-with-icon"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passing Year & College */}
                  <div className="form-row-2col">
                    <div>
                      <label className="form-label">
                        PASSING YEAR <span className="form-required">*</span>
                      </label>
                      <select
                        value={passingYear}
                        onChange={(e) => setPassingYear(e.target.value)}
                        className="form-select-plain"
                      >
                        <option value="2026">2026 (Pursuing)</option>
                        <option value="2025">2025 (Pursuing)</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022 or earlier</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">
                        COLLEGE / INSTITUTION <span className="form-required">*</span>
                      </label>
                      <div className="input-icon-wrapper">
                        <Building2 size={15} className="input-icon" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ideal College, Kakinada"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          className="form-input-with-icon"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location & Preferred Mode */}
                  <div className="form-row-2col">
                    <div>
                      <label className="form-label">
                        CITY / LOCATION <span className="form-required">*</span>
                      </label>
                      <div className="input-icon-wrapper">
                        <MapPin size={15} className="input-icon" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kakinada / Rajahmundry"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="form-input-with-icon"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        PREFERRED MODE <span className="form-required">*</span>
                      </label>
                      <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="form-select-plain"
                      >
                        <option value="Offline Lab (Kakinada)">Offline Lab Practice (Kakinada Campus)</option>
                        <option value="Online Virtual">Online Interactive Live Class</option>
                      </select>
                    </div>
                  </div>

                  {/* Privacy Consent Checkbox */}
                  <div className="form-checkbox-row">
                    <input
                      type="checkbox"
                      id="consentCheck"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="form-checkbox-input"
                    />
                    <label htmlFor="consentCheck" className="form-checkbox-label">
                      I consent to BDPS collecting and processing my academic & contact details for stipend selection purposes.
                    </label>
                  </div>

                  {error && (
                    <div className="form-error-alert">{error}</div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !isStipendActive}
                    className={`btn-submit-stipend ${!isStipendActive ? 'btn-disabled' : ''}`}
                  >
                    {loading ? 'Submitting Application...' : isStipendActive ? 'Submit Stipend Registration' : 'Registration Closed'}
                  </button>

                </div>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
