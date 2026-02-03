
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getVehicles, getLeads, addVehicle, updateVehicle, deleteVehicle, deleteLead } from '../store';
import { Vehicle, Lead } from '../types';
import { EiffelIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'inventory' | 'leads'>('inventory');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [tempImages, setTempImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const editUrlInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [vehiclesData, leadsData] = await Promise.all([
        getVehicles(),
        getLeads()
      ]);
      setVehicles(vehiclesData);
      setLeads(leadsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin');
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 5 - tempImages.length;
      if (remainingSlots <= 0) {
        alert("Máximo de 5 imagens atingido.");
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      try {
        const base64Promises = (filesToProcess as File[]).map(file => fileToBase64(file));
        const newImages = await Promise.all(base64Promises);
        setTempImages(prev => [...prev, ...newImages]);
      } catch (err) {
        console.error("Erro ao processar imagens:", err);
        alert("Erro ao processar algumas imagens. Tente novamente.");
      }
    }
    // Reset input so the same file can be selected again
    if (e.target) e.target.value = '';
  };

  const handleAddUrl = (inputRef: React.RefObject<HTMLInputElement>) => {
    const url = inputRef.current?.value;
    if (url) {
      if (tempImages.length >= 5) {
        alert("Máximo de 5 imagens atingido.");
        return;
      }
      setTempImages(prev => [...prev, url]);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeTempImage = (index: number) => {
    setTempImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const newVehicle = {
      brand: fd.get('brand') as string,
      model: fd.get('model') as string,
      year: fd.get('year') as string,
      mileage: parseInt(fd.get('mileage') as string) || 0,
      price: parseFloat(fd.get('price') as string) || 0,
      imageUrls: tempImages.length > 0 ? tempImages : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'],
      category: fd.get('category') as 'Nacional' | 'Importado',
    };

    const result = await addVehicle(newVehicle);
    if (result) {
      setVehicles(prev => [result, ...prev]);
      setShowAddModal(false);
      setTempImages([]);
    } else {
      alert('Erro ao cadastrar veículo. Tente novamente.');
    }
  };

  const handleUpdateVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingVehicle) return;
    const fd = new FormData(e.currentTarget);
    const updates = {
      brand: fd.get('brand') as string,
      model: fd.get('model') as string,
      year: fd.get('year') as string,
      mileage: parseInt(fd.get('mileage') as string) || 0,
      price: parseFloat(fd.get('price') as string) || 0,
      imageUrls: tempImages,
      category: fd.get('category') as 'Nacional' | 'Importado',
    };

    const success = await updateVehicle(editingVehicle.id, updates);
    if (success) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...v, ...updates } : v));
      setEditingVehicle(null);
      setTempImages([]);
    } else {
      alert('Erro ao atualizar veículo. Tente novamente.');
    }
  };

  const execDeleteVehicle = async (id: string) => {
    if (window.confirm('EXCLUIR VEÍCULO?\nEsta ação removerá o carro permanentemente do estoque.')) {
      const success = await deleteVehicle(id);
      if (success) {
        setVehicles(prev => prev.filter(v => v.id !== id));
      } else {
        alert('Erro ao remover veículo. Tente novamente.');
      }
    }
  };

  const confirmDeleteLead = async (id: string) => {
    if (window.confirm('Remover este lead?')) {
      const success = await deleteLead(id);
      if (success) {
        setLeads(prev => prev.filter(l => l.id !== id));
      } else {
        alert('Erro ao remover lead. Tente novamente.');
      }
    }
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'SELL': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'FINANCE': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'INTEREST': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  // Show loading while checking auth state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#89CFF0] border-t-transparent"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-zinc-900 border-r border-zinc-800 p-8 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center mb-1">
            <EiffelIcon />
            <h1 className="text-2xl font-black text-white tracking-tighter">
              PARIS <span className="text-[#89CFF0]">3</span>
            </h1>
          </div>
          <p className="text-zinc-600 text-[10px] font-bold mt-1 uppercase tracking-[0.2em]">Painel de Controle</p>
          <p className="text-zinc-500 text-xs mt-2 truncate">{user.email}</p>
        </div>

        <Link to="/" className="flex items-center space-x-3 px-6 py-4 mb-8 rounded-2xl font-bold text-sm text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span>Ir para o Site</span>
        </Link>

        <nav className="flex-1 space-y-3">
          <button type="button" onClick={() => setActiveTab('inventory')} className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'inventory' ? 'bg-[#89CFF0] text-zinc-950' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <span>Gerenciar Estoque</span>
          </button>
          <button type="button" onClick={() => setActiveTab('leads')} className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'leads' ? 'bg-[#89CFF0] text-zinc-950' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <span>Leads Recebidos</span>
          </button>
        </nav>

        <button type="button" onClick={handleLogout} className="mt-auto w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-500/10 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Sair</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            {activeTab === 'inventory' ? 'Controle de Veículos' : 'Gerenciamento de Leads'}
          </h2>
          {activeTab === 'inventory' && (
            <button type="button" onClick={() => { setTempImages([]); setShowAddModal(true); }} className="bg-[#89CFF0] text-zinc-950 px-8 py-4 rounded-2xl font-black text-xs hover:bg-[#78BFDF] transition-all transform active:scale-95 shadow-xl">
              + CADASTRAR VEÍCULO
            </button>
          )}
        </div>

        {activeTab === 'inventory' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map(v => (
              <div key={v.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden group hover:border-[#89CFF0]/30 transition-all duration-300 shadow-lg relative">
                <div className="relative h-56 overflow-hidden">
                  <img src={v.imageUrls[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" alt={v.model} />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 text-white font-bold text-xs uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    {v.imageUrls.length} {v.imageUrls.length === 1 ? 'Foto' : 'Fotos'}
                  </div>
                  <div className="absolute top-4 right-6">
                    <p className="text-[#89CFF0] font-black text-2xl tracking-tighter">
                      {v.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>

                <div className="p-7">
                  <div className="mb-6">
                    <h3 className="text-white font-bold text-xl leading-tight truncate">{v.brand} {v.model}</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                      {v.year} • {v.mileage.toLocaleString()}km • {v.category}
                    </p>
                  </div>

                  {/* AÇÕES - BOTÕES REFORÇADOS */}
                  <div className="flex flex-col space-y-3 relative z-50 pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => { setEditingVehicle(v); setTempImages(v.imageUrls); }}
                      className="w-full flex items-center justify-center space-x-2 bg-zinc-800 text-white hover:bg-zinc-700 py-3 rounded-xl font-bold text-sm transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      <span>EDITAR DADOS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => execDeleteVehicle(v.id)}
                      className="w-full flex items-center justify-center space-x-2 bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white py-4 rounded-xl font-black text-sm transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      <span>REMOVER VEÍCULO</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {vehicles.length === 0 && (
              <div className="col-span-full py-32 text-center bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                <p className="text-zinc-500 font-bold">Nenhum veículo no estoque.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map(lead => (
              <div key={lead.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex justify-between items-center hover:border-zinc-700 transition-colors">
                <div className="flex items-center space-x-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${getBadgeClass(lead.type)}`}>
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{lead.name}</h3>
                    <p className="text-zinc-500 text-sm font-medium">{lead.phone} • <span className="text-zinc-600">{lead.type}</span></p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => confirmDeleteLead(lead.id)}
                  className="bg-zinc-800 p-4 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="py-32 text-center bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                <p className="text-zinc-500 font-bold">Nenhum lead recebido.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Adicionar */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-black text-white mb-8">Novo Veículo</h2>
            <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 mb-2 block">Imagens do Veículo (Máx 5)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {tempImages.map((img, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden group/img">
                      <img src={img} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                      <button type="button" onClick={() => removeTempImage(index)} className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform opacity-0 group-hover/img:opacity-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  {tempImages.length < 5 && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center aspect-video bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl hover:border-[#89CFF0]/50 transition-all group">
                      <svg className="w-8 h-8 text-zinc-600 group-hover:text-[#89CFF0] mb-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      <span className="text-zinc-500 font-bold text-[10px]">ADD FOTO</span>
                    </button>
                  )}
                </div>
                {tempImages.length < 5 && (
                  <div className="flex gap-2">
                    <input ref={urlInputRef} placeholder="Ou cole a URL de uma imagem..." className="flex-1 bg-zinc-800 border-none rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-[#89CFF0]" />
                    <button type="button" onClick={() => handleAddUrl(urlInputRef)} className="bg-zinc-700 text-white px-4 rounded-xl font-bold text-xs hover:bg-zinc-600">ADD</button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              </div>
              <input name="brand" required placeholder="Marca" className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="model" required placeholder="Modelo" className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="year" required placeholder="Ano" className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="mileage" type="number" required placeholder="KM" className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="price" type="number" required placeholder="Preço (Ex: 850000)" className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]" />
              <select name="category" className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white appearance-none focus:ring-2 focus:ring-[#89CFF0]">
                <option value="Nacional">Nacional</option>
                <option value="Importado">Importado</option>
              </select>
              <div className="md:col-span-2 flex space-x-4 mt-8">
                <button type="submit" className="flex-1 bg-[#89CFF0] text-zinc-950 font-black py-5 rounded-2xl shadow-lg hover:bg-[#78BFDF] transition-all transform active:scale-95">SALVAR VEÍCULO</button>
                <button type="button" onClick={() => { setShowAddModal(false); setTempImages([]); }} className="flex-1 bg-zinc-800 text-white font-black py-5 rounded-2xl">VOLTAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {editingVehicle && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-black text-white mb-8">Editar Veículo</h2>
            <form onSubmit={handleUpdateVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 mb-2 block">Imagens do Veículo (Máx 5)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {tempImages.map((img, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden group/img">
                      <img src={img} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                      <button type="button" onClick={() => removeTempImage(index)} className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform opacity-0 group-hover/img:opacity-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  {tempImages.length < 5 && (
                    <button type="button" onClick={() => editFileInputRef.current?.click()} className="flex flex-col items-center justify-center aspect-video bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl hover:border-[#89CFF0]/50 transition-all group">
                      <svg className="w-8 h-8 text-zinc-600 group-hover:text-[#89CFF0] mb-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      <span className="text-zinc-500 font-bold text-[10px]">ADD FOTO</span>
                    </button>
                  )}
                </div>
                {tempImages.length < 5 && (
                  <div className="flex gap-2">
                    <input ref={editUrlInputRef} placeholder="Adicionar URL..." className="flex-1 bg-zinc-800 border-none rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-[#89CFF0]" />
                    <button type="button" onClick={() => handleAddUrl(editUrlInputRef)} className="bg-zinc-700 text-white px-4 rounded-xl font-bold text-xs hover:bg-zinc-600">ADD</button>
                  </div>
                )}
                <input ref={editFileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              </div>
              <input name="brand" required defaultValue={editingVehicle.brand} className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="model" required defaultValue={editingVehicle.model} className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="year" required defaultValue={editingVehicle.year} className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="mileage" type="number" required defaultValue={editingVehicle.mileage} className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="price" type="number" required defaultValue={editingVehicle.price} className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]" />
              <select name="category" defaultValue={editingVehicle.category} className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0]">
                <option value="Nacional">Nacional</option>
                <option value="Importado">Importado</option>
              </select>
              <div className="md:col-span-2 flex space-x-4 mt-8">
                <button type="submit" className="flex-1 bg-[#89CFF0] text-zinc-950 font-black py-5 rounded-2xl shadow-lg hover:bg-[#78BFDF] transition-all transform active:scale-95">ATUALIZAR DADOS</button>
                <button type="button" onClick={() => { setEditingVehicle(null); setTempImages([]); }} className="flex-1 bg-zinc-800 text-white font-black py-5 rounded-2xl">VOLTAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
