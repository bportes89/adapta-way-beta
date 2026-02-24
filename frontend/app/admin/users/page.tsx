'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { t, useLang } from '../../../lib/i18n';

export default function AdminUsersPage() {
  useLang();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceAction, setBalanceAction] = useState<'mint' | 'burn'>('mint');
  const [processingBalance, setProcessingBalance] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user, page, debouncedSearch]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users', {
        params: {
          page,
          limit: 10,
          search: debouncedSearch
        }
      });
      // Handle both old array format and new paginated format for backward compatibility if needed
      if (Array.isArray(response.data)) {
         setUsers(response.data);
         setTotalPages(1);
      } else {
         setUsers(response.data.data);
         setTotalPages(response.data.meta.last_page);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    if (!confirm(`Are you sure you want to ${newStatus} this user?`)) return;
    
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  const handleManageBalance = (user: any) => {
    setSelectedUser(user);
    setBalanceAmount('');
    setBalanceAction('mint');
    setIsBalanceModalOpen(true);
  };

  const confirmBalanceAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !balanceAmount || Number(balanceAmount) <= 0) {
      alert(t('valid_amount'));
      return;
    }

    setProcessingBalance(true);
    try {
      if (balanceAction === 'mint') {
        await api.post('/wallet/admin/mint', {
          userId: selectedUser.id,
          amount: Number(balanceAmount)
        });
        alert('AdaptaCoins emitidos com sucesso!');
      } else {
        await api.post('/wallet/admin/burn', {
          userId: selectedUser.id,
          amount: Number(balanceAmount)
        });
        alert('AdaptaCoins queimados com sucesso!');
      }
      setIsBalanceModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to update balance', error);
      alert(error.response?.data?.message || 'Falha na operação');
    } finally {
      setProcessingBalance(false);
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
             <h1 className="text-4xl font-light text-white tracking-wide">{t('manage_users')}</h1>
             <p className="text-gray-400 mt-2 text-sm">{t('users_header_desc')}</p>
          </div>
          <Link href="/admin" className="text-[#C5A065] hover:text-[#D4AF37] transition text-sm uppercase tracking-wider font-bold">{t('back_to_admin')}</Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={t('search_placeholder') || 'Buscar por nome ou email...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A065] transition"
          />
        </div>

        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-black">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#C5A065] uppercase tracking-wider">{t('name_col')}</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#C5A065] uppercase tracking-wider">{t('email_col')}</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#C5A065] uppercase tracking-wider">{t('role_col')}</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#C5A065] uppercase tracking-wider">2FA</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-[#C5A065] uppercase tracking-wider">{t('status_col')}</th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-[#C5A065] uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-[#111] divide-y divide-white/5">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-white/5 transition duration-200">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-white">{u.name}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">{u.email}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 uppercase tracking-wide text-xs">{u.role}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                        {u.is2faEnabled ? (
                            <span className="text-green-500 flex items-center text-xs uppercase tracking-wider"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Ativo</span>
                        ) : (
                            <span className="text-gray-600 flex items-center text-xs uppercase tracking-wider"><span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>Desativado</span>
                        )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-bold uppercase tracking-wider rounded-full border ${
                        u.status === 'blocked' ? 'bg-red-900/10 text-red-500 border-red-500/20' : 'bg-green-900/10 text-green-500 border-green-500/20'
                      }`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleManageBalance(u)}
                        className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#C5A065]/10 text-[#C5A065] border border-[#C5A065]/30 hover:bg-[#C5A065] hover:text-black transition"
                      >
                        Gerenciar AC
                      </button>
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleToggleStatus(u.id, u.status || 'active')}
                          className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition ${
                            u.status === 'blocked' ? 'bg-green-600 text-black hover:bg-green-500' : 'bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {u.status === 'blocked' ? 'Desbloquear Usuário' : 'Bloquear Acesso'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 bg-[#222] text-white rounded-lg disabled:opacity-50 hover:bg-[#333] transition"
          >
            Anterior
          </button>
          <span className="text-gray-400">
            Página <span className="text-white font-bold">{page}</span> de <span className="text-white font-bold">{totalPages}</span>
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 bg-[#222] text-white rounded-lg disabled:opacity-50 hover:bg-[#333] transition"
          >
            Próxima
          </button>
        </div>

        {/* Balance Modal */}
        {isBalanceModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4">
            <div className="bg-[#111] p-8 rounded-2xl w-full max-w-md border border-[#C5A065]/20 relative shadow-2xl">
              <button 
                onClick={() => setIsBalanceModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-light text-white mb-2">Gerenciar AdaptaCoins</h2>
              <div className="text-sm text-gray-400 mb-6">Usuário: <span className="text-[#C5A065]">{selectedUser.name}</span></div>
              
              <form onSubmit={confirmBalanceAction} className="space-y-6">
                <div className="flex space-x-4 mb-4">
                    <button
                        type="button"
                        onClick={() => setBalanceAction('mint')}
                        className={`flex-1 py-3 rounded-lg font-bold border transition ${balanceAction === 'mint' ? 'bg-[#C5A065] text-black border-[#C5A065]' : 'bg-black text-gray-500 border-white/10'}`}
                    >
                        Emitir (Mint)
                    </button>
                    <button
                        type="button"
                        onClick={() => setBalanceAction('burn')}
                        className={`flex-1 py-3 rounded-lg font-bold border transition ${balanceAction === 'burn' ? 'bg-red-900/20 text-red-500 border-red-500/50' : 'bg-black text-gray-500 border-white/10'}`}
                    >
                        Queimar (Burn)
                    </button>
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">Quantidade (AC)</label>
                    <input 
                        type="number" 
                        step="0.01"
                        min="0.01"
                        required
                        value={balanceAmount}
                        onChange={(e) => setBalanceAmount(e.target.value)}
                        className="w-full bg-[#000] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#C5A065] transition text-lg"
                        placeholder="0.00"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={processingBalance}
                    className={`w-full py-4 rounded-full font-bold transition uppercase tracking-wide text-sm ${processingBalance ? 'bg-[#333] text-gray-500 cursor-not-allowed' : balanceAction === 'mint' ? 'bg-[#C5A065] text-black hover:bg-[#D4AF37]' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                    {processingBalance ? 'Processando...' : balanceAction === 'mint' ? 'Confirmar Emissão' : 'Confirmar Queima'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
