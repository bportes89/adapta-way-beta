'use client';

import Link from "next/link";
import { t, useLang } from "../lib/i18n";

export default function Home() {
  useLang();
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 z-0"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#C5A065] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#C5A065] rounded-full mix-blend-screen filter blur-[120px] opacity-5 pointer-events-none"></div>

      <nav className="relative z-10 px-6 py-6 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto w-full gap-4 sm:gap-0">
        <div className="text-2xl font-bold tracking-tighter flex items-center">
             <span className="text-[#C5A065] mr-2 text-3xl">AW</span> 
             <span className="inline">Adapta Way</span>
        </div>
        <div className="flex space-x-4 items-center">
             <Link href="/login" className="text-sm font-bold uppercase tracking-wider hover:text-[#C5A065] transition px-4 py-2">
              {t('sign_in')}
             </Link>
             <Link href="/register" className="text-sm font-bold uppercase tracking-wider bg-white text-black px-6 py-2 rounded-full hover:bg-[#C5A065] transition text-center whitespace-nowrap">
              {t('create_account_cta')}
             </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-20 py-10">
        <div className="max-w-4xl space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-light tracking-tight text-white mb-6 leading-tight">
              {t('hero_title_line1')} <br/>
              <span className="text-[#C5A065] font-bold">{t('hero_title_line2')}</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
              {t('hero_subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
              <Link
                className="bg-[#C5A065] text-black px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#D4AF37] transition transform hover:scale-105 shadow-[0_0_20px_rgba(197,160,101,0.3)]"
                href="/login"
              >
                {t('get_started')}
              </Link>
              <Link
                className="bg-transparent border border-white/20 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition transform hover:scale-105 backdrop-blur-sm"
                href="/register"
              >
                {t('create_account_cta')}
              </Link>
            </div>
        </div>
      </main>

      <footer className="relative z-10 py-8 text-center text-gray-600 text-xs uppercase tracking-widest">
        {t('beta_footer')}
      </footer>
    </div>
  );
}
