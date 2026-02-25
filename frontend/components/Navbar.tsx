'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { t, setLang, useLang } from '../lib/i18n';

export default function Navbar() {
  const lang = useLang();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${scrolled || isMobileMenuOpen ? 'bg-black' : 'bg-transparent'}`}>
      <div className="px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="text-white text-2xl font-bold tracking-tighter flex items-center z-50 relative">
             <span className="text-[#C5A065] mr-1">AW</span> Adapta Way
          </Link>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
            <Link href="/dashboard" className="hover:text-[#C5A065] transition">{t('home')}</Link>
            <Link href="/assets" className="hover:text-[#C5A065] transition">{t('assets')}</Link>
            <Link href="/nfts" className="hover:text-[#C5A065] transition">{t('nfts')}</Link>
            <Link href="/admin" className="hover:text-[#C5A065] transition">{t('admin')}</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center space-x-2 text-white text-xs border border-white/20 rounded-full px-3 py-1 hover:bg-white/10 transition"
            >
              <img src={lang === 'pt' ? "https://flagcdn.com/w40/br.png" : "https://flagcdn.com/w40/us.png"} alt="Flag" className="w-5 h-3.5 rounded-sm object-cover" />
              <span>{lang === 'pt' ? 'PT' : 'EN'}</span>
            </button>
            
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                <button 
                  onClick={() => { setLang('pt'); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition flex items-center space-x-3 ${lang === 'pt' ? 'text-[#C5A065] bg-white/5' : 'text-gray-300'}`}
                >
                  <img src="https://flagcdn.com/w40/br.png" alt="Brasil" className="w-5 h-3.5 rounded-sm object-cover" />
                  <span>Português</span>
                </button>
                <button 
                  onClick={() => { setLang('en'); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition flex items-center space-x-3 ${lang === 'en' ? 'text-[#C5A065] bg-white/5' : 'text-gray-300'}`}
                >
                  <img src="https://flagcdn.com/w40/us.png" alt="USA" className="w-5 h-3.5 rounded-sm object-cover" />
                  <span>English</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
             <Link href="/profile" className="flex items-center space-x-3 group">
               <div className="w-8 h-8 rounded-full overflow-hidden bg-[#222] border border-[#C5A065]/50 group-hover:border-[#C5A065] transition">
                 {user?.photoUrl ? (
                   <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#C5A065]">
                     {(user?.socialName || user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                   </div>
                 )}
               </div>
               <span className="text-white text-sm group-hover:text-[#C5A065] transition font-medium">
                 {user?.socialName || user?.name || user?.email}
               </span>
             </Link>
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
          
          <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 text-sm hover:text-[#C5A065] transition">{user?.email}</Link>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setLang('pt')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition ${lang === 'pt' ? 'border-[#C5A065] bg-[#C5A065]/10 text-[#C5A065]' : 'border-white/20 text-gray-400'}`}
            >
              <img src="https://flagcdn.com/w40/br.png" alt="Brasil" className="w-6 h-4 rounded-sm object-cover" />
              <span>PT</span>
            </button>
            <button
              onClick={() => setLang('en')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition ${lang === 'en' ? 'border-[#C5A065] bg-[#C5A065]/10 text-[#C5A065]' : 'border-white/20 text-gray-400'}`}
            >
              <img src="https://flagcdn.com/w40/us.png" alt="USA" className="w-6 h-4 rounded-sm object-cover" />
              <span>EN</span>
            </button>
          </div>
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