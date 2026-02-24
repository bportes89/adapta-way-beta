'use client';

import React, { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { t } from '../../lib/i18n';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users', { name, email, password });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black font-sans overflow-hidden px-4">
      {/* Background with luxury gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-black to-[#050505] z-0"></div>
      
      {/* Subtle Gold Accent Circle */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#C5A065] rounded-full mix-blend-screen filter blur-[128px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#C5A065] rounded-full mix-blend-screen filter blur-[128px] opacity-5 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-[#111] p-6 sm:p-10 rounded-2xl shadow-2xl shadow-black/80 border border-white/5 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
           <h2 className="text-3xl font-light text-white tracking-wide text-center">{t('create_account')}</h2>
           <div className="h-0.5 w-16 bg-[#C5A065] mt-4"></div>
        </div>

        {error && <div className="bg-red-900/20 border border-red-900/50 p-4 rounded mb-6 text-red-200 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
             <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('full_name_label')}</label>
             <input
              type="text"
              placeholder={t('full_name_placeholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-white/10 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-[#C5A065] transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('email_label')}</label>
            <input
              type="email"
              placeholder={t('email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-[#C5A065] transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('password_label')}</label>
            <input
              type="password"
              placeholder={t('password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-[#C5A065] transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#C5A065] text-black font-bold py-4 rounded-full mt-6 hover:bg-[#D4AF37] transition duration-200 uppercase tracking-wide text-sm shadow-lg shadow-[#C5A065]/20 transform hover:-translate-y-1"
          >
            {t('sign_up')}
          </button>
        </form>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            {t('have_account')}{' '}
            <Link href="/login" className="text-[#C5A065] hover:text-[#D4AF37] font-medium transition">
              {t('sign_in')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
