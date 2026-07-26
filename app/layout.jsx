import { Outfit } from 'next/font/google';
import './globals.css';
import PopupAdModal from '@/components/integrations/PopupAdModal';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'BDPS Computer Education | Top IT & Computer Training Institute Kakinada',
  description: 'Master Full Stack Development, Java, Python AI, Tally Prime, PGDCA, and Cybersecurity with BDPS Computer Education, Kakinada. 20+ Years of Academic Excellence & 100% Practical Labs.',
  keywords: [
    'BDPS Computer Education',
    'Computer Institute Kakinada',
    'PGDCA Diploma Kakinada',
    'Tally Prime Course Kakinada',
    'Java Training Kakinada',
    'Python AI Course',
    'Software Training Institute AP',
    'EHF Scholarship Kakinada'
  ],
  authors: [{ name: 'BDPS Computer Education' }],
  creator: 'BDPS Computer Education',
  publisher: 'BDPS Computer Education',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'BDPS Computer Education | Top IT & Computer Training Institute',
    description: 'Empowering 20,000+ graduates with practical software skills, job placements, and stipend programs since 2006.',
    siteName: 'BDPS Computer Education',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={outfit.className}>
        {children}
        <PopupAdModal />
      </body>
    </html>
  );
}
