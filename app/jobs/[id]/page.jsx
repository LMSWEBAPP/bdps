'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Building2, MapPin, Calendar, IndianRupee, 
  ArrowLeft, ExternalLink, CheckCircle2, ShieldCheck, 
  Clock, Award, Layers, Sparkles, Share2, Check
} from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';
import JobLeadModal from '@/components/forms/JobLeadModal';

export default function JobDetailPage({ params }) {
  const jobId = params?.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const syncAppliedJobsFromStorage = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('bdps_applied_job_ids') || '[]');
        setAppliedJobIds(saved);
      } catch (e) {}
    }
  };

  useEffect(() => {
    syncAppliedJobsFromStorage();
  }, []);

  useEffect(() => {
    if (!jobId) return;

    setLoading(true);
    setError('');

    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.job) {
          setJob(data.job);
        } else {
          setError(data.message || 'Job opening not found or has expired.');
        }
      })
      .catch((err) => {
        console.error('Error loading job details:', err);
        setError('Unable to load job details. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'As per Industry Standards';
    const formatNum = (num) => (num >= 100000 ? `₹${(num / 100000).toFixed(1)} LPA` : `₹${num.toLocaleString('en-IN')}`);
    if (min && max) return `${formatNum(min)} - ${formatNum(max)}`;
    if (min) return `From ${formatNum(min)}`;
    return `Up to ${formatNum(max)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const hasRedirectUrl = Boolean(
    job?.redirectUrl &&
    typeof job.redirectUrl === 'string' &&
    job.redirectUrl.trim() !== '' &&
    job.redirectUrl !== 'null' &&
    job.redirectUrl !== 'undefined'
  );

  const isApplied = Boolean(
    job && (appliedJobIds.includes(job._id) || (job.adzunaId && appliedJobIds.includes(job.adzunaId)))
  );

  const handleShare = async () => {
    if (!job) return;
    const fullUrl = typeof window !== 'undefined' ? window.location.href : `/jobs/${job._id}`;
    const shareData = {
      title: `${job.title} at ${job.company || 'BDPS Partner'}`,
      text: `Check out this job opening for ${job.title} at ${job.company || 'BDPS Computer Education'}!`,
      url: fullUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy job URL:', err);
      }
    }
  };

  const handleApplyClick = () => {
    if (typeof window !== 'undefined' && job) {
      if (hasRedirectUrl && isApplied) {
        window.open(job.redirectUrl, '_blank', 'noopener,noreferrer');
      } else {
        setJobModalOpen(true);
      }
    }
  };

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Hero Header Banner */}
      <section className="courses-banner-header">
        <div className="courses-banner-container">
          <div className="course-detail-header-top">
            <Link href="/jobs" className="btn-back-link" title="Back to All Job Openings">
              <ArrowLeft size={16} className="btn-back-icon" /> <span className="btn-back-text">Back to All Job Openings</span>
            </Link>
            {job?.category && (
              <div className="course-badge-inline">
                {job.category}
              </div>
            )}
          </div>

          {loading ? (
            <h1 className="courses-banner-title">Loading Job Details...</h1>
          ) : error ? (
            <h1 className="courses-banner-title">Job Opening Not Found</h1>
          ) : (
            <>
              <h1 className="courses-banner-title">{job.title}</h1>
              <p className="courses-banner-desc" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} style={{ color: '#FF7518' }} /> {job.company || 'Direct Employer'}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} style={{ color: '#FF7518' }} /> {job.location || 'India'}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} style={{ color: '#FF7518' }} /> Posted {formatDate(job.postedAt)}
                </span>
              </p>
            </>
          )}
        </div>
      </section>

      {/* Main Content Container */}
      <main className="catalog-container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
        {loading ? (
          <div className="section-header-center" style={{ padding: '80px 0' }}>
            <div className="logo-badge">Loading Job Information...</div>
          </div>
        ) : error ? (
          <div className="catalog-empty-card" style={{ maxWidth: '600px', margin: '40px auto' }}>
            <Briefcase size={48} className="icon-orange" />
            <h3 className="bento-card-title">{error}</h3>
            <p className="about-paragraph">The job opening you are looking for may have expired or been updated.</p>
            <Link href="/jobs" className="btn-explore" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Browse All Jobs
            </Link>
          </div>
        ) : (
          <div className="course-detail-container" style={{ gridTemplateColumns: '1fr 340px' }}>
            {/* Left Column: Job Overview & Requirements */}
            <section className="course-detail-main">
              {/* Card 1: Job Description */}
              <div className="course-detail-card">
                <h3 className="course-detail-heading">Role Overview & Description</h3>
                <div 
                  className="course-detail-text" 
                  style={{ whiteSpace: 'pre-line', lineHeight: '1.7', fontSize: '15px' }}
                >
                  {job.description || 'Detailed role information available upon application.'}
                </div>

                <div className="course-meta-divider course-meta-bottom" style={{ marginTop: '24px' }}>
                  <div className="course-meta-item">
                    <IndianRupee size={16} className="course-meta-icon" />
                    <span><strong>Salary Range:</strong> {formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>
                  <div className="course-meta-item">
                    <Clock size={16} className="course-meta-icon" />
                    <span><strong>Job Type:</strong> {job.jobType || 'Full Time'}</span>
                  </div>
                  <div className="course-meta-item">
                    <Award size={16} className="course-meta-icon" />
                    <span><strong>Experience:</strong> {job.experienceRequired || 'As per role standard'}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Responsibilities (if present) */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="course-detail-card">
                  <h3 className="course-detail-heading">Key Responsibilities</h3>
                  <div className="syllabus-list">
                    {job.responsibilities.map((resp, idx) => (
                      <div key={idx} className="syllabus-item">
                        <CheckCircle2 size={18} className="syllabus-icon" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card 3: Requirements (if present) */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="course-detail-card">
                  <h3 className="course-detail-heading">Requirements & Qualifications</h3>
                  <div className="syllabus-list">
                    {job.requirements.map((reqItem, idx) => (
                      <div key={idx} className="syllabus-item">
                        <CheckCircle2 size={18} className="syllabus-icon" />
                        <span>{reqItem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card 4: Required Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="course-detail-card">
                  <h3 className="course-detail-heading">Key Skills & Keywords</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {job.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        style={{
                          backgroundColor: '#F1F5F9',
                          color: '#0F172A',
                          border: '1px solid #CBD5E1',
                          borderRadius: '20px',
                          padding: '6px 14px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        #{skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Right Sidebar: Apply Action Card */}
            <aside className="course-detail-sidebar">
              <div className="course-enroll-card" style={{ position: 'sticky', top: '100px' }}>
                <h3 className="course-enroll-title" style={{ fontSize: '18px' }}>
                  <Briefcase size={20} className="icon-orange" /> Apply for Position
                </h3>
                <p className="course-enroll-subtitle" style={{ marginBottom: '20px' }}>
                  Submit your application to get direct placement support from BDPS.
                </p>

                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '16px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Target Role:</div>
                  <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '15px' }}>{job.title}</div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>{job.company || 'Direct Employer'}</div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="btn-enroll-submit"
                  disabled={isApplied && !hasRedirectUrl}
                  style={isApplied && !hasRedirectUrl ? { opacity: 0.7, cursor: 'not-allowed', backgroundColor: '#1e293b' } : {}}
                >
                  {isApplied && !hasRedirectUrl ? (
                    'Application Submitted ✓'
                  ) : hasRedirectUrl ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {isApplied ? 'Visit Official Portal' : 'Apply Now'} <ExternalLink size={16} />
                    </span>
                  ) : (
                    'Apply Now'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className={`btn-share-job-text ${copied ? 'copied' : ''}`}
                  style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
                  title={copied ? 'Link Copied!' : 'Share Job Opening'}
                >
                  {copied ? <Check size={16} /> : <Share2 size={16} />}
                  <span>{copied ? 'Link Copied!' : 'Share Job Opening'}</span>
                  {copied && <span className="share-toast-pop">Copied!</span>}
                </button>

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B' }}>
                  <ShieldCheck size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
                  <span>Verified BDPS Partner Opportunity</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <VisitorFooter />

      <JobLeadModal
        job={job}
        isOpen={jobModalOpen}
        onClose={() => {
          setJobModalOpen(false);
          syncAppliedJobsFromStorage();
        }}
        onSuccess={(redirectUrl) => {
          setJobModalOpen(false);
          syncAppliedJobsFromStorage();
          if (typeof window !== 'undefined' && redirectUrl) {
            window.open(redirectUrl, '_blank', 'noopener,noreferrer');
          }
        }}
      />
    </div>
  );
}
