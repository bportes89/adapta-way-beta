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

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
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
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
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
      </div>
    </div>
  );
}
