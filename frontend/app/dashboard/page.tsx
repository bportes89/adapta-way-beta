'use client';

import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../lib/api';
import Navbar from '../../components/Navbar';
import { formatNumber } from '../../lib/utils';
import { t, useLang } from '../../lib/i18n';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock Data for "Featured" Asset (Hero)
const featuredAsset = {
  id: 'featured-1',
  name: 'ADAPTA PRIME FUND',
  image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2070&auto=format&fit=crop',
};

export default function DashboardPage() {
  useLang();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [adaptaCoinBalance, setAdaptaCoinBalance] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [myAssets, setMyAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [isPixCopied, setIsPixCopied] = useState(false);
  
  // Deposit Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositStep, setDepositStep] = useState<'amount' | 'pix'>('amount');
  const [pixCode, setPixCode] = useState('');

  // Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferCurrency, setTransferCurrency] = useState<'BRL' | 'ADAPTA'>('BRL');
  const [isTransferring, setIsTransferring] = useState(false);

  // Convert Modal State
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertAmount, setConvertAmount] = useState('');
  const [convertFrom, setConvertFrom] = useState<'BRL' | 'ADAPTA'>('BRL');
  const [isConverting, setIsConverting] = useState(false);

  // Withdraw Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPixKey, setWithdrawPixKey] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchData = async () => {
    try {
      const balanceRes = await api.get('/wallet/balance');
      setBalance(balanceRes.data.balance);
      setAdaptaCoinBalance(balanceRes.data.adaptaCoinBalance);
      setWalletAddress(balanceRes.data.address || t('wallet_generating'));

      const historyRes = await api.get('/wallet/history');
      setRecentTransactions(historyRes.data.slice(0, 5)); // Take first 5

      // Fetch user assets (mock or real if implemented)
      try {
          const assetsRes = await api.get('/assets/my');
          setMyAssets(assetsRes.data);
      } catch (e) {
          console.log("No assets or error fetching assets");
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        router.push('/login');
        return;
      }
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [authLoading, user]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      alert(t('valid_amount'));
      return;
    }

    // Generate Fake PIX Code
    const randomHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setPixCode(`00020126580014BR.GOV.BCB.PIX0136${randomHash}520400005303986540${Number(depositAmount).toFixed(2).replace('.', '')}5802BR5913ADAPTA WAY6008BRASILIA62070503***6304${randomHash.substring(0, 4).toUpperCase()}`);
    setDepositStep('pix');
  };

  const confirmDepositPayment = async () => {
    setIsDepositing(true);
    try {
      await api.post('/wallet/deposit', { amount: Number(depositAmount) });
      alert(t('deposit_success'));
      setDepositAmount('');
      setDepositStep('amount');
      setIsDepositModalOpen(false);
      fetchData(); // Refresh balance and history
    } catch (error) {
      console.error('Deposit failed:', error);
      alert(t('deposit_fail'));
    } finally {
      setIsDepositing(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAmount || isNaN(Number(transferAmount)) || Number(transferAmount) <= 0) {
      alert(t('valid_amount'));
      return;
    }
    if (!transferRecipient) {
        alert(t('transfer_recipient_required'));
        return;
    }

    setIsTransferring(true);
    try {
      await api.post('/wallet/transfer', { 
          recipient: transferRecipient,
          amount: Number(transferAmount),
          currency: transferCurrency
      });
      alert(t('transfer_success'));
      setTransferAmount('');
      setTransferRecipient('');
      setTransferCurrency('BRL');
      setIsTransferModalOpen(false);
      fetchData(); // Refresh balance and history
    } catch (error) {
      console.error('Transfer failed:', error);
      alert(t('transfer_fail'));
    } finally {
      setIsTransferring(false);
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertAmount || isNaN(Number(convertAmount)) || Number(convertAmount) <= 0) {
      alert(t('valid_amount'));
      return;
    }

    setIsConverting(true);
    try {
      await api.post('/wallet/convert', {
        amount: Number(convertAmount),
        fromCurrency: convertFrom
      });
      alert('Conversão realizada com sucesso!');
      setIsConvertModalOpen(false);
      setConvertAmount('');
      fetchData(); // Refresh balance and history
    } catch (error: any) {
      console.error('Conversion failed:', error);
      const message = error?.response?.data?.message || 'Falha na conversão. Verifique seu saldo.';
      alert(message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      alert(t('valid_amount'));
      return;
    }
    if (!withdrawPixKey) {
        alert(t('valid_pix'));
        return;
    }

    setIsWithdrawing(true);
    try {
      await api.post('/wallet/withdraw-request', { 
          amount: Number(withdrawAmount),
          pixKey: withdrawPixKey
      });
      alert(t('withdraw_request_success'));
      setWithdrawAmount('');
      setWithdrawPixKey('');
      setIsWithdrawModalOpen(false);
      fetchData(); // Refresh balance and history
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      const message = error?.response?.data?.message || 'Falha na solicitação de saque. Verifique seu saldo.';
      alert(message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setIsAddressCopied(true);
      setTimeout(() => setIsAddressCopied(false), 2000);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[65vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${featuredAsset.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        <div className="absolute top-[30%] left-4 md:left-12 max-w-2xl space-y-6 right-4 md:right-auto">
          <h1 className="text-4xl md:text-7xl font-bold drop-shadow-lg text-white tracking-tight leading-tight">
            {t('featured_asset_name')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 drop-shadow-md max-w-lg leading-relaxed">
            {t('featured_asset_desc')}
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-8">
            <button
              onClick={() => setIsIntroOpen(true)}
              className="bg-[#C5A065] text-black px-8 py-3 rounded-full font-bold hover:bg-[#D4AF37] transition flex items-center justify-center transform hover:scale-105 duration-200 w-full md:w-auto"
            >
              <span className="mr-2">▶</span> {t('play_intro')}
            </button>
            <button
              onClick={() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition flex items-center justify-center backdrop-blur-sm w-full md:w-auto"
            >
              ℹ {t('more_info')}
            </button>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <div ref={contentRef} className="px-4 md:px-12 -mt-20 relative z-10 space-y-16 pb-20">
        
        {/* Wallet Section */}
        <section className="pt-10">
          <h2 className="text-2xl font-light mb-6 text-[#C5A065] tracking-wide uppercase text-sm">{t('your_wallet')}</h2>
          <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between shadow-2xl shadow-black/50 gap-8 lg:gap-0">
            <div>
               <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">{t('total_balance')}</p>
               <div className="text-5xl font-light text-white mt-1 break-all">
                 {loading ? '...' : <span className="flex items-baseline flex-wrap">R$ <span className="font-bold ml-2">{formatNumber(Number(balance || 0))}</span></span>}
               </div>
               <div className="mt-4">
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">AdaptaCoin</p>
                  <div className="text-3xl font-light text-[#C5A065] break-all">
                     {loading ? '...' : <span className="flex items-baseline flex-wrap"><span className="font-bold mr-2">{formatNumber(Number(adaptaCoinBalance || 0))}</span> ADP</span>}
                  </div>
               </div>
               {walletAddress && (
                 <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <span className="text-xs text-gray-500 bg-[#222] px-3 py-1.5 rounded-full font-mono border border-white/5 break-all">
                      {walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 6)}
                    </span>
                    <button 
                      onClick={handleCopyAddress}
                      className={`text-xs font-medium uppercase tracking-wide transition-all ${isAddressCopied ? 'text-green-500 font-bold' : 'text-[#C5A065] hover:text-[#D4AF37]'}`}
                    >
                      {isAddressCopied ? (t('code_copied') || 'Copiado!') : t('copy')}
                    </button>
                 </div>
               )}
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full lg:w-auto">
               <button 
                 onClick={() => setIsDepositModalOpen(true)}
                 className="bg-[#C5A065] text-black px-8 py-3 rounded-full font-bold hover:bg-[#D4AF37] transition transform hover:-translate-y-1 shadow-lg shadow-[#C5A065]/20 w-full md:w-auto text-center"
               >
                 {t('deposit')}
               </button>
               <button 
                 onClick={() => setIsTransferModalOpen(true)}
                 className="bg-transparent border border-[#C5A065] text-[#C5A065] px-8 py-3 rounded-full font-bold hover:bg-[#C5A065] hover:text-black transition transform hover:-translate-y-1 w-full md:w-auto text-center"
               >
                 {t('transfer')}
               </button>
               <button 
                 onClick={() => setIsConvertModalOpen(true)}
                 className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition transform hover:-translate-y-1 w-full md:w-auto text-center"
               >
                 {t('convert')}
               </button>
               <button 
                 onClick={() => setIsWithdrawModalOpen(true)}
                 className="bg-[#222] text-white border border-white/10 px-8 py-3 rounded-full font-bold hover:bg-[#333] transition transform hover:-translate-y-1 w-full md:w-auto text-center"
               >
                 {t('withdraw')}
               </button>
            </div>
          </div>
        </section>

        {/* My Assets Row (Horizontal Scroll) */}
        <section>
           <h2 className="text-2xl font-light mb-6 text-[#C5A065] tracking-wide uppercase text-sm">{t('my_assets')}</h2>
           <div className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide">
              {myAssets.length === 0 ? (
                <div className="w-72 h-40 bg-[#111] rounded-xl flex items-center justify-center text-gray-500 shrink-0 border border-white/5">
                   {t('no_assets')}
                 </div>
              ) : (
                myAssets.map((item: any) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedAsset(item)}
                    className="w-72 bg-[#111] rounded-xl hover:scale-105 transition duration-300 cursor-pointer shrink-0 border border-white/5 overflow-hidden group shadow-lg"
                  >
                     <div className="h-36 bg-[#1a1a1a] relative group-hover:bg-[#222] transition">
                        {/* Placeholder image for asset */}
                        <div className="absolute inset-0 flex items-center justify-center text-[#C5A065] font-light text-3xl tracking-widest">
                           {item.asset.symbol}
                        </div>
                     </div>
                     <div className="p-5">
                        <h3 className="font-bold text-lg text-white">{item.asset.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{t('quantity')}: <span className="text-[#C5A065]">{item.amount}</span></p>
                     </div>
                  </div>
                ))
              )}
              
              {/* Fake items to show scrolling if empty */}
              {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="w-72 bg-[#111] rounded-xl hover:scale-105 transition duration-300 cursor-pointer shrink-0 border border-white/5 overflow-hidden group opacity-40 hover:opacity-60">
                    <div className="h-36 bg-[#1a1a1a] relative">
                       <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-light text-2xl">
                          DEMO {i}
                       </div>
                    </div>
                    <div className="p-5">
                       <h3 className="font-bold text-white">{t('demo_asset_label')} {i}</h3>
                       <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{t('coming_soon_label')}</p>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <h2 className="text-2xl font-light mb-6 text-[#C5A065] tracking-wide uppercase text-sm">{t('recent_activity')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {recentTransactions.map((tx: any) => (
               <div key={tx.id} className="bg-[#111] p-6 rounded-xl hover:bg-[#161616] transition border border-white/5 group">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="font-medium text-white group-hover:text-[#C5A065] transition">{tx.type}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(tx.timestamp).toLocaleDateString()}</p>
                     </div>
                     <span className={`font-mono text-lg ${tx.type === 'DEPOSIT' || tx.type === 'RECEIVED' ? 'text-[#C5A065]' : 'text-white/60'}`}>
                        {tx.type === 'DEPOSIT' || tx.type === 'RECEIVED' ? '+' : '-'} R$ {formatNumber(tx.amount)}
                     </span>
                  </div>
               </div>
             ))}
             {recentTransactions.length === 0 && (
                <p className="text-gray-500 italic">{t('no_recent_transactions')}</p>
             )}
          </div>
        </section>

      </div>

        {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="bg-[#111] p-6 sm:p-8 rounded-2xl w-full max-w-md border border-[#C5A065]/20 relative shadow-2xl shadow-[#C5A065]/10 my-auto">
            <button 
              onClick={() => {
                setIsDepositModalOpen(false);
                setDepositStep('amount');
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition p-2"
            >
              ✕
            </button>
            
            {depositStep === 'amount' ? (
              <>
                <h2 className="text-2xl font-light text-white mb-2">{t('deposit_funds')}</h2>
                <div className="h-0.5 w-12 bg-[#C5A065] mb-6"></div>
                
                <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                  {t('enter_amount_pix_hint')}
                </p>
                
                <form onSubmit={handleDeposit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('amount_brl_label')}</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0.01"
                      required
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-[#000] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#C5A065] transition text-lg"
                      placeholder={t('amount_placeholder_brl')}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isDepositing}
                    className={`w-full py-4 rounded-full font-bold transition uppercase tracking-wide text-sm ${isDepositing ? 'bg-[#333] text-gray-500 cursor-not-allowed' : 'bg-[#C5A065] text-black hover:bg-[#D4AF37]'}`}
                  >
                    {isDepositing ? t('processing') : t('confirm_deposit')}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-light text-white mb-2">{t('pay_pix_title')}</h2>
                <div className="h-0.5 w-12 bg-[#C5A065] mb-6"></div>

                <p className="text-gray-400 mb-6 text-sm leading-relaxed text-center">
                  {t('pay_pix_instruction')}
                </p>

                <div className="flex justify-center mb-6 bg-white p-4 rounded-lg w-fit mx-auto">
                  <QRCodeSVG value={pixCode} size={200} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('pix_copy_paste')}</label>
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        readOnly
                        value={pixCode}
                        className="w-full bg-[#000] border border-white/10 rounded-lg p-3 text-white text-xs font-mono truncate"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(pixCode);
                          setIsPixCopied(true);
                          setTimeout(() => setIsPixCopied(false), 2000);
                        }}
                        className={`bg-[#222] px-4 rounded-lg font-bold transition border border-[#C5A065]/30 shrink-0 ${isPixCopied ? 'text-green-500' : 'text-[#C5A065] hover:bg-[#333]'}`}
                      >
                        {isPixCopied ? (t('code_copied') || 'Copiado!') : t('copy')}
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={confirmDepositPayment}
                    disabled={isDepositing}
                    className={`w-full py-4 rounded-full font-bold transition uppercase tracking-wide text-sm ${isDepositing ? 'bg-[#333] text-gray-500 cursor-not-allowed' : 'bg-[#C5A065] text-black hover:bg-[#D4AF37]'}`}
                  >
                    {isDepositing ? t('processing') : t('confirm_payment')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="bg-[#111] p-6 sm:p-8 rounded-2xl w-full max-w-md border border-[#C5A065]/20 relative shadow-2xl shadow-[#C5A065]/10 my-auto">
            <button 
              onClick={() => setIsTransferModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition p-2"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-light text-white mb-2">{t('transfer_funds')}</h2>
            <div className="h-0.5 w-12 bg-[#C5A065] mb-6"></div>
            
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              {t('send_adaptacoin_hint')}
            </p>
            
            <form onSubmit={handleTransfer} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('currency_label')}</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setTransferCurrency('BRL')}
                    className={`flex-1 py-3 rounded-lg font-bold border ${transferCurrency === 'BRL' ? 'bg-[#C5A065] text-black border-[#C5A065]' : 'bg-black text-gray-500 border-white/10'}`}
                  >
                    Real (R$)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferCurrency('ADAPTA')}
                    className={`flex-1 py-3 rounded-lg font-bold border ${transferCurrency === 'ADAPTA' ? 'bg-[#C5A065] text-black border-[#C5A065]' : 'bg-black text-gray-500 border-white/10'}`}
                  >
                    AdaptaCoin
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('recipient_label')}</label>
                <input 
                  type="text" 
                  required
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#C5A065] transition"
                  placeholder={t('recipient_placeholder')}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('amount_ac_label')}</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#C5A065] transition text-lg"
                  placeholder={t('amount_placeholder_ac')}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isTransferring}
                className={`w-full py-4 rounded-full font-bold transition uppercase tracking-wide text-sm ${isTransferring ? 'bg-[#333] text-gray-500 cursor-not-allowed' : 'bg-[#C5A065] text-black hover:bg-[#D4AF37]'}`}
              >
                {isTransferring ? t('processing') : t('confirm_transfer')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {isConvertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="bg-[#111] p-6 sm:p-8 rounded-2xl w-full max-w-md border border-[#C5A065]/20 relative shadow-2xl shadow-[#C5A065]/10 my-auto">
            <button 
              onClick={() => setIsConvertModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition p-2"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-light text-white mb-2">{t('convert_funds')}</h2>
            <div className="h-0.5 w-12 bg-[#C5A065] mb-6"></div>
            
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              {t('convert_hint')}
            </p>
            
            <form onSubmit={handleConvert} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('from_currency')}</label>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setConvertFrom('BRL')}
                    className={`flex-1 py-3 rounded-lg font-bold border ${convertFrom === 'BRL' ? 'bg-[#C5A065] text-black border-[#C5A065]' : 'bg-black text-gray-500 border-white/10'}`}
                  >
                    Real (R$)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConvertFrom('ADAPTA')}
                    className={`flex-1 py-3 rounded-lg font-bold border ${convertFrom === 'ADAPTA' ? 'bg-[#C5A065] text-black border-[#C5A065]' : 'bg-black text-gray-500 border-white/10'}`}
                  >
                    AdaptaCoin
                  </button>
                </div>

                <div className="flex items-center justify-center mb-4 text-gray-500">
                    ⬇️
                </div>

                <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('to_currency')}</label>
                <div className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-white text-center font-bold">
                    {convertFrom === 'BRL' ? 'AdaptaCoin (ADP)' : 'Real (R$)'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('amount_label')}</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  required
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#C5A065] transition text-lg"
                  placeholder="0.00"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isConverting}
                className={`w-full py-4 rounded-full font-bold transition uppercase tracking-wide text-sm ${isConverting ? 'bg-[#333] text-gray-500 cursor-not-allowed' : 'bg-[#C5A065] text-black hover:bg-[#D4AF37]'}`}
              >
                {isConverting ? t('processing') : t('confirm_conversion')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="bg-[#111] p-6 sm:p-8 rounded-2xl w-full max-w-md border border-[#C5A065]/20 relative shadow-2xl shadow-[#C5A065]/10 my-auto">
            <button 
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition p-2"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-light text-white mb-2">{t('request_withdrawal')}</h2>
            <div className="h-0.5 w-12 bg-[#C5A065] mb-6"></div>
            
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              {t('withdraw_pix_hint')}
            </p>
            
            <form onSubmit={handleWithdraw} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('amount_label')} (AC)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#C5A065] transition text-lg"
                  placeholder={t('amount_placeholder_ac')}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">{t('pix_key_label')}</label>
                <input 
                  type="text" 
                  required
                  value={withdrawPixKey}
                  onChange={(e) => setWithdrawPixKey(e.target.value)}
                  className="w-full bg-[#000] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#C5A065] transition"
                  placeholder={t('pix_key_placeholder')}
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isWithdrawing}
                className={`w-full py-4 rounded-full font-bold transition uppercase tracking-wide text-sm ${isWithdrawing ? 'bg-[#333] text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'}`}
              >
                {isWithdrawing ? t('processing') : t('request_withdrawal')}
              </button>
            </form>
          </div>
        </div>
      )}

        {isIntroOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#111] border border-white/10 rounded-2xl max-w-2xl w-full mx-4 p-6 relative">
              <button
                onClick={() => setIsIntroOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4">{t('featured_asset_name')}</h2>
              <p className="text-gray-300 mb-6">
                {t('featured_asset_desc')}
              </p>
              <div className="aspect-video bg-black rounded-xl border border-white/10 flex items-center justify-center text-gray-500 text-sm">
                Vídeo de introdução em breve.
              </div>
            </div>
          </div>
        )}

        {/* Asset Details Modal */}
        {selectedAsset && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setSelectedAsset(null)}>
            <div className="bg-[#111] border border-white/10 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
              
              <h2 className="text-3xl font-light text-[#C5A065] mb-2">{selectedAsset.asset.name}</h2>
              <div className="w-12 h-1 bg-[#C5A065] mb-6"></div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Descrição</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{selectedAsset.asset.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                     <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-bold">Seu Saldo</h3>
                     <p className="text-3xl text-white font-light">{selectedAsset.amount}</p>
                     <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Cotas</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                     <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-bold">Valor Unitário</h3>
                     <p className="text-3xl text-[#C5A065] font-mono">{formatNumber(selectedAsset.asset.referenceValue)}</p>
                     <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">AdaptaCoins</p>
                  </div>
                </div>

                <div className="bg-[#C5A065]/5 border border-[#C5A065]/20 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs uppercase tracking-wider text-[#C5A065] font-bold">Valor Total em Posse</span>
                        <span className="text-xl text-[#C5A065] font-mono font-bold">{formatNumber(selectedAsset.amount * selectedAsset.asset.referenceValue)} AC</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                   <button 
                     onClick={() => setSelectedAsset(null)}
                     className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition uppercase tracking-wide"
                   >
                     Fechar
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
