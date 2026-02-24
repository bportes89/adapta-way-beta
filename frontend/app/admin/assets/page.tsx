'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { t, useLang } from '../../../lib/i18n';

export default function AdminAssetsPage() {
  useLang();
  const { user, loading: authLoading } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [referenceValue, setReferenceValue] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAssets();
    }
  }, [user]);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets');
      setAssets(response.data);
    } catch (error) {
      console.error('Failed to fetch assets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/assets', {
        name,
        description,
        totalSupply: Number(totalSupply),
        referenceValue: Number(referenceValue),
      });
      setMessage(t('asset_created_success'));
      setName('');
      setDescription('');
      setTotalSupply('');
      setReferenceValue('');
      fetchAssets();
    } catch (error: any) {
      setMessage(error.response?.data?.message || t('asset_create_failed'));
    }
  };

  if (authLoading || loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">{t('loading')}</div>;
  if (user?.role !== 'admin') return <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">{t('access_denied')}</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
             <h1 className="text-4xl font-light text-white tracking-wide">{t('manage_assets')}</h1>
             <p className="text-gray-400 mt-2 text-sm">{t('admin_assets_header_desc')}</p>
          </div>
          <Link href="/admin" className="text-[#C5A065] hover:text-[#D4AF37] transition text-sm uppercase tracking-wider font-bold">{t('back_to_admin')}</Link>
        </div>

        {message && <div className="bg-[#C5A065]/20 border border-[#C5A065] text-[#C5A065] p-4 rounded mb-6 text-sm">{message}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-[#111] p-10 rounded-2xl border border-white/5 shadow-2xl">
            <h2 className="text-2xl font-light mb-6 text-white border-l-4 border-[#C5A065] pl-4">{t('create_new_asset')}</h2>
            <form onSubmit={handleCreateAsset} className="space-y-6">
              <div>
                 <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('asset_name_label')}</label>
                 <input 
                   type="text" placeholder={t('asset_name_placeholder')} 
                   value={name} onChange={e => setName(e.target.value)}
                   className="w-full bg-black border border-white/10 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-[#C5A065] transition" required
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('asset_desc_label')}</label>
                 <input 
                   type="text" placeholder={t('asset_desc_placeholder')} 
                   value={description} onChange={e => setDescription(e.target.value)}
                   className="w-full bg-black border border-white/10 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-[#C5A065] transition" required
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('total_supply_label')}</label>
                 <input 
                   type="number" placeholder={t('total_supply_placeholder')} 
                   value={totalSupply} onChange={e => setTotalSupply(e.target.value)}
                   className="w-full bg-black border border-white/10 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-[#C5A065] transition" required
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('reference_value_label')}</label>
                 <input 
                   type="number" placeholder={t('reference_value_placeholder')} 
                   value={referenceValue} onChange={e => setReferenceValue(e.target.value)}
                   className="w-full bg-black border border-white/10 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-[#C5A065] transition" required
                 />
              </div>
              <button type="submit" className="w-full bg-[#C5A065] text-black font-bold py-4 rounded-full hover:bg-[#D4AF37] transition mt-6 uppercase tracking-wide text-sm shadow-lg shadow-[#C5A065]/20 transform hover:-translate-y-1">
                {t('create_asset')}
              </button>
            </form>
          </div>

          <div className="bg-[#111] p-10 rounded-2xl border border-white/5 shadow-2xl h-fit">
            <h2 className="text-2xl font-light mb-6 text-white border-l-4 border-[#C5A065] pl-4">{t('existing_assets')}</h2>
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {assets.map((asset: any) => (
                <div key={asset.id} className="bg-black border border-white/5 p-6 rounded-xl hover:border-[#C5A065]/30 transition group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-white text-lg group-hover:text-[#C5A065] transition">{asset.name}</span>
                    <span className="bg-[#222] text-gray-300 text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-white/5">
                       {t('supply_label')}: {asset.availableSupply} / {asset.totalSupply}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{asset.description}</p>
                  <div className="flex justify-between items-end border-t border-white/5 pt-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{t('reference_value')}</p>
                      <p className="text-sm text-[#C5A065] font-mono font-bold">{asset.referenceValue} AC</p>
                  </div>
                </div>
              ))}
              {assets.length === 0 && <p className="text-gray-500 italic text-center py-8">{t('no_assets_found')}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
