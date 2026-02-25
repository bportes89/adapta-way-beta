'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import { t, useLang } from '../../lib/i18n';

export default function ProfilePage() {
  useLang();
  const { user, updateUser, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [socialName, setSocialName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 2FA State
  const [show2faSetup, setShow2faSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      // Fetch latest profile data
      const response = await api.get('/auth/profile');
      const profile = response.data;
      
      setName(profile.name || '');
      setSocialName(profile.socialName || '');
      setPhotoUrl(profile.photoUrl || '');
      setIs2faEnabled(profile.is2faEnabled || false);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.patch(`/users/${user.id}`, {
        socialName,
        photoUrl
      });
      setMessage('Perfil atualizado com sucesso!');
      updateUser({ socialName, photoUrl }); // Update global context
      fetchProfile(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!user) return;
    try {
      const response = await api.get('/auth/2fa/generate');
      setQrCodeUrl(response.data);
      setShow2faSetup(true);
    } catch (err) {
      console.error('Failed to generate 2FA', err);
      setError('Erro ao gerar QR Code para 2FA');
    }
  };

  const handleConfirm2FA = async () => {
    if (!user) return;
    try {
      await api.post('/auth/2fa/turn-on', { token: twoFactorCode });
      setShow2faSetup(false);
      setIs2faEnabled(true);
      updateUser({ is2faEnabled: true }); // Update global context
      setMessage('Autenticação de 2 Fatores ativada com sucesso!');
      setTwoFactorCode('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Código inválido');
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`/users/${user.id}/upload-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPhotoUrl(response.data.photoUrl);
      updateUser({ photoUrl: response.data.photoUrl });
      setMessage('Foto de perfil atualizada com sucesso!');
    } catch (err: any) {
      console.error(err);
      setError('Erro ao fazer upload da foto.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C5A065] selection:text-black">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 md:px-12 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tighter">Meu Perfil</h1>
        <p className="text-gray-400 mb-12 text-lg">Gerencie suas informações pessoais e segurança.</p>

        {message && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg mb-8">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Photo Section */}
          <div className="md:col-span-1">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <div 
                onClick={handlePhotoClick}
                className="w-32 h-32 rounded-full overflow-hidden bg-[#222] mb-4 border-2 border-[#C5A065] cursor-pointer relative group"
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
                    {name.charAt(0)}
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs font-bold text-white">ALTERAR</span>
                </div>
                
                {/* Loading state */}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#C5A065] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />

              <h2 className="text-xl font-bold text-white mb-1">{socialName || name}</h2>
              <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
              
              <div className="w-full">
                <p className="text-xs text-gray-500">Clique na imagem para alterar sua foto de perfil.</p>
              </div>
            </div>
          </div>

          {/* Edit Form Section */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Personal Info */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-1 h-8 bg-[#C5A065] mr-4 rounded-full"></span>
                Informações Pessoais
              </h3>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    value={name}
                    disabled
                    className="w-full bg-[#000]/50 border border-white/5 rounded-lg p-4 text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C5A065] uppercase tracking-wider mb-2">Nome Social</label>
                  <input 
                    type="text" 
                    value={socialName}
                    onChange={(e) => setSocialName(e.target.value)}
                    className="w-full bg-[#000] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-[#C5A065] transition"
                    placeholder="Como você gostaria de ser chamado"
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-[#C5A065] text-black font-bold px-8 py-3 rounded-full hover:bg-[#D4AF37] transition disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Section */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-1 h-8 bg-[#C5A065] mr-4 rounded-full"></span>
                Segurança
              </h3>

              <div className="flex items-center justify-between p-4 bg-[#000] rounded-xl border border-white/5">
                <div>
                  <h4 className="font-bold text-lg mb-1">Autenticação de Dois Fatores (2FA)</h4>
                  <p className="text-gray-400 text-sm">Adicione uma camada extra de segurança à sua conta.</p>
                </div>
                <div>
                  {is2faEnabled ? (
                    <span className="bg-green-500/20 text-green-500 px-4 py-2 rounded-full text-xs font-bold border border-green-500/20">ATIVADO</span>
                  ) : (
                    <button 
                      onClick={handleEnable2FA}
                      className="bg-[#C5A065]/10 text-[#C5A065] px-6 py-2 rounded-full text-sm font-bold border border-[#C5A065]/20 hover:bg-[#C5A065]/20 transition"
                    >
                      ATIVAR
                    </button>
                  )}
                </div>
              </div>

              {/* 2FA Setup Modal/Area */}
              {show2faSetup && !is2faEnabled && (
                <div className="mt-6 p-6 bg-[#000] rounded-xl border border-[#C5A065]/30 animate-fade-in">
                  <h4 className="font-bold text-[#C5A065] mb-4">Configurar 2FA</h4>
                  <div className="flex flex-col gap-8 items-center text-center">
                    <div className="bg-white p-4 rounded-lg shrink-0 flex items-center justify-center">
                      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code 2FA" className="w-[150px] h-[150px] object-contain" />}
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <p className="text-sm text-gray-300">
                        1. Baixe um aplicativo autenticador (Google Authenticator, Authy, etc).<br/>
                        2. Escaneie o QR Code acima.<br/>
                        3. Digite o código de 6 dígitos gerado pelo aplicativo abaixo.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <input 
                          type="text" 
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value)}
                          placeholder="000000"
                          className="flex-1 bg-[#111] border border-white/20 rounded-lg p-3 text-white text-center tracking-widest text-xl focus:outline-none focus:border-[#C5A065]"
                          maxLength={6}
                        />
                        <button 
                          onClick={handleConfirm2FA}
                          className="bg-[#C5A065] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#D4AF37] transition shrink-0"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
