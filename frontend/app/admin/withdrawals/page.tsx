'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { t } from '../../../lib/i18n';

export default function AdminWithdrawalsPage() {
  const { user, loading: authLoading } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchWithdrawals();
    }
  }, [user]);

  const fetchWithdrawals = async () => {
    try {
      const response = await api.get('/wallet/admin/withdrawals');
      setWithdrawals(response.data);
    } catch (error) {
      console.error('Failed to fetch withdrawals', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/wallet/admin/withdrawals/${id}/approve`);
      setMessage('Saque aprovado com sucesso');
      fetchWithdrawals();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Falha ao aprovar saque');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Tem certeza que deseja rejeitar este saque? O valor será estornado.')) return;
    try {
      await api.post(`/wallet/admin/withdrawals/${id}/reject`);
      setMessage('Saque rejeitado com sucesso');
      fetchWithdrawals();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Falha ao rejeitar saque');
    }
  };

  if (authLoading || loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">{t('loading')}</div>;
  if (user?.role !== 'admin') return <div className="min-h-screen bg-black text.white flex items-center justify.center font-sans">{t('access_denied')}</div>;

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans">
      <Navbar />

      <div className="pt-24 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div>
             <h1 className="text-4xl font-light text-white tracking-wide">{t('review_withdrawals')}</h1>
             <p className="text-gray-400 mt-2 text-sm">{t('withdrawals_header_desc')}</p>
          </div>
          <Link href="/admin" className="text-[#C5A065] hover:text-[#D4AF37] transition text-sm uppercase tracking-wider font-bold">{t('back_to_admin')}</Link>
        </div>

        {message && <div className="bg-[#C5A065]/20 border border-[#C5A065] text-[#C5A065] p-4 rounded mb-6 text-sm">{message}</div>}

        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-black">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#C5A065] uppercase tracking-wider">Data</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#C5A065] uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#C5A065] uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#C5A065] uppercase tracking-wider">Chave PIX</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#C5A065] uppercase tracking-wider">{t('status_col')}</th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-[#C5A065] uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-[#111] divide-y divide-white/5">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Nenhum saque pendente.</td>
                  </tr>
                ) : (
                  withdrawals.map((w: any) => (
                    <tr key={w.id} className="hover:bg-white/5 transition duration-200">
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                        {new Date(w.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-white">
                        {w.user?.email}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-[#C5A065] font-bold font-mono">
                        R$ {Number(w.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 font-mono">
                        {w.pixKey}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-bold uppercase tracking-wider rounded-full border ${
                            w.status === 'pending' ? 'bg-yellow-900/10 text-yellow-500 border-yellow-500/20' :
                            w.status === 'approved' ? 'bg-green-900/10 text-green-500 border-green-500/20' :
                            'bg-red-900/10 text-red-500 border-red-500/20'
                        }`}>
                          {w.status === 'pending' ? 'pendente' : w.status === 'approved' ? 'aprovado' : 'rejeitado'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button 
                          onClick={() => handleApprove(w.id)}
                          className="text-black bg-[#C5A065] hover:bg-[#D4AF37] px-4 py-2 rounded-full transition text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#C5A065]/10"
                        >
                          {t('approve')}
                        </button>
                        <button 
                          onClick={() => handleReject(w.id)}
                          className="text-red-500 bg-transparent border border-red-500/50 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full transition text-xs font-bold uppercase tracking-wider"
                        >
                          {t('reject')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
