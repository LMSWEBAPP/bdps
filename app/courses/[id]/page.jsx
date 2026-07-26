'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star, Clock, User, Award, CheckCircle2, BookOpen, 
  ArrowLeft, ShieldCheck, Send, Calendar, CheckSquare
} from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';

const DEFAULT_COURSES_DB = {
  '1': {
    id: '1',
    title: 'Post Graduate Diploma in Computer Applications (PGDCA)',
    category: 'Full Stack',
    duration: '1 Year',
    instructor: 'Certified Senior Coach',
    fee: '15,000',
    subtitle: 'Comprehensive 1-year graduate diploma program covering office software, database management, and web fundamentals.',
    description: 'The PGDCA program is designed for graduates seeking a career in software development, office automation, and IT administration. Students learn fundamental programming logic, databases, software development techniques, and practical tools widely used in commercial enterprises.',
    image: 'https://picsum.photos/seed/course-pgdca/800/600',
    syllabus: [
      'Module 1: Computer Fundamentals & Operating System Architecture',
      'Module 2: Microsoft Office Automation (Word, Excel, PowerPoint, Access)',
      'Module 3: Relational Database Management Systems (SQL & MySQL)',
      'Module 4: Programming Logic & Object-Oriented Principles',
      'Module 5: Web Design Fundamentals (HTML5, CSS3, JavaScript Basics)',
      'Module 6: Final Academic Capstone Project & Viva Presentation'
    ]
  },
  '2': {
    id: '2',
    title: 'Core Java & Software Programming',
    category: 'Software Programming',
    duration: '3-4 Months',
    instructor: 'Senior Java Dev',
    fee: '8,000',
    subtitle: 'Master object-oriented coding, collections framework, multi-threading, JDBC, and SQL databases with hands-on practice.',
    description: 'This course provides deep hands-on expertise in Core Java. Designed for beginners and computer science students aiming for enterprise software development roles in IT MNCs.',
    image: 'https://picsum.photos/seed/course-java/800/600',
    syllabus: [
      'Module 1: Java Syntax, Data Types, Operators & Control Statements',
      'Module 2: Object-Oriented Programming (Inheritance, Polymorphism, Encapsulation)',
      'Module 3: Exception Handling & File I/O Streams',
      'Module 4: Java Collections Framework (List, Set, Map)',
      'Module 5: Multi-Threading, Concurrency & Lambda Expressions',
      'Module 6: JDBC Connectivity & Real-World Project Workshop'
    ]
  },
  '3': {
    id: '3',
    title: 'Tally Prime & Commercial Financial Accounting',
    category: 'Financial Accounting',
    duration: '3 Months',
    instructor: 'Chartered Accountant',
    fee: '6,500',
    subtitle: 'Master commercial accounting, taxation (GST, TDS), payroll management, and generate professional balance sheets.',
    description: 'Learn practical bookkeeping, voucher entry, inventory management, GST compliance, TDS returns, and financial auditing with Tally Prime.',
    image: 'https://picsum.photos/seed/course-tally/800/600',
    syllabus: [
      'Module 1: Principles of Accounting & Double Entry System',
      'Module 2: Tally Prime Fundamentals & Company Setup',
      'Module 3: Voucher Entry, Inventory & Stock Management',
      'Module 4: GST Filing, Tax Calculations & E-Way Bills',
      'Module 5: Payroll Processing & Employee Management',
      'Module 6: Financial Reports, Profit & Loss, Balance Sheet Audit'
    ]
  }
};

export default function CourseDetailsPage({ params }) {
  const courseId = params?.id || '1';

  const [course, setCourse] = useState(DEFAULT_COURSES_DB[courseId] || DEFAULT_COURSES_DB['1']);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    qualification: 'Degree',
    preferredBatch: 'Morning (9 AM - 11 AM)',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!courseId) return;
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.course) {
          setCourse(data.course);
        }
      })
      .catch(err => console.error('Error fetching single course details:', err));
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        course: course.title,
        message: `Qualification: ${formData.qualification} | Preferred Batch: ${formData.preferredBatch}${formData.message ? ` | Notes: ${formData.message}` : ''}`
      };

      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.message || 'Failed to submit registration. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Hero Header Banner */}
      <section className="courses-banner-header">
        <div className="courses-banner-container">
          <div className="course-detail-header-top">
            <Link href="/courses" className="btn-back-link">
              <ArrowLeft size={16} /> Back to All Courses
            </Link>
            <div className="course-badge-inline">
              {course.category || 'Certification'}
            </div>
          </div>
          <h1 className="courses-banner-title">{course.title}</h1>
          <p className="courses-banner-desc">{course.subtitle || course.tagline}</p>
        </div>
      </section>

      {/* Main 2-Column Container */}
      <main className="course-detail-container">
        {/* Left Column: Course Overview & Syllabus */}
        <section className="course-detail-main">
          {/* Card 1: Overview */}
          <div className="course-detail-card">
            <h3 className="course-detail-heading">Course Overview</h3>
            <p className="course-detail-text">
              {course.description || course.subtitle}
            </p>

            <div className="course-meta-divider course-meta-bottom">
              <div className="course-meta-item">
                <Clock size={16} className="course-meta-icon" />
                <span><strong>Duration:</strong> {course.duration || '3-4 Months'}</span>
              </div>
              <div className="course-meta-item">
                <User size={16} className="course-meta-icon" />
                <span><strong>Instructor:</strong> {course.instructor || 'Senior Technical Coach'}</span>
              </div>
              <div className="course-meta-item">
                <Award size={16} className="course-meta-icon" />
                <span><strong>Fee:</strong> ₹{course.fee || '8,000'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Syllabus Modules */}
          <div className="course-detail-card">
            <h3 className="course-detail-heading">Curriculum & Syllabus Highlights</h3>
            <div className="syllabus-list">
              {(course.syllabus && course.syllabus.length > 0 ? course.syllabus : [
                'Module 1: Foundations & Core Logic Building',
                'Module 2: Advanced Concepts & Object Models',
                'Module 3: Database Integration & Storage',
                'Module 4: Enterprise Web & API Development',
                'Module 5: Real-World Capstone Project & Certification'
              ]).map((mod, idx) => (
                <div key={idx} className="syllabus-item">
                  <CheckSquare size={18} className="syllabus-icon" />
                  <span>{mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Key Features & Student Benefits */}
          <div className="course-detail-card">
            <h3 className="course-detail-heading">What You Get With BDPS</h3>
            <div className="support-pillars-grid support-grid-none">
              <div className="support-pillar-card support-card-light">
                <CheckCircle2 size={20} className="icon-orange" />
                <div>
                  <h5 className="card-heading-dark">100% Practical Labs</h5>
                  <p className="card-desc-dim">Hands-on coding & desktop practice</p>
                </div>
              </div>

              <div className="support-pillar-card support-card-light">
                <CheckCircle2 size={20} className="icon-orange" />
                <div>
                  <h5 className="card-heading-dark">BDPS AI Tutor</h5>
                  <p className="card-desc-dim">24/7 intelligent academic guidance</p>
                </div>
              </div>

              <div className="support-pillar-card support-card-light">
                <CheckCircle2 size={20} className="icon-orange" />
                <div>
                  <h5 className="card-heading-dark">Placement Support</h5>
                  <p className="card-desc-dim">Resume crafting & direct job referrals</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Course Registration Form */}
        <aside className="course-detail-sidebar">
          <div className="course-enroll-card">
            <h3 className="course-enroll-title">
              <BookOpen size={20} className="icon-orange" /> Register for this Course
            </h3>
            <p className="course-enroll-subtitle">
              Fill in your details below to lock your seat & request free course counseling.
            </p>

            {submitted ? (
              <div className="form-success-banner">
                <CheckCircle2 size={36} className="success-icon" />
                <h4 className="success-title">Registration Submitted!</h4>
                <p className="success-desc">
                  Thank you, <strong>{formData.fullName}</strong>. Our academic counselor will call you within 2 hours to confirm your seat for <strong>{course.title}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-block-column">
                {errorMessage && (
                  <div className="form-error-alert">
                    {errorMessage}
                  </div>
                )}

                <div className="form-group-block">
                  <label className="form-label-text">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="form-input-box"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label-text">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input-box"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label-text">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input-box"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label-text">Educational Qualification</label>
                  <select
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="form-input-box"
                  >
                    <option value="Intermediate / 10+2">Intermediate / 10+2</option>
                    <option value="Degree (B.Sc / B.Com / B.A)">Degree (B.Sc / B.Com / B.A)</option>
                    <option value="B.Tech / M.Tech">B.Tech / M.Tech</option>
                    <option value="Post Graduate (MCA / M.Sc)">Post Graduate (MCA / M.Sc)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group-block">
                  <label className="form-label-text">Preferred Batch Timing</label>
                  <select
                    value={formData.preferredBatch}
                    onChange={(e) => setFormData({ ...formData, preferredBatch: e.target.value })}
                    className="form-input-box"
                  >
                    <option value="Morning (9 AM - 11 AM)">Morning (9 AM - 11 AM)</option>
                    <option value="Afternoon (2 PM - 4 PM)">Afternoon (2 PM - 4 PM)</option>
                    <option value="Evening (5 PM - 7 PM)">Evening (5 PM - 7 PM)</option>
                    <option value="Weekend Batch">Weekend Batch</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-enroll-submit"
                >
                  {submitting ? 'Submitting Registration...' : 'Enroll / Submit Registration'}
                </button>

                <p className="form-lock-subtext">
                  🔒 Your details are securely sent to BDPS admissions desk.
                </p>
              </form>
            )}
          </div>
        </aside>
      </main>

      <VisitorFooter />
    </div>
  );
}
