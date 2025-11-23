import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import LandingPage from './home';
const LandingMobile = dynamic(
  () => import('../components/mobile/landing-mobile'),
  {
    ssr: false,
  }
);

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile ? <LandingMobile /> : <LandingPage />;
}
