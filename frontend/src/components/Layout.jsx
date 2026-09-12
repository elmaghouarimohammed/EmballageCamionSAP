import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout() {
  const { pathname } = useLocation();
  const isLaunchpad = pathname === '/';
  const [footerMessage, setFooterMessage] = useState('Prêt');

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: isLaunchpad ? '#F5F7FA' : undefined }}
    >
      {!isLaunchpad && <Navbar />}
      <Outlet context={{ setFooterMessage }} />
      {!isLaunchpad && <Footer message={footerMessage} />}
    </div>
  );
}
