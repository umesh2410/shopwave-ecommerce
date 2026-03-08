import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ToastProvider from '../components/ui/ToastProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });

export const metadata = {
  title: 'EliteBazaar — Premium E-Commerce',
  description: 'Discover curated products at great prices',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body bg-stone-50 text-stone-900 min-h-screen flex flex-col">
        <ToastProvider />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
