'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Star, Clock, User, Share2, ArrowRight, CheckCircle2, 
  Award, ShieldCheck, ChevronLeft, ChevronRight,
  TrendingUp, Code, Cloud, Database, ShieldAlert, Cpu, X, Bot, Sparkles, Briefcase, FileText, Target, Compass, HeartHandshake, Layers
} from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';
import RatingStars from '@/components/RatingStars';
import BDPSLoadingScreen from '@/components/BDPSLoadingScreen';
import CourseCard from '@/components/CourseCard';

const DEFAULT_HERO_SLIDES = [
  {
    title: 'Post Graduate Diploma in Computer Applications',
    subtitle: 'Professional PGDCA Certification',
    desc: 'Comprehensive 1-year graduate diploma program covering office software, database systems, and foundational IT concepts.',
    image: 'https://picsum.photos/seed/course-pgdca/800/600',
    buttonText: 'Explore Courses',
    buttonLink: '/courses',
    secondaryButtonText: 'Get Counseling',
    secondaryButtonLink: '/contact',
    backgroundPreset: 'linear-gradient(135deg, #BD601C 0%, #7A3700 100%)'
  },
  {
    title: 'Core Java & Software Programming',
    subtitle: 'Object-Oriented Development',
    desc: 'Master object-oriented coding, collections framework, multi-threading, JDBC, and SQL databases with hands-on practice.',
    image: 'https://picsum.photos/seed/course-java/800/600',
    buttonText: 'Explore Courses',
    buttonLink: '/courses',
    secondaryButtonText: 'Get Counseling',
    secondaryButtonLink: '/contact',
    backgroundPreset: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)'
  },
  {
    title: 'Tally Prime & Financial Accounting',
    subtitle: 'GST & Commercial Bookkeeping',
    desc: 'Master commercial accounting, taxation (GST, TDS), payroll management, and generate professional balance sheets.',
    image: 'https://picsum.photos/seed/course-tally/800/600',
    buttonText: 'Explore Courses',
    buttonLink: '/courses',
    secondaryButtonText: 'Get Counseling',
    secondaryButtonLink: '/contact',
    backgroundPreset: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)'
  }
];

const DEFAULT_HOMEPAGE_COURSES = [
  { id: '1', title: 'PGDCA - Post Graduate Diploma in Computer Applications', category: 'Full Stack', duration: '1 Year', instructor: 'Certified Coach', rating: 5.0, reviewsCount: '120+ reviews', fee: '15,000', subtitle: 'Comprehensive 1-year graduate diploma program covering office software & databases.', image: 'https://picsum.photos/seed/course-pgdca/800/600' },
  { id: '2', title: 'Core Java & Software Programming', category: 'Software Programming', duration: '3-4 Months', instructor: 'Senior Java Dev', rating: 5.0, reviewsCount: '150+ reviews', fee: '8,000', subtitle: 'Master object-oriented coding, collections, multi-threading, and JDBC.', image: 'https://picsum.photos/seed/course-java/800/600' },
  { id: '3', title: 'Tally Prime & Commercial Financial Accounting', category: 'Financial Accounting', duration: '3 Months', instructor: 'Chartered Accountant', rating: 5.0, reviewsCount: '90+ reviews', fee: '6,500', subtitle: 'Master commercial accounting, GST taxation, and balance sheet preparation.', image: 'https://picsum.photos/seed/course-tally/800/600' },
  { id: '4', title: 'Python Full Stack & AI Development', category: 'Software Programming', duration: '5 Months', instructor: 'AI Lead Coach', rating: 5.0, reviewsCount: '110+ reviews', fee: '12,000', subtitle: 'Build modern web apps with Django, React, and Python AI model integrations.', image: 'https://picsum.photos/seed/course-python/800/600' },
  { id: '5', title: 'MERN Stack Web Development', category: 'Full Stack', duration: '6 Months', instructor: 'Senior Fullstack Dev', rating: 5.0, reviewsCount: '200+ reviews', fee: '14,000', subtitle: 'Master MongoDB, Express.js, React.js, and Node.js with live real-time projects.', image: 'https://picsum.photos/seed/course-mern/800/600' },
  { id: '6', title: 'Cybersecurity & Ethical Hacking Essentials', category: 'Cybersecurity', duration: '4 Months', instructor: 'Security Analyst', rating: 5.0, reviewsCount: '80+ reviews', fee: '10,000', subtitle: 'Learn network security, vulnerability assessment, penetration testing & defense.', image: 'https://picsum.photos/seed/course-cyber/800/600' }
];

const STUDENT_SUPPORT_PILLARS = [
  { icon: <Briefcase size={22} />, title: 'Internship Programs', desc: 'Real-world workplace experience & stipend exposure.' },
  { icon: <Code size={22} />, title: 'Live Projects', desc: 'Hands-on software application development.' },
  { icon: <FileText size={22} />, title: 'Academic Project Reports', desc: 'Comprehensive review & documentation assistance.' },
  { icon: <Cpu size={22} />, title: 'Final Year Project Guidance', desc: 'IEEE capstone guidance for B.Tech/M.Tech reviews.' },
  { icon: <FileText size={22} />, title: 'Resume Building', desc: 'ATS-friendly professional resume crafting.' },
  { icon: <Target size={22} />, title: 'Interview Preparation', desc: 'Technical testing & mock interview sessions.' },
  { icon: <Award size={22} />, title: 'Placement Assistance', desc: 'Direct job referrals to AP & MNC employer partners.' },
  { icon: <Compass size={22} />, title: 'Career Counseling', desc: '1-on-1 personalized career roadmap guidance.' }
];

const WHY_BDPS_HIGHLIGHTS = [
  "🚀 20+ Years Legacy of IT Excellence",
  "💻 100% Practical Computer Lab Practice",
  "🎓 IEEE Capstone Final Year Project Guidance",
  "💼 Direct Job Referrals to 800+ MNC Partners",
  "🤖 BDPS AI Tutor 24/7 Academic Support",
  "📜 Government Recognized ISO Certifications",
  "💰 Scholarship & Stipend Programs",
  "👨‍🏫 1-on-1 Certified Industry Mentors"
];

const DEFAULT_TESTIMONIALS = [
  {
    name: "Amit Patel",
    courseName: "Core Java & Software Programming",
    quote: "The structural focus on writing clean programs and solving coding problems prepared me for actual interviews. The instructors guided me through every lab assignment.",
    role: "Junior Java Developer",
    company: "Tech Services"
  },
  {
    name: "Neha Kulkarni",
    courseName: "PGDCA Diploma",
    quote: "The PGDCA program is extremely thorough. It covers office automation, spreadsheets, and databases. I gained confidence and transitioned into systems operations.",
    role: "Systems Operator",
    company: "Enterprise Ltd"
  },
  {
    name: "Vikram Sen",
    courseName: "Tally Prime & Financial Accounting",
    quote: "BDPS teaches Tally with real financial books and GST calculations. The lab assistants helped me clear all my accounting doubts immediately.",
    role: "Junior Accountant",
    company: "Finance Corp"
  }
];

export default function VisitorHomepage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [coursesLoaded, setCoursesLoaded] = useState(false);

  const [heroSlides, setHeroSlides] = useState([]);
  const [heroSlidesLoaded, setHeroSlidesLoaded] = useState(false);

  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = DEFAULT_TESTIMONIALS;
  const partners = ["TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "Tech Mahindra", "HCL Tech", "Local IT Solutions", "Business Accounts Firms"];

  // Fetch live courses from Sanity CMS — fall back to defaults only if Sanity returns nothing
  useEffect(() => {
    fetch('/api/courses', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.courses && data.courses.length > 0) {
          setCourses(data.courses);
        } else {
          setCourses(DEFAULT_HOMEPAGE_COURSES);
        }
      })
      .catch(() => setCourses(DEFAULT_HOMEPAGE_COURSES))
      .finally(() => setCoursesLoaded(true));
  }, []);

  // Fetch live hero slides from Sanity CMS — fall back to defaults only if Sanity returns nothing
  useEffect(() => {
    fetch('/api/hero-slides', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.slides && data.slides.length > 0) {
          setHeroSlides(data.slides);
        } else {
          setHeroSlides(DEFAULT_HERO_SLIDES);
        }
      })
      .catch(() => setHeroSlides(DEFAULT_HERO_SLIDES))
      .finally(() => setHeroSlidesLoaded(true));
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const categoriesList = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];

  const filteredExploreCourses = (selectedCategoryTab === 'All'
    ? courses
    : courses.filter(c => c.category && c.category.toLowerCase().includes(selectedCategoryTab.toLowerCase()))
  ).slice(0, 6);

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const getSlideBackground = (slide, idx) => {
    if (slide.bgImage) {
      return `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.55)), url('${slide.bgImage}') center/cover no-repeat`;
    }
    if (slide.backgroundPreset === 'custom' && slide.customBackground) {
      return slide.customBackground;
    }
    if (slide.backgroundPreset && slide.backgroundPreset !== 'custom') {
      return slide.backgroundPreset;
    }
    const defaultGradients = [
      'linear-gradient(135deg, #BD601C 0%, #7A3700 100%)',
      'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
      'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)'
    ];
    return defaultGradients[idx % defaultGradients.length];
  };

  // Full Screen Loading Screen until Sanity CMS data resolves
  if (!coursesLoaded || !heroSlidesLoaded) {
    return <BDPSLoadingScreen />;
  }

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Section 1: Hero Carousel Section */}
      <section className="hero-section">
        <AnimatePresence mode="wait">
          {heroSlides.map((slide, idx) => idx === activeSlide && (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-slide"
              style={{ background: getSlideBackground(slide, idx) }}
            >
              <div className="hero-grid">
                <div className="hero-text-content">
                  <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="hero-subtitle"
                  >
                    {slide.subtitle || 'BDPS COMPUTER EDUCATION'}
                  </motion.span>
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="hero-title"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="hero-desc"
                  >
                    {slide.desc}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="hero-actions"
                  >
                    <Link href={slide.buttonLink || '/courses'} className="btn-explore">
                      {slide.buttonText || 'Explore Courses'}
                    </Link>
                    <Link href={slide.secondaryButtonLink || '/contact'} className="btn-counseling">
                      {slide.secondaryButtonText || 'Get Counseling'}
                    </Link>
                  </motion.div>
                </div>

                <div className="hero-img-container">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="hero-img-card"
                  >
                    <img src={slide.image || 'https://picsum.photos/seed/bdps/800/600'} alt={slide.title} className="hero-img" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="hero-dots-container">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`hero-dot-btn ${idx === activeSlide ? 'hero-dot-active' : 'hero-dot-inactive'}`}
            />
          ))}
        </div>

        {/* Navigation Controls */}
        <button
          onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="hero-nav-prev"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
          className="hero-nav-next"
        >
          <ChevronRight size={22} />
        </button>
      </section>

      {/* Section 2: Featured Courses Overlap Cards */}
      {courses.length > 0 && (
      <section className="hero-courses-overlap">
        <div className="course-grid-laptop-4">
          {courses.slice(0, 4).map((course) => (
            <CourseCard key={`hero-${course.id || course._id}`} course={course} />
          ))}
        </div>
      </section>
      )}

      {/* Section 3: Continuous Partner Marquee Slider */}
      <section className="marquee-section">
        <div className="marquee-header">
          <span className="marquee-tag">
            🤝 Our Graduates Work at Leading Global & National Brands
          </span>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {[...partners, ...partners, ...partners, ...partners].map((partner, idx) => (
              <div key={idx} className="marquee-item">
                <span>{partner}</span>
                <span className="marquee-bullet">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: 20+ Years of Academic Excellence & BDPS AI Tutor */}
      <section className="about-section">
        <div className="about-grid">
          <div>
            <div className="about-badge-header">
              <Award size={16} /> 20+ Years of Academic Excellence
            </div>
            <h2 className="about-heading">
              BDPS Computer Education <span className="about-heading-accent">📍 Kakinada, AP</span>
            </h2>
            <p className="about-paragraph">
              BDPS Computer Education is one of Andhra Pradesh's most trusted and experienced computer training institutes, with over 20 years of dedication to technical skill development and digital literacy.
            </p>
            <p className="about-paragraph">
              Over the past two decades, we have educated thousands of students who are now working in Government Departments, IT Companies, Healthcare, MNCs, Private Organizations, and successful Businesses across India and abroad.
            </p>

            <div className="csr-badge">
              <HeartHandshake size={32} className="contact-icon" />
              <div>
                <h4 className="csr-title">
                  CSR Initiative Collaboration
                </h4>
                <p className="csr-desc">
                  BDPS proudly collaborates with <strong>Embracing Humanity Foundation (EHF)</strong> to implement CSR skill development, digital literacy, and youth employment training.
                </p>
              </div>
            </div>
          </div>

          <div className="ai-tutor-card">
            <Bot size={180} className="ai-tutor-bg-icon" />

            <div className="ai-tutor-badge">
              <Sparkles size={14} /> Next-Gen AI Learning
            </div>

            <h3 className="ai-tutor-title">
              Meet BDPS AI Tutor 🤖
            </h3>
            <p className="ai-tutor-desc">
              As technology advances into the future, BDPS introduces <strong>BDPS AI Tutor</strong>—an intelligent AI learning assistant providing personalized learning, smart coding guidance, practice support, and 24/7 academic help.
            </p>

            <div className="ai-tutor-list">
              <div className="ai-tutor-item">
                <CheckCircle2 size={16} className="contact-icon" /> 24/7 Academic & Coding Assistance
              </div>
              <div className="ai-tutor-item">
                <CheckCircle2 size={16} className="contact-icon" /> Personalized Speed & Skill Guidance
              </div>
              <div className="ai-tutor-item">
                <CheckCircle2 size={16} className="contact-icon" /> Practice Problem Diagnostics
              </div>
            </div>

            <Link href="/contact?type=student" className="btn-ai-tutor">
              Try AI-Enabled Learning <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Explore Our Courses (Category Tabs Selector & Grid up to 6 courses) */}
      {courses.length > 0 && (
      <section id="courses-section" className="explore-courses-section">
        <div className="section-header-center">
          <h2 className="section-title">
            Explore Our <span className="section-title-accent">Courses</span>
          </h2>
          <p className="about-paragraph">
            Choose from our job-oriented software, AI, accounting, and technical tracks.
          </p>
        </div>

        {/* Category Tabs Selector */}
        <div className="category-tabs-row">
          {categoriesList.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategoryTab(cat)}
              className={`category-tab-btn ${selectedCategoryTab === cat ? 'category-tab-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid - Up to 6 Courses */}
        <div className="explore-courses-grid">
          {filteredExploreCourses.map((course) => (
            <CourseCard key={`tab-${course.id || course._id}`} course={course} showSubtitle={true} />
          ))}
        </div>

        {/* See More Courses Button */}
        <div className="explore-see-more-row">
          <Link href="/courses" className="btn-see-more-courses">
            See More Courses ({courses.length}+ Available) <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      )}

      {/* Section 6: Student Support System 8 Pillars Banner */}
      <section className="support-section">
        <div className="support-banner-card">
          <Award size={260} className="support-watermark" />

          <div className="support-header-box">
            <div className="support-tag">
              <Sparkles size={14} /> 360° Career & Academic Assistance
            </div>

            <h2 className="support-heading">
              🎯 Complete Student Support System
            </h2>
            <p className="support-desc">
              From real-world workplace internships and IEEE capstone projects to ATS resume building and 1-on-1 career counseling, we empower every learner end-to-end.
            </p>
          </div>

          <div className="support-pillars-grid">
            {STUDENT_SUPPORT_PILLARS.map((pillar, idx) => (
              <div key={idx} className="support-pillar-card">
                <div className="support-icon-box">
                  {pillar.icon}
                </div>
                <div>
                  <h4 className="support-pillar-title">
                    {pillar.title}
                  </h4>
                  <p className="support-pillar-desc">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="support-bottom-bar">
            <div className="support-bottom-text">
              <ShieldCheck size={18} className="icon-orange" />
              <span>Ready to boost your computing & career skills?</span>
            </div>
            <Link href="/contact" className="btn-support-counseling">
              Request Free Career Counseling <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6.5: Why Choose BDPS Continuous Marquee Track */}
      <section className="marquee-section marquee-section-why">
        <div className="marquee-header">
          <span className="marquee-tag">
            🌟 Why Choose BDPS Computer Education?
          </span>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {[...WHY_BDPS_HIGHLIGHTS, ...WHY_BDPS_HIGHLIGHTS, ...WHY_BDPS_HIGHLIGHTS, ...WHY_BDPS_HIGHLIGHTS].map((item, idx) => (
              <div key={idx} className="marquee-item">
                <span>{item}</span>
                <span className="marquee-bullet">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Student Testimonials (Manual Control Slider) */}
      <section className="testimonials-section">
        <div className="section-header-center">
          <span className="section-subtitle-tag">STUDENT SUCCESS STORIES</span>
          <h2 className="section-title">
            What Our Students <span className="section-title-accent">Say</span>
          </h2>
        </div>

        <div className="testimonials-card">
          <p className="testimonial-quote">
            "{testimonials[activeTestimonial].quote}"
          </p>

          <div>
            <h4 className="testimonial-author">
              {testimonials[activeTestimonial].name}
            </h4>
            <span className="testimonial-role">
              {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company} ({testimonials[activeTestimonial].courseName})
            </span>
          </div>

          <div className="testimonial-nav-controls">
            <button onClick={handlePrevTestimonial} className="btn-testimonial-nav" aria-label="Previous Testimonial">
              <ChevronLeft size={20} />
            </button>

            <div className="testimonial-dots-row">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`testimonial-dot ${idx === activeTestimonial ? 'testimonial-dot-active' : 'testimonial-dot-inactive'}`}
                />
              ))}
            </div>

            <button onClick={handleNextTestimonial} className="btn-testimonial-nav" aria-label="Next Testimonial">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <VisitorFooter />
    </div>
  );
}
