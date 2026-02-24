'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Navbar from '../../components/Navbar';
import { formatNumber } from '../../lib/utils';
import { t } from '../../lib/i18n';

export default function AssetsPage() {
  const { user, loading: authLoading } = useAuth();
  const [assets, setAssets] = useState([]);
  const [myAssets, setMyAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [allAssets, userAssets] = await Promise.all([
        api.get('/assets'),
        api.get('/assets/my'),
      ]);
      setAssets(allAssets.data);
      setMyAssets(userAssets.data);
    } catch (error) {
      console.error('Failed to fetch assets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (assetId: string) => {
    const amount = prompt(t('buy_prompt'));
    if (!amount) return;
    try {
      await api.post(`/assets/${assetId}/buy`, { amount: Number(amount) });
      setMessage('Compra realizada com sucesso');
      fetchData();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Falha na compra');
    }
  };

  if (authLoading || loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">Carregando...</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto space-y-12">
        {message && <div className="bg-[#C5A065]/20 border border-[#C5A065] text-[#C5A065] p-4 rounded mb-4 text-sm">{message}</div>}

        {/* Meus Ativos */}
        <section>
          <h2 className="text-2xl font-light mb-6 text-[#C5A065] uppercase tracking-wide text-sm border-l-4 border-[#C5A065] pl-4">{t('my_portfolio')}</h2>
          {myAssets.length === 0 ? (
             <div className="bg-[#111] p-12 rounded-2xl border border-white/5 text-center text-gray-500">
               {t('you_have_no_assets')}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myAssets.map((item: any) => (
                <div key={item.id} className="bg-[#111] border border-white/5 p-8 rounded-xl hover:bg-[#161616] transition duration-300 shadow-lg shadow-black/50">
                  <h3 className="font-bold text-xl mb-3 text-white">{item.asset.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{item.asset.description}</p>
                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <div>
                        <div className="text-3xl font-light text-[#C5A065]">{item.amount}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{t('tokens_in_wallet')}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('current_value')}</div>
                        <div className="text-white font-mono">{formatNumber(item.asset.referenceValue)} AC</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Ativos Disponíveis */}
        <section>
          <h2 className="text-2xl font-light mb-6 text-white tracking-wide">{t('marketplace')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.map((asset: any) => (
              <div key={asset.id} className="bg-[#111] border border-white/5 rounded-xl overflow-hidden hover:scale-[1.02] transition duration-300 shadow-xl group">
                {/* Fake Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center relative group-hover:bg-[#222] transition">
                    <span className="text-5xl font-light text-[#C5A065] opacity-50 tracking-widest">{asset.symbol || 'AST'}</span>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                        <span className="text-[#C5A065] text-xs font-bold">{asset.referenceValue} AC</span>
                    </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-white group-hover:text-[#C5A065] transition">{asset.name}</h3>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-8 h-10 overflow-hidden leading-relaxed">{asset.description}</p>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">
                      {t('supply_label')}: <span className="font-bold text-white ml-1">{asset.availableSupply}</span> <span className="text-gray-600">/ {asset.totalSupply}</span>
                    </div>
                    <button 
                      onClick={() => handleBuy(asset.id)}
                      className="bg-[#C5A065] text-black px-6 py-2 rounded-full font-bold hover:bg-[#D4AF37] transition disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-wide shadow-lg shadow-[#C5A065]/10 transform hover:-translate-y-1"
                      disabled={asset.availableSupply <= 0}
                    >
                      {asset.availableSupply > 0 ? t('buy') : t('sold_out')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
