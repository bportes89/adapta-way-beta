'use client';

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../lib/i18n';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      const profileRes = await api.get('/auth/profile');
      login(access_token, profileRes.data);
      // router.push is called inside login; keeping here is redundant
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
          <h2 className="text-3xl font-light text-white tracking-wide text-center">{t('welcome_back')}</h2>
           <div className="h-0.5 w-16 bg-[#C5A065] mt-4"></div>
        </div>

        {error && <div className="bg-red-900/20 border border-red-900/50 p-4 rounded mb-6 text-red-200 text-sm text-center">{error === 'Unauthorized' ? t('unauthorized') : error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
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
            {t('sign_in')}
          </button>
        </form>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            {t('no_account')}{' '}
            <Link href="/register" className="text-[#C5A065] hover:text-[#D4AF37] font-medium transition">
              {t('sign_up')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
