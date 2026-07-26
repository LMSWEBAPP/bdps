import { Outfit } from 'next/font/google';
import './globals.css';
import PopupAdModal from '@/components/integrations/PopupAdModal';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'BDPS Computer Education | Industry Certified IT Institute',
  description: 'Master full-stack software development, data science, cybersecurity, and DCA diplomas with BDPS Computers.',
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
