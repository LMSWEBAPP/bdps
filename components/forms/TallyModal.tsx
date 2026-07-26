'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface TallyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TallyModal({ isOpen, onClose }: TallyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'General Counseling',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null as string | null
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setStatus({ loading: false, success: false, error: 'Please enter Name and Phone number' });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          email: formData.email,
          course: formData.course,
          message: formData.message
        })
      });

      if (!res.ok) throw new Error('Submission failed');

      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', phone: '', email: '', course: 'General Counseling', message: '' });
    } catch (err: any) {
      setStatus({ loading: false, success: false, error: err.message || 'Something went wrong' });
    }
  };

  const closeModal = () => {
    setStatus({ loading: false, success: false, error: null });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div onClick={closeModal} className="modal-backdrop" />

      <div className="modal-content-card">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Course Counseling Inquiry</h3>
            <p className="modal-tag">Fill out to request course & fee guidance</p>
          </div>
          <button onClick={closeModal} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {status.success ? (
            <div className="section-header-center">
              <CheckCircle2 size={54} className="contact-icon" />
              <h4 className="bento-card-title">Inquiry Received!</h4>
              <p className="about-paragraph">
                Thank you for contacting BDPS Computer Education. Our counselor will get back to you shortly.
              </p>
              <button onClick={closeModal} className="btn-explore">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="modal-form-grid">
              {status.error && (
                <div className="form-required">
                  {status.error}
                </div>
              )}

              <div>
                <label className="form-label">FULL NAME</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input-plain"
                />
              </div>

              <div className="form-row-2col">
                <div>
                  <label className="form-label">PHONE</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 9999999999"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input-plain"
                  />
                </div>
                <div>
                  <label className="form-label">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input-plain"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">INTERESTED COURSE</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="form-input-plain"
                >
                  <option value="General Counseling">General Counseling</option>
                  <option value="PGDCA Diploma">PGDCA Diploma</option>
                  <option value="Java Programming">Java Programming</option>
                  <option value="Tally Prime">Tally Prime & GST</option>
                  <option value="Web Development">Web Development</option>
                </select>
              </div>

              <div>
                <label className="form-label">MESSAGE (OPTIONAL)</label>
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Any specific questions?"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input-plain"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="btn-submit-stipend"
              >
                <Send size={16} /> {status.loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
