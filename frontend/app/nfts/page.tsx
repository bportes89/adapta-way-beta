'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { t } from '../../lib/i18n';

export default function NftsPage() {
  const { user, loading: authLoading } = useAuth();
  const [nfts, setNfts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Create NFT Form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMetadata, setNewMetadata] = useState('{"type": "utility", "access_level": "gold"}');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [allNfts, userNfts] = await Promise.all([
        api.get('/nfts'),
        api.get('/nfts/my'),
      ]);
      setNfts(allNfts.data);
      setMyNfts(userNfts.data);
    } catch (error) {
      console.error('Failed to fetch NFTs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNft = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/nfts', {
        name: newName,
        description: newDesc,
        metadata: JSON.parse(newMetadata || '{}'),
      });
      setMessage('NFT emitido com sucesso');
      setNewName('');
      setNewDesc('');
      setNewMetadata('{"type": "utility", "access_level": "gold"}');
      fetchData();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Falha na emissão');
    }
  };

  if (authLoading || loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">{t('loading')}</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto space-y-12">
        {message && <div className="bg-[#C5A065]/20 border border-[#C5A065] text-[#C5A065] p-4 rounded mb-4 text-sm">{message}</div>}

        {/* Header */}
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
           <div>
              <h1 className="text-4xl font-light text-white mb-2 tracking-wide">{t('utility_nfts')}</h1>
              <p className="text-gray-400">{t('nfts_tagline')}</p>
           </div>
        </div>

        {/* My NFTs Collection */}
        <section>
          <h2 className="text-2xl font-light mb-6 text-[#C5A065] border-l-4 border-[#C5A065] pl-4 uppercase tracking-wide text-sm">{t('my_collection')}</h2>
          {myNfts.length === 0 ? (
             <div className="bg-[#111] p-12 rounded-2xl border border-white/5 text-center text-gray-500">
               {t('you_have_no_nfts')}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {myNfts.map((nft: any) => (
                <div key={nft.id} className="bg-[#111] border border-white/5 rounded-xl overflow-hidden hover:scale-105 transition duration-300 group cursor-pointer relative shadow-lg shadow-black/50">
                  {/* Visual Representation */}
                  <div className="h-56 bg-gradient-to-t from-black to-[#1a1a1a] flex items-center justify-center relative overflow-hidden group-hover:bg-[#222] transition">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                     <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(197,160,101,0.5)]">💎</span>
                     <div className="absolute top-3 right-3 bg-black/80 px-3 py-1 rounded-full text-[10px] text-[#C5A065] font-mono border border-[#C5A065]/30">
                        #{nft.id.substring(0, 4)}
                     </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-white mb-2">{nft.name}</h3>
                    <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">{nft.description}</p>
                    
                    <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                        <p className="text-[10px] text-[#C5A065] uppercase font-bold mb-1 tracking-wider">Hash da Blockchain</p>
                        <p className="text-[10px] text-gray-500 font-mono truncate" title={nft.blockchainHash}>
                            {nft.blockchainHash || t('pending')}
                        </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Minting Station (Admin or User Feature for Beta) */}
        <section className="bg-[#111] border border-white/5 rounded-2xl p-10 shadow-2xl">
          <div className="mb-8">
              <h2 className="text-2xl font-light text-white mb-2">{t('mint_station')}</h2>
              <div className="h-0.5 w-12 bg-[#C5A065] mb-2"></div>
              <p className="text-gray-400 text-sm">{t('create_utility_nfts_hint')}</p>
          </div>
          
          <form onSubmit={handleCreateNft} className="space-y-8 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('nft_name_label')}</label>
                    <input 
                      type="text" 
                      value={newName} onChange={e => setNewName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-[#C5A065] focus:outline-none transition"
                      placeholder="Ex.: Gold Access Pass"
                      required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('description_label')}</label>
                    <input 
                      type="text" 
                      value={newDesc} onChange={e => setNewDesc(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-[#C5A065] focus:outline-none transition"
                      placeholder="Descrição do utilitário..."
                      required
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('metadata_json_label')}</label>
                <textarea 
                  value={newMetadata} onChange={e => setNewMetadata(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg p-4 text-white font-mono text-sm focus:border-[#C5A065] focus:outline-none transition h-32"
                  placeholder={t('metadata_json_placeholder')}
                />
                <p className="text-xs text-gray-500 mt-2">{t('metadata_helper')}</p>
            </div>

            <button type="submit" className="bg-[#C5A065] text-black px-10 py-4 rounded-full font-bold hover:bg-[#D4AF37] transition w-full md:w-auto uppercase tracking-wide text-sm transform hover:-translate-y-1 shadow-lg shadow-[#C5A065]/20">
              {t('mint_utility_nft')}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
