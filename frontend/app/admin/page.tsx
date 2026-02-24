'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { t } from '../../lib/i18n';

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">{t('loading')}</div>;
  if (!user || user.role !== 'admin') return <div className="min-h-screen bg-[#141414] text.white flex items-center justify-center">{t('access_denied')}</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col items-start mb-12">
           <h1 className="text-4xl font-light text-white tracking-wide">{t('admin_control_center')}</h1>
           <div className="h-0.5 w-24 bg-[#C5A065] mt-4"></div>
           <p className="text-gray-400 mt-4 max-w-2xl">{t('admin_control_desc')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/admin/users" className="group block p-8 bg-[#111] rounded-2xl border border-white/5 hover:border-[#C5A065]/50 transition duration-300 shadow-lg hover:shadow-[#C5A065]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <span className="text-8xl">👤</span>
            </div>
            <div className="w-16 h-16 bg-[#C5A065]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#C5A065] transition duration-300">
                <span className="text-2xl group-hover:text-black transition">👤</span>
            </div>
            <h2 className="text-2xl font-light mb-3 text-white group-hover:text-[#C5A065] transition">{t('manage_users')}</h2>
            <p className="text-gray-400 text-sm leading-relaxed z-10 relative">Visualize, bloqueie ou gerencie permissões de usuários cadastrados.</p>
          </Link>

          <Link href="/admin/assets" className="group block p-8 bg-[#111] rounded-2xl border border-white/5 hover:border-[#C5A065]/50 transition duration-300 shadow-lg hover:shadow-[#C5A065]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <span className="text-8xl">💎</span>
            </div>
            <div className="w-16 h-16 bg-[#C5A065]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#C5A065] transition duration-300">
                <span className="text-2xl group-hover:text-black transition">💎</span>
            </div>
            <h2 className="text-2xl font-light mb-3 text-white group-hover:text-[#C5A065] transition">{t('manage_assets')}</h2>
            <p className="text-gray-400 text-sm leading-relaxed z-10 relative">Emita tokens, gerencie o supply e configure detalhes de ativos.</p>
          </Link>

          <Link href="/admin/withdrawals" className="group block p-8 bg-[#111] rounded-2xl border border-white/5 hover:border-[#C5A065]/50 transition duration-300 shadow-lg hover:shadow-[#C5A065]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <span className="text-8xl">💸</span>
            </div>
            <div className="w-16 h-16 bg-[#C5A065]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#C5A065] transition duration-300">
                <span className="text-2xl group-hover:text-black transition">💸</span>
            </div>
            <h2 className="text-2xl font-light mb-3 text-white group-hover:text-[#C5A065] transition">{t('review_withdrawals')}</h2>
            <p className="text-gray-400 text-sm leading-relaxed z-10 relative">Analise e aprove solicitações de saque via PIX dos usuários.</p>
          </Link>
        </div>

        <div className="mt-16 bg-[#111] p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl">
          <h2 className="text-2xl font-light mb-8 text-white border-l-4 border-[#C5A065] pl-4">Visão do Sistema</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <div className="p-6 bg-black rounded-xl border border-white/5">
                <div className="text-[#C5A065] text-xs uppercase tracking-widest mb-2">Usuários Totais</div>
                <div className="text-3xl font-light text-white">--</div>
             </div>
             <div className="p-6 bg-black rounded-xl border border-white/5">
                <div className="text-[#C5A065] text-xs uppercase tracking-widest mb-2">Ativos Totais</div>
                <div className="text-3xl font-light text-white">--</div>
             </div>
             <div className="p-6 bg-black rounded-xl border border-white/5">
                <div className="text-[#C5A065] text-xs uppercase tracking-widest mb-2">Volume (24h)</div>
                <div className="text-3xl font-light text-white">R$ --</div>
             </div>
             <div className="p-6 bg-black rounded-xl border border-white/5">
                <div className="text-[#C5A065] text-xs uppercase tracking-widest mb-2">Saques Pendentes</div>
                <div className="text-3xl font-light text-[#C5A065]">--</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
