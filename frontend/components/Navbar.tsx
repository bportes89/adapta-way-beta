'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { t, getLang, setLang } from '../lib/i18n';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLangState] = useState(getLang());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    const onLangChange = () => setLangState(getLang());
    window.addEventListener('langchange', onLangChange as EventListener);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleLang = () => {
    const next = lang === 'pt' ? 'en' : 'pt';
    setLang(next);
    setLangState(next);
  };

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${scrolled || isMobileMenuOpen ? 'bg-black' : 'bg-transparent'}`}>
      <div className="px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="text-white text-2xl font-bold tracking-tighter flex items-center z-50 relative">
             <span className="text-[#C5A065] mr-1">AW</span> Adapta Way Beta
          </Link>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
            <Link href="/dashboard" className="hover:text-[#C5A065] transition">{t('home')}</Link>
            <Link href="/assets" className="hover:text-[#C5A065] transition">{t('assets')}</Link>
            <Link href="/nfts" className="hover:text-[#C5A065] transition">{t('nfts')}</Link>
            <Link href="/admin" className="hover:text-[#C5A065] transition">{t('admin')}</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLang}
            className="text-white text-xs border border-white/20 rounded-full px-3 py-1 hover:bg-white/10 transition hidden sm:block"
          >
            {t('lang_label')}
          </button>
          <div className="text-white text-sm hidden md:block">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="text-black text-sm font-bold bg-[#C5A065] px-6 py-2 rounded-full hover:bg-[#D4AF37] transition hidden md:block"
          >
            {t('sign_out')}
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white z-50 relative p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center space-y-8 md:hidden">
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-2xl hover:text-[#C5A065] transition">{t('home')}</Link>
          <Link href="/assets" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-2xl hover:text-[#C5A065] transition">{t('assets')}</Link>
          <Link href="/nfts" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-2xl hover:text-[#C5A065] transition">{t('nfts')}</Link>
          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-2xl hover:text-[#C5A065] transition">{t('admin')}</Link>
          
          <div className="h-px w-16 bg-white/20 my-4"></div>
          
          <div className="text-gray-400 text-sm">{user?.email}</div>
          <button
            onClick={toggleLang}
            className="text-white text-sm border border-white/20 rounded-full px-6 py-2 hover:bg-white/10 transition"
          >
            {t('lang_label')}
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="text-black text-lg font-bold bg-[#C5A065] px-8 py-3 rounded-full hover:bg-[#D4AF37] transition mt-4"
          >
            {t('sign_out')}
          </button>
        </div>
      )}
    </nav>
  );
}
// Mobile responsive fix v2