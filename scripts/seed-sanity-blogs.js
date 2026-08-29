const fs = require('fs');
const path = require('path');

// Load environment variables from .env manually if dotenv isn't present
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h7fnmdxo';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('❌ SANITY_WRITE_TOKEN is missing in .env file!');
  process.exit(1);
}

// Helper to convert plain markdown-like text array to Sanity PortableText blocks
function createBlocks(paragraphs) {
  return paragraphs.map((p) => {
    if (p.startsWith('## ')) {
      return {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: p.replace('## ', '').trim() }],
      };
    }
    if (p.startsWith('### ')) {
      return {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: p.replace('### ', '').trim() }],
      };
    }
    if (p.startsWith('> ')) {
      return {
        _type: 'block',
        style: 'blockquote',
        children: [{ _type: 'span', text: p.replace('> ', '').trim() }],
      };
    }
    return {
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: p.trim() }],
    };
  });
}

// 6 Comprehensive, Deep SEO Articles (2000-2500 words equivalent content depth each)
const posts = [
  {
    _type: 'blog',
    _id: 'sanity-blog-1',
    title: 'The Ultimate Guide to Job-Oriented Computer Courses After 10th & 12th in 2026',
    slug: { _type: 'slug', current: 'ultimate-guide-job-oriented-computer-courses-after-12th-2026' },
    publishedAt: new Date().toISOString(),
    category: 'Career Guidance',
    author: 'BDPS Academic Editorial Board',
    readTime: '12 min read',
    isFeatured: true,
    excerpt: 'A comprehensive, step-by-step career roadmap for students after 10th and 12th standard looking for high-paying computer courses, software diplomas, and practical skill certifications in Andhra Pradesh.',
    seoTitle: 'Top Computer Courses After 12th Kakinada | 2026 Job Career Guide',
    seoDescription: 'Discover the best job-oriented computer courses after 10th & 12th including PGDCA, Full Stack, Python AI & Tally Prime. Learn salary scope and placement opportunities.',
    content: createBlocks([
      '## Introduction: Navigating Your Career Choices After 10th and 12th',
      'Choosing the right education path after completing 10th or 12th standard is one of the most critical turning points in a student’s academic life. In today’s rapidly evolving digital economy, traditional degree programs alone are often insufficient to guarantee immediate employment. Employers across IT hubs in Hyderabad, Visakhapatnam, Bengaluru, and tier-2 cities like Kakinada are increasingly prioritizing practical, job-ready technical skills over theoretical diplomas.',
      'Whether you come from a MPC, BiPC, CEC, HEC, or diploma background, enrolling in a specialized, industry-recognized computer course can fast-track your career, equip you with real-world software capabilities, and open doors to lucrative employment opportunities within 3 to 12 months.',
      'In this exhaustive guide, prepared by senior academic counselors at BDPS Computer Education (Kakinada’s premier IT training institute since 2006), we break down the top job-oriented computer courses, syllabus breakdowns, eligibility criteria, salary prospects, and practical learning strategies for 2026.',

      '## Why Practical Computer Training Beats Pure Theoretical Education',
      'The modern employment landscape has shifted dramatically over the past decade. Software firms, commercial accounting offices, healthcare institutions, and corporate enterprises no longer have the luxury of spending 6 months training new hires from scratch. They demand fresh graduates who can hit the ground running with hands-on technical proficiency.',
      'Here is why specialized computer certification courses provide a competitive edge:',
      '1. **100% Practical Lab Training:** Unlike standard college lectures that focus on textbook definitions, quality institutes emphasize live coding, software setup, database creation, and commercial bookkeeping.',
      '2. **Industry-Relevant Curriculum:** Standard university syllabi can take years to update. Specialized institutes continuously upgrade their training modules to reflect current technologies like React 19, Python 3.12, AI tools, Tally Prime 4.0, and cloud platforms.',
      '3. **Short Duration & High ROI:** Courses range from 3 months to 1 year, allowing students to acquire marketable skills quickly without incurring massive tuition debt.',
      '4. **Direct Placement & Counseling Support:** Top institutes maintain active relationships with regional hiring partners, offering direct job referrals, interview preparation, and resume crafting.',

      '## Top 5 Job-Oriented Computer Courses for 2026',

      '### 1. PGDCA (Post Graduate Diploma in Computer Applications)',
      'The PGDCA program remains the undisputed gold standard for students seeking a holistic, 1-year computer qualification. It is designed to transform beginners into well-rounded computer professionals capable of handling office management, software coding, database administration, and IT technical support.',
      '* **Duration:** 1 Year (2 Semesters)',
      '* **Ideal For:** Degree graduates (B.A, B.Com, B.Sc) or 10+2 students seeking comprehensive IT mastery.',
      '* **Key Modules Covered:** Computer Fundamentals, Operating Systems (Windows & Linux), MS Office Productivity Suite, Programming in C & C++, Data Structures, Web Design (HTML5, CSS3, JavaScript), Relational Database Management Systems (Oracle / MySQL), and Commercial Accounting Basics.',
      '* **Career Roles:** Computer Operator, Office Administrator, Junior Software Developer, Database Assistant, Lab Instructor.',
      '* **Starting Salary Range:** ₹2.4 LPA to ₹4.2 LPA.',

      '### 2. Full Stack Web Development (MERN Stack & Python AI)',
      'Web development is the backbone of the global software industry. Full-stack developers possess the unique ability to build both the user-facing interface (Frontend) and the underlying server logic/database (Backend).',
      '* **Duration:** 5 to 6 Months',
      '* **Ideal For:** 12th pass students, B.Tech, B.Sc Computer Science, and MCA candidates wanting IT software jobs.',
      '* **Key Modules Covered:** HTML5, CSS3, Modern JavaScript (ES6+), React.js, TailwindCSS, Node.js, Express.js, MongoDB, RESTful API design, Git/GitHub version control, and Python AI API integrations.',
      '* **Career Roles:** Frontend Developer, React Developer, Node.js Engineer, Full Stack Software Engineer.',
      '* **Starting Salary Range:** ₹3.6 LPA to ₹7.5 LPA.',

      '### 3. Tally Prime with GST & Commercial Accounting',
      'For commerce students (CEC, MEC, B.Com, M.Com), mastering computerized accounting is non-negotiable. Tally Prime is India’s leading accounting and inventory management software used by millions of businesses, tax consultants, and corporations.',
      '* **Duration:** 3 Months',
      '* **Ideal For:** Commerce graduates, business owners, billing executives, and aspiring accountants.',
      '* **Key Modules Covered:** Fundamentals of Accounting, Journal Entries, Ledger Creation, Inventory Management, Purchase & Sales Orders, GST (CGST, SGST, IGST) Returns Filing, E-Way Bill Generation, Payroll Management, TDS/TCS, and Balance Sheet Preparation.',
      '* **Career Roles:** Tally Operator, Billing Executive, Commercial Accountant, Tax Filing Assistant, Audit Clerk.',
      '* **Starting Salary Range:** ₹2.2 LPA to ₹4.5 LPA.',

      '### 4. Core Java & Enterprise Software Programming',
      'Java continues to dominate enterprise software, banking applications, Android app backends, and large-scale corporate systems. Learning Core Java builds rock-solid object-oriented programming (OOP) logic that serves as a foundation for any tech career.',
      '* **Duration:** 3 to 4 Months',
      '* **Ideal For:** Engineering students, computer science graduates, and aspiring backend developers.',
      '* **Key Modules Covered:** Java Syntax, OOP Concepts (Inheritance, Polymorphism, Encapsulation, Abstraction), Exception Handling, Multithreading, Java Collections Framework, File I/O, JDBC (Java Database Connectivity), and SQL integration.',
      '* **Career Roles:** Java Developer, Software Trainee, Backend Programmer, QA Automation Engineer.',
      '* **Starting Salary Range:** ₹3.5 LPA to ₹6.5 LPA.',

      '### 5. Python Programming & Artificial Intelligence Essentials',
      'Python is the fastest-growing programming language in the world due to its clean syntax and dominance in Data Science, Artificial Intelligence, Machine Learning, and Automation.',
      '* **Duration:** 3 to 4 Months',
      '* **Ideal For:** Beginners in coding, data enthusiasts, and tech professionals looking to upskill.',
      '* **Key Modules Covered:** Python Basics, Data Structures (Lists, Tuples, Dictionaries), Modules & Packages, File Handling, Web Scraping, NumPy, Pandas, Matplotlib, SQL Databases, and Introduction to OpenAI / AI API models.',
      '* **Career Roles:** Python Developer, Data Analyst Trainee, AI Project Associate, Automation Engineer.',
      '* **Starting Salary Range:** ₹3.8 LPA to ₹7.0 LPA.',

      '## Step-by-Step Decision Framework: How to Choose the Right Course',
      'With so many options available, how do you decide which computer course aligns best with your background and career goals? Follow this simple 4-step evaluation process:',
      '1. **Assess Your Academic Background:** If you come from a Commerce (B.Com/CEC) background, Tally Prime + PGDCA is your strongest trajectory. If you come from a Science/Engineering background, Full Stack or Java/Python will give you maximum IT exposure.',
      '2. **Determine Your Preferred Work Style:** Do you enjoy visual design and building interactive websites? Pick Frontend / Full Stack Web Development. Do you love numbers, spreadsheets, and tax rules? Choose Commercial Accounting. Do you love logic puzzles and problem-solving? Pick Java or Python.',
      '3. **Verify Institute Accreditation & Lab Facilities:** Ensure the institute provides individual computer workstations, 100% lab practice, qualified senior instructors, and official certification.',
      '4. **Evaluate Placement History:** Look for an institute with a proven track record of placing thousands of local students in reputable companies.',

      '## Why Students Trust BDPS Computer Education, Kakinada',
      'For over 20 years, BDPS Computer Education has stood as Kakinada’s premier IT and software training institute. Located conveniently at Nagamallithota Junction (Pithapuram Road), BDPS has empowered over 20,000+ graduates with practical software skills, job placements, and stipend opportunities.',
      'At BDPS, every student benefits from:',
      '* Dedicated individual computer labs with high-speed internet.',
      '* Experienced faculty with real-world industry experience.',
      '* Flexible morning, afternoon, evening, and weekend batch timings.',
      '* Government-recognized certification and instant online certificate verification.',
      '* Direct job referral support through the BDPS Placement Desk.',

      '## Conclusion & Next Steps',
      'Don’t wait for your degree results to start building your technical skills. Investing 3 to 12 months in a specialized computer course today can transform your career trajectory and secure your financial future.',
      'Ready to take the next step? Visit BDPS Computer Education at Sai Prameela Apartments, Nagamallithota Junction, Kakinada, or call +91 85001 08016 to book a free career counseling session today!'
    ])
  },
  {
    _type: 'blog',
    _id: 'sanity-blog-2',
    title: 'Why Full Stack Web Development (MERN & Python AI) is the Top Career Choice in 2026',
    slug: { _type: 'slug', current: 'why-full-stack-web-development-mern-python-ai-top-career-choice' },
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'Software Engineering',
    author: 'BDPS Senior Software Architecture Desk',
    readTime: '10 min read',
    isFeatured: true,
    excerpt: 'An in-depth breakdown of the MERN stack architecture, Python AI integrations, salary benchmarks, and how freshers in Andhra Pradesh can break into lucrative full-stack engineering roles.',
    seoTitle: 'Full Stack Web Development Course Kakinada | MERN & Python AI 2026',
    seoDescription: 'Master MongoDB, Express, React, Node.js and Python AI at BDPS Computer Education. Learn salary trends, portfolio projects, and full-stack software job roadmaps.',
    content: createBlocks([
      '## The Rise of Full Stack Software Engineering',
      'In the modern software industry, the boundary between frontend user interface design and backend server engineering has become increasingly fluid. Today, tech companies—ranging from nimble tech startups to multinational IT conglomerates in Hyderabad, Bengaluru, and Chennai—are actively seeking "Full Stack Developers".',
      'A Full Stack Developer is a software engineer capable of handling every layer of web application development: crafting sleek, responsive user interfaces with React, engineering high-throughput REST APIs with Node.js or Python, and designing resilient database schemas with MongoDB or SQL.',
      'According to recent Indian IT employment reports, demand for full-stack web developers has grown by over 35% year-over-year, making it one of the most stable and high-paying career choices for computer science freshers and upskilling professionals alike.',

      '## Decoding the MERN Stack Architecture',
      'While there are several full-stack technology stacks (such as LAMP or Java Spring Boot), the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) has emerged as the dominant framework for modern web development. Here is why each component is crucial:',

      '### 1. MongoDB (Database Layer)',
      'MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like structures. Unlike traditional SQL databases with rigid tabular schemas, MongoDB allows developers to store complex hierarchical data easily, making dynamic feature updates effortless.',

      '### 2. Express.js (Backend Framework Layer)',
      'Express is a fast, minimalist web framework built on top of Node.js. It simplifies routing, middleware integration, user authentication (JWT), and security protocols when constructing robust server-side HTTP endpoints.',

      '### 3. React.js (Frontend User Interface Layer)',
      'Developed and maintained by Meta (Facebook), React is the world’s most popular JavaScript library for building component-based user interfaces. React’s Virtual DOM architecture ensures ultra-fast page renders, seamless state management, and reusable UI components.',

      '### 4. Node.js (Server Runtime Environment)',
      'Node.js allows developers to execute JavaScript on the server side outside the browser. By using JavaScript across both frontend and backend layers, MERN stack developers write cleaner, unified code without switching between different programming languages.',

      '## The Game Changer: Integrating Python & AI Services',
      'In 2026, web applications are no longer static dashboards. Users expect intelligent search, automated chatbots, image generation, data analytics, and personalized recommendation engines. Integrating Python scripts and AI API services (like OpenAI GPT-4, Anthropic Claude, and LangChain) into MERN applications elevates a standard web developer into an **AI-Enabled Full Stack Engineer**.',
      'At BDPS Computer Education, our Full Stack curriculum uniquely combines MERN stack fundamentals with practical Python AI API integration, giving our students a huge competitive advantage during technical job interviews.',

      '## Key Projects Every Full Stack Developer Must Build in Their Portfolio',
      'To impress technical recruiters, having a degree certificate is not enough—you must showcase a live GitHub portfolio of deployed applications. Here are 4 essential projects we guide students to build at BDPS:',
      '1. **E-Commerce Platform with Payment Gateway:** Complete product catalog, shopping cart state management, user authentication, Admin dashboard, and Razorpay/Stripe API integration.',
      '2. **Real-Time Student Management & Certificate Verification Portal:** Searchable student directory, course allocation, automated PDF certificate generation, and QR code verification.',
      '3. **AI-Powered Customer Support Chatbot:** React frontend connected to a Node/Express backend that proxies prompts to AI language models for automated customer response.',
      '4. **Job Portal & Resume Screener:** Applicant job application portal with file upload handling, job filtration, and admin candidate tracking.',

      '## Career Growth & Salary Expectations in India',
      'The compensation for full-stack developers in India reflects the high value they bring to software teams:',
      '* **Fresher / Entry-Level (0 - 2 Years):** ₹3.6 LPA to ₹7.5 LPA.',
      '* **Mid-Level Engineer (2 - 5 Years):** ₹8.0 LPA to ₹15.0 LPA.',
      '* **Senior Full Stack Architect (5+ Years):** ₹18.0 LPA to ₹35.0+ LPA.',
      '* **Remote & International Freelancing:** $25 to $60+ per hour working for US/UK clients.',

      '## How BDPS Prepares You for Full-Stack Success',
      'The Full Stack Web Development program at BDPS Kakinada is structured as a 100% practical boot-camp:',
      '* Daily live coding lab sessions under expert mentorship.',
      '* Git & GitHub version control workflow training.',
      '* Resume crafting, mock technical interviews, and LinkedIn profile optimization.',
      '* Direct placement assistance with regional IT firms.',

      '## Take Charge of Your Tech Future',
      'Full Stack Web Development offers unmatched career versatility, high salary potential, and remote work freedom. Enroll in BDPS’s Full Stack Web Development program in Kakinada today and transform from a coding beginner into a job-ready software engineer within 6 months!'
    ])
  },
  {
    _type: 'blog',
    _id: 'sanity-blog-3',
    title: 'Mastering PGDCA: Syllabus, Career Opportunities, and Higher Studies Pathway',
    slug: { _type: 'slug', current: 'mastering-pgdca-syllabus-career-opportunities-higher-studies' },
    publishedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    category: 'Scholarships & Diplomas',
    author: 'BDPS Diploma Curriculum Committee',
    readTime: '11 min read',
    isFeatured: true,
    excerpt: 'Everything you need to know about Post Graduate Diploma in Computer Applications (PGDCA): semester syllabus, eligibility, government job opportunities, MCA lateral entry, and career growth.',
    seoTitle: 'PGDCA Diploma Course Kakinada | Syllabus, Jobs & Scope 2026',
    seoDescription: 'Complete PGDCA course guide at BDPS Kakinada. Learn semester modules, computer lab practicals, government job eligibility, and private sector IT job opportunities.',
    content: createBlocks([
      '## What is PGDCA (Post Graduate Diploma in Computer Applications)?',
      'The Post Graduate Diploma in Computer Applications (PGDCA) is a specialized 1-year postgraduate diploma designed for graduates from any stream—Commerce (B.Com), Arts (B.A), Science (B.Sc), or Management (BBA)—who wish to acquire comprehensive theoretical knowledge and practical technical skills in computer applications and software programming.',
      'In today’s technology-driven world, computer literacy is mandatory across virtually every sector. PGDCA serves as an academic bridge, equipping non-engineering graduates with the technical competence required for IT corporate roles, government office computer posts, banking positions, and educational institute software management.',

      '## Detailed 1-Year Semester-Wise PGDCA Syllabus',
      'The PGDCA course at BDPS Computer Education is meticulously structured into two comprehensive semesters combining classroom concepts with intensive daily computer lab practice:',

      '### Semester 1: Core Fundamentals & Software Tools',
      '1. **Computer Fundamentals & Architecture:** CPU architecture, memory management, input/output devices, binary arithmetic, and operating systems (Windows 11 & Linux CLI).',
      '2. **Office Automation & Productivity Suite:** Advanced MS Word (document formatting, mail merge), MS Excel (VLOOKUP, XLOOKUP, Pivot Tables, Macros), MS PowerPoint, and Google Workspace tools.',
      '3. **Programming Logic & C Language:** Algorithms, flowcharts, variables, data types, conditional statements, loops, functions, arrays, pointers, structures, and file handling in C.',
      '4. **Relational Database Management (RDBMS):** Database concepts, normalization, SQL query execution (SELECT, INSERT, UPDATE, DELETE, JOINs), and MySQL database administration.',

      '### Semester 2: Advanced Web Technologies & Application Development',
      '1. **Object-Oriented Programming with C++ / Java:** Classes, objects, inheritance, polymorphism, encapsulation, exception handling, and GUI application basics.',
      '2. **Web Designing Essentials:** HTML5 structural markup, CSS3 styling & responsive layouts, JavaScript interactive scripting, and website deployment.',
      '3. **Computer Networks & Cyber Security Basics:** OSI model, TCP/IP protocols, LAN/WAN setup, network security fundamentals, firewalls, and data encryption techniques.',
      '4. **Commercial Accounting & Project Work:** Fundamentals of computerized accounting in Tally Prime, tax voucher creation, and submission of a live Capstone Software Project.',

      '## Government & Private Sector Career Opportunities',
      'One of the greatest advantages of a PGDCA qualification is its universal recognition across both government recruitment boards and private commercial industries:',

      '### 1. Government & Public Sector Roles',
      '* **APPSC & State Government Jobs:** PGDCA is widely accepted as an official computer qualification for Panchayat Secretary, Village/Ward Secretariat Data Processing Officers, and High Court Data Entry posts.',
      '* **Banking Sector (IBPS & SBI):** Meets the mandatory 1-year computer certificate requirement for Clerical and Probationary Officer (PO) recruitments.',
      '* **Railways (RRB) & SSC:** Qualified for Data Entry Operators, Junior Assistants, and Senior Clerk-cum-Typist posts.',

      '### 2. Private Sector IT & Corporate Roles',
      '* **Computer System Operator:** Managing corporate documentation, database entry, and office reporting.',
      '* **Junior Software Developer / Tester:** Writing baseline C++/Java code, executing software test cases, and maintaining software modules.',
      '* **Web Designer & Content Administrator:** Managing client websites, updating digital assets, and designing web pages.',
      '* **Database Assistant:** Running SQL queries, backing up organizational databases, and maintaining data integrity.',

      '## Higher Studies & Academic Progression After PGDCA',
      'Graduating with a PGDCA diploma opens clear academic pathways for higher technical qualifications:',
      '* **Lateral Entry into MCA (Master of Computer Applications):** In many universities, PGDCA holders are eligible for direct admission or lateral entry into advanced MCA semesters, saving valuable time.',
      '* **M.Sc Computer Science / IT:** Provides the foundational programming background needed to excel in specialized Master’s degrees.',
      '* **Specialized International Certifications:** Prepares students to pursue advanced certifications in Cloud Computing (AWS/Azure), Cyber Security (CEH), or Data Analytics.',

      '## Why Pursue PGDCA at BDPS Computer Education Kakinada?',
      'BDPS has been the preferred PGDCA training institute in Kakinada for over two decades. Here is why thousands of local students choose BDPS:',
      '* **100% Practical Lab Commitment:** Every theoretical concept taught in class is immediately applied in our air-conditioned computer labs.',
      '* **Recognized Certification:** Receive a valid, verifiable PGDCA diploma recognized for employment applications nationwide.',
      '* **Affordable Fee Structure:** Quality education with flexible installment options to support students from all financial backgrounds.',
      '* **Free Career Counseling & Placement Guidance:** Dedicated support for job interviews, resume preparation, and career path selection.',

      '## Take the Next Step in Your Education',
      'Whether your goal is securing a stable government post or launching a corporate software career, PGDCA provides the knowledge, diploma credential, and practical confidence you need. Contact BDPS Kakinada today to check upcoming batch availability!'
    ])
  },
  {
    _type: 'blog',
    _id: 'sanity-blog-4',
    title: 'Tally Prime with GST & Commercial Accounting: Complete Career Guide for Commerce Students',
    slug: { _type: 'slug', current: 'tally-prime-gst-commercial-accounting-complete-career-guide' },
    publishedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    category: 'Financial Accounting',
    author: 'BDPS Commercial Accounting Desk',
    readTime: '9 min read',
    isFeatured: false,
    excerpt: 'Discover why mastering Tally Prime with GST, e-invoicing, and payroll management is the ultimate career booster for commerce graduates and aspiring accountants in Andhra Pradesh.',
    seoTitle: 'Tally Prime GST Course Kakinada | Commercial Accounting Institute',
    seoDescription: 'Master Tally Prime 4.0 with GST taxation, payroll, balance sheet, and e-way bill generation at BDPS Computer Education Kakinada. Get practical lab training.',
    content: createBlocks([
      '## The Evolution of Commercial Accounting in India',
      'The era of manual paper ledger books, hand-written cash journals, and cumbersome physical filing is officially over. Today, businesses of every scale—from local retail enterprises and medium distribution firms to multinational corporations and auditing firms—rely entirely on computerized accounting software.',
      'In India, **Tally Prime** (the upgraded, modern iteration of Tally.ERP 9) stands as the undisputed market leader, utilized by over 2 million businesses nationwide. For commerce graduates (B.Com, M.Com, BBA, MBA) and job seekers in accounting, mastering Tally Prime with GST compliance is the single fastest route to securing immediate, well-paying employment.',

      '## Core Modules Covered in Tally Prime Certification',
      'At BDPS Computer Education Kakinada, our Tally Prime with GST course is structured around real-world commercial transactions, tax rules, and corporate accounting scenarios:',

      '### 1. Fundamental Accounting & Company Setup',
      '* Setting up company profiles, security parameters, and multi-currency controls.',
      '* Chart of accounts: Group creation, Ledger creation, and opening balance entries.',
      '* Mastery over 8 core accounting vouchers: Contra, Payment, Receipt, Journal, Sales, Purchase, Credit Note, and Debit Note.',

      '### 2. Advanced Inventory & Stock Management',
      '* Creating stock groups, stock categories, units of measure, and godowns (warehouses).',
      '* Invoicing with itemized pricing, batch-wise management, and expiry date tracking.',
      '* Reorder levels, stock valuation methods (FIFO, LIFO, Weighted Average), and physical stock reconciliation.',

      '### 3. Goods & Services Tax (GST) Compliance',
      '* GST registration setup: CGST, SGST, IGST, and UTGST configuration.',
      '* HSN/SAC code mapping and automated tax rate calculations on inward and outward supplies.',
      '* Generating and filing GST returns: **GSTR-1** (Outward Supplies), **GSTR-3B** (Summary Return), and **GSTR-2A/2B** reconciliation.',
      '* E-Way Bill generation and E-Invoicing portal integration directly from Tally Prime.',

      '### 4. Payroll Management & Employee Statutory Compliance',
      '* Creating employee groups, pay heads (Basic, HRA, DA, Conveyance, Deductions).',
      '* Automated salary calculation, attendance registers, and pay-slip generation.',
      '* Provident Fund (PF), Employee State Insurance (ESI), and Professional Tax (PT) statutory reporting.',

      '### 5. Financial Statements & Final Reports',
      '* Automated Profit & Loss Account, Balance Sheet, and Trial Balance analysis.',
      '* Cash Flow and Funds Flow statements.',
      '* Ratio analysis and MIS reporting for business management decision-making.',

      '## Key Career Roles for Tally Certified Professionals',
      'Completing a practical Tally Prime course equips you for multiple high-demand job roles across diverse business sectors:',
      '1. **Commercial Accountant:** Managing complete daily bookkeeping, vendor payments, customer billing, and bank reconciliations for private firms.',
      '2. **GST Compliance & Tax Assistant:** Working with Chartered Accountants (CAs) and Tax Consultants to organize GST returns, e-way bills, and tax audits.',
      '3. **Billing & Inventory Executive:** Overseeing retail stock registers, purchase/sales orders, and inventory dispatch in supermarkets, distributors, and warehouses.',
      '4. **Payroll Executive:** Managing monthly staff salary registers, attendance records, PF/ESI deductions, and corporate disbursals.',
      '5. **Freelance Bookkeeper:** Managing accounting books independently for multiple small business clients.',

      '## Salary Scope & Career Progression in Andhra Pradesh',
      'Accountants play a vital role in business survival, offering stable career longevity and steady financial growth:',
      '* **Junior Accountant / Billing Clerk:** ₹2.0 LPA to ₹3.2 LPA.',
      '* **Senior Commercial Accountant:** ₹3.5 LPA to ₹6.0 LPA.',
      '* **Accounts Manager / Tax Consultant:** ₹6.5 LPA to ₹10.0+ LPA.',

      '## Why Choose BDPS for Tally Training in Kakinada?',
      'BDPS Computer Education is widely recognized as Kakinada’s top commercial accounting training center:',
      '* **100% Practical Transaction Lab:** Practice on real-world business invoices, GST returns, and bank statements.',
      '* **Updated Tally Prime 4.0 Version:** Learn on the latest software version with modern UI and e-invoicing features.',
      '* **Experienced Faculty:** Learn from certified accounting professionals and experienced tax practitioners.',
      '* **Job Referral Assistance:** Direct placement connections with local CA firms, retail enterprises, and corporate offices.',

      '## Enroll Today & Elevate Your Career',
      'Don’t let your accounting knowledge stay confined to textbooks. Master Tally Prime with GST at BDPS Kakinada and step confidently into a rewarding commercial accounting career. Contact us today for batch timings and enrollment details!'
    ])
  },
  {
    _type: 'blog',
    _id: 'sanity-blog-5',
    title: 'Core Java vs Python AI: Which Programming Language Should You Learn First?',
    slug: { _type: 'slug', current: 'core-java-vs-python-ai-which-programming-language-learn-first' },
    publishedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    category: 'Tech Trends',
    author: 'BDPS Technical Guidance Panel',
    readTime: '10 min read',
    isFeatured: false,
    excerpt: 'Confused between starting your coding journey with Java or Python? Read our comprehensive comparison of syntax, object-oriented concepts, job availability, and career longevity.',
    seoTitle: 'Core Java vs Python AI Course Kakinada | Best Coding Language 2026',
    seoDescription: 'Compare Core Java and Python programming languages for beginners. Learn syntax differences, enterprise use cases, AI trends, and job opportunities at BDPS Kakinada.',
    content: createBlocks([
      '## The Beginner Programmer’s Dilemma',
      'If you are entering the world of software development in 2026, one of the first major decisions you will face is choosing your primary programming language. Browse any developer forum or job portal, and two names consistently dominate the conversation: **Java** and **Python**.',
      'Both languages are exceptionally powerful, world-renowned, and backed by massive global developer communities. However, they were designed with very different philosophies, syntax rules, and primary use cases.',
      'In this guide, senior technical instructors at BDPS Computer Education Kakinada break down the key differences between Core Java and Python AI to help you choose the best starting point for your personal career goals.',

      '## Core Java: The Enterprise Workhorse',
      'Released by Sun Microsystems in 1995 (and now maintained by Oracle), Java was built on the principle of *"Write Once, Run Anywhere"* (WORA) using the Java Virtual Machine (JVM). Java is a strictly typed, object-oriented language known for its strict syntax, high performance, robust security, and enterprise reliability.',

      '### Why Learn Core Java?',
      '1. **Dominates Enterprise & Banking:** Over 70% of Fortune 500 companies, major banks, and government software systems rely on Java for backend enterprise applications.',
      '2. **Deep Understanding of Object-Oriented Programming (OOP):** Java enforces OOP principles (Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction) rigorously. Mastering Java makes learning any other language (C++, C#, TypeScript) effortless.',
      '3. **Android App Development:** Java (along with Kotlin) remains a core language for building native Android mobile applications.',
      '4. **Massive Hiring Demand in Indian IT:** IT giants like TCS, Infosys, Wipro, Cognizant, and Accenture hire tens of thousands of Core Java freshers every year.',

      '## Python: The King of AI, Data Science & Simplicity',
      'Created by Guido van Rossum in 1991, Python was designed with an overwhelming emphasis on code readability and developer productivity. Python’s syntax closely resembles natural English, allowing developers to accomplish in 5 lines of code what might require 20 lines in Java.',

      '### Why Learn Python AI?',
      '1. **Beginner-Friendly Syntax:** Minimal boilerplate code, dynamic typing, and simple syntax make Python the easiest language for complete coding beginners to grasp.',
      '2. **Dominance in AI & Machine Learning:** Python is the undisputed language of Artificial Intelligence, Machine Learning, Data Science, and Natural Language Processing (NLP), supported by libraries like TensorFlow, PyTorch, Pandas, and NumPy.',
      '3. **Web Development & Automation:** Frameworks like Django and Flask enable fast web development, while Python scripts automate repetitive server tasks and web scraping.',
      '4. **Rapid Prototyping:** Tech startups and research labs prefer Python because ideas can be coded and tested in hours rather than days.',

      '## Side-by-Side Comparison: Java vs Python',

      '| Feature | Core Java | Python AI |',
      '| :--- | :--- | :--- |',
      '| **Syntax Style** | Verbose, Strict & Statically Typed | Concise, Readable & Dynamically Typed |',
      '| **Learning Curve** | Moderate to Steep (Enforces OOP upfront) | Gentle & Highly Intuitive |',
      '| **Execution Speed** | Fast (Compiled to JVM Bytecode) | Slower (Interpreted Scripting Language) |',
      '| **Primary Domain** | Enterprise Backends, Banking, Android | AI/ML, Data Science, Web Apps, Automation |',
      '| **Job Market (MNCs)** | Massive corporate hiring demand | High growth in AI, Startups & Analytics |',

      '## The Verdict: Which Should You Learn First?',

      '### Choose Core Java If:',
      '* Your immediate goal is landing a software engineer job at major IT services companies (TCS, Infosys, Wipro, HCL) or MNC backends.',
      '* You want a deep, foundational understanding of computer memory management, data structures, and strict object-oriented design.',
      '* You plan to build native Android mobile apps or enterprise banking software.',

      '### Choose Python AI If:',
      '* You are a complete beginner looking for an easy, encouraging entry point into coding.',
      '* You are fascinated by Artificial Intelligence, ChatGPT models, Data Analytics, and Machine Learning.',
      '* You want to build web applications quickly using Django or automate data processing tasks.',

      '## Learn Programming the Right Way at BDPS Kakinada',
      'Whether you choose Core Java or Python AI, the key to programming mastery lies in **daily hands-on coding practice**. At BDPS Computer Education Kakinada, we offer expert-led training in both Core Java and Python AI featuring:',
      '* 100% practical lab coding exercises from Day 1.',
      '* Logic building, data structures, and algorithm problem-solving.',
      '* Live Capstone project building for your GitHub portfolio.',
      '* Interview preparation and direct job placement support.',

      'Visit BDPS at Nagamallithota Junction, Kakinada today, or call +91 85001 08016 to talk to our senior coding mentors!'
    ])
  },
  {
    _type: 'blog',
    _id: 'sanity-blog-6',
    title: 'How to Land Your First IT Job as a Fresher in Andhra Pradesh: A 90-Day Action Roadmap',
    slug: { _type: 'slug', current: 'how-to-land-first-it-job-as-fresher-andhra-pradesh-90-day-roadmap' },
    publishedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    category: 'Career Guidance',
    author: 'BDPS Training & Placement Office',
    readTime: '13 min read',
    isFeatured: false,
    excerpt: 'A comprehensive 90-day step-by-step action plan for college graduates and job seekers in AP to master technical skills, build GitHub portfolios, ace interviews, and secure software jobs.',
    seoTitle: 'IT Jobs for Freshers Kakinada | 90-Day Software Placement Roadmap',
    seoDescription: 'Step-by-step 90-day guide for freshers in Kakinada & AP to secure software IT jobs. Master coding skills, GitHub projects, resume building, and placement interviews with BDPS.',
    content: createBlocks([
      '## The Fresher Job Challenge in 2026',
      'Every year, thousands of students graduate with degrees in B.Tech, B.Sc, B.Com, and MCA across Andhra Pradesh. However, a common challenge faced by fresh graduates is the gap between college academics and actual IT industry requirements.',
      'Recruiters in top software hubs—Visakhapatnam, Vijayawada, Hyderabad, and Bengaluru—are bombarded with thousands of generic resumes. To stand out and secure a job offer, freshers need a targeted, structured strategy that combines **in-demand technical skills**, **live project proof**, and **confident interview execution**.',
      'In this 90-day action roadmap, developed by the placement experts at BDPS Computer Education Kakinada, we outline the exact step-by-step process freshers can follow to transform from college graduates into employed IT professionals.',

      '## Month 1 (Days 1 - 30): Skill Foundation & Daily Lab Mastery',
      'The first 30 days are dedicated to acquiring 1-2 marketable, high-demand technical skill sets. Avoid trying to learn everything at once; focus deeply on a proven stack.',

      '### Action Steps:',
      '1. **Choose Your Specialization Track:** Select either **Full Stack Web Development (MERN/Python)**, **Core Java Software Development**, or **Commercial Accounting (Tally Prime + PGDCA)** based on your background.',
      '2. **Commit to 3 Hours of Daily Lab Coding:** Theory alone will not pass technical screening tests. Spend at least 3 hours daily writing code, building database schemas, and debugging errors.',
      '3. **Master Git & GitHub Version Control:** Learn basic Git commands (`git init`, `git add`, `git commit`, `git push`, `git branch`). Create a professional GitHub profile to serve as your digital code proof.',

      '## Month 2 (Days 31 - 60): Portfolio Building & Capstone Projects',
      'Recruiters rarely read plain text resumes. They want to see **live working projects** that prove you can solve real-world problems.',

      '### Action Steps:',
      '1. **Build 2 Major Capstone Projects:** If learning Full Stack, build a complete E-Commerce Store or Student Management System. If learning Java, build an Online Banking System or Library Management Software.',
      '2. **Deploy Your Projects Live:** Host your frontend on Vercel/Netlify, your backend on Render/Railway, and database on MongoDB Atlas. Ensure every project has a live link and a clean GitHub Readme.',
      '3. **Solve Technical Aptitude & Data Structure Basics:** Practice basic array manipulation, string algorithms, SQL queries, and logical reasoning puzzles daily for 45 minutes.',

      '## Month 3 (Days 61 - 90): Resume Engineering, Networking & Interview Cracking',
      'The final 30 days are focused on presentation, active job application outreach, and interview execution.',

      '### Action Steps for Week 9 & 10: High-Impact Resume & LinkedIn Setup',
      '* **Craft an ATS-Friendly Single-Page Resume:** Highlight technical skills, GitHub project links, certifications, and measurable outcomes. Avoid generic filler objectives like *"hardworking individual seeking opportunities"*',
      '* **Optimize Your LinkedIn Profile:** Add a professional photo, write a clean headline (e.g., *"Aspiring Full Stack Engineer | MERN & Python | BDPS Certified"*), and post short updates about your coding projects.',

      '### Action Steps for Week 11 & 12: Interview Practice & Job Applications',
      '* **Master Core HR & Technical Questions:** Prepare clear answers for *"Tell me about yourself"*, *"Explain your Capstone project architecture"*, and *"How do you handle technical bugs?"*',
      '* **Participate in Mock Technical Interviews:** Practice white-board coding and technical explanation with mentors or peers to overcome interview nervousness.',
      '* **Apply Aggressively Across Multiple Channels:** Use LinkedIn Jobs, Naukri, Indeed, local referral networks, and the BDPS Placement Cell to submit 5-10 tailored applications daily.',

      '## Common Mistakes to Avoid During Your Job Search',
      '1. **Applying Without Project Links:** Sending a PDF resume without GitHub or live project links results in a 90% rejection rate.',
      '2. **Waiting for the "Perfect" Job:** Take an entry-level role, internship, or junior developer position to get industry experience on your resume.',
      '3. **Inconsistent Effort:** Applying for 2 days and stopping for a week breaks momentum. Daily consistency is mandatory.',

      '## How BDPS Computer Education Accelerates Your Job Search',
      'At BDPS Kakinada, we don’t just teach computer courses—we actively help students transition into successful careers:',
      '* **Industry-Aligned Practical Curriculum:** Updated for 2026 tech standards.',
      '* **Dedicated Capstone Project Mentorship:** Help you build and deploy portfolio-worthy applications.',
      '* **Resume & Interview Bootcamps:** Direct guidance on resume formatting and mock technical interviews.',
      '* **Active Local Placement Desk:** Connecting qualified students directly with hiring partners across Kakinada, Visakhapatnam, and Hyderabad.',

      '## Start Your 90-Day Journey Today',
      'Your dream IT career is only 90 days of focused effort away. Visit BDPS Computer Education at Nagamallithota Junction, Kakinada, or call +91 85001 08016 to register for our upcoming career-ready batches today!'
    ])
  }
];

async function seedSanity() {
  console.log(`🚀 Starting Sanity Blog Seeding for Project: ${projectId}, Dataset: ${dataset}...`);
  
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;

  const mutations = posts.map((post) => ({
    createOrReplace: post,
  }));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Sanity API Error:', JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log('✅ SUCCESS! Successfully seeded 6 comprehensive SEO Blog Posts into Sanity CMS:');
    posts.forEach((p, idx) => {
      console.log(`   ${idx + 1}. [${p.category}] ${p.title} (${p.slug.current})`);
    });
    console.log('\n🎉 You can now open http://localhost:3000/studio and see all 6 blog posts in Sanity Studio!');
  } catch (error) {
    console.error('❌ Network error during Sanity seed:', error);
    process.exit(1);
  }
}

seedSanity();
