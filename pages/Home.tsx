
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VehicleCard from '../components/VehicleCard';
import { getVehicles } from '../store';
import { SellForm, FinanceForm, InterestForm } from '../components/Forms';
import VehicleDetailsModal from '../components/VehicleDetailsModal';
import { EiffelIcon, WhatsAppIcon } from '../components/Icons';
import { Vehicle } from '../types';

const Home: React.FC = () => {
  // ... (keeping existing state and effects unchanged)
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSell, setShowSell] = useState(false);
  const [showFinance, setShowFinance] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<Vehicle | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadVehicles();
  }, []);

  const featuredVehicles = vehicles.slice(0, 4);

  const handleWhatsApp = () => {
    const phone = "5511975866892";
    const message = encodeURIComponent("Olá! Vi o site e gostaria de mais informações.");
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-zinc-950 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover animate-[ken-burns_20s_ease_infinite] brightness-[0.22] contrast-[1.1]"
            alt="Luxury Sedan Background"
          />
          <style>{`
            @keyframes ken-burns {
              0% { transform: scale(1.05); }
              50% { transform: scale(1.15); }
              100% { transform: scale(1.05); }
            }
          `}</style>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-[#89CFF0] rounded-full animate-pulse" />
              <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">Excelência em cada detalhe</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-6 leading-none">
              SEU CARRO NO <br />
              <span className="text-[#89CFF0]">PADRÃO CERTO.</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl border-l-2 border-[#89CFF0]/30 pl-6">
              Negócios rápidos. Carros de alto nível. A maior autoridade em intermediação de veículos premium de São Paulo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              <button
                onClick={() => setShowSell(true)}
                className="group flex-1 bg-[#89CFF0] text-zinc-950 px-8 py-6 rounded-2xl font-black text-lg hover:bg-[#78BFDF] transition-all transform hover:scale-[1.02] flex items-center justify-between space-x-4 shadow-[0_0_30px_rgba(137,207,240,0.3)]"
              >
                <span className="text-left leading-tight">VENDER MEU<br />CARRO</span>
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex-1 bg-white/5 backdrop-blur-md text-white border border-white/10 px-8 py-6 rounded-2xl font-black text-lg hover:bg-white/10 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-3"
              >
                <WhatsAppIcon className="w-6 h-6" />
                <span className="text-left leading-tight uppercase">Chamar<br />WhatsApp</span>
              </button>

              <button
                onClick={() => setShowFinance(true)}
                className="flex-1 bg-white/5 backdrop-blur-md text-white border border-white/10 px-8 py-6 rounded-2xl font-black text-lg hover:bg-white/10 transition-all transform hover:scale-[1.02] flex items-center justify-center"
              >
                FINANCIAMENTO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stock */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#89CFF0] font-bold tracking-[0.3em] text-xs mb-4 block uppercase">Nossa Curadoria</span>
              <h2 className="text-4xl font-extrabold text-white tracking-tight">OFERTAS EM DESTAQUE</h2>
            </div>
            <Link to="/estoque" className="mt-4 md:mt-0 text-zinc-400 hover:text-[#89CFF0] font-bold text-sm flex items-center transition-colors">
              VER TODOS OS VEÍCULOS
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#89CFF0] border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredVehicles.map(v => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  onInterest={setSelectedVehicle}
                  onViewDetails={setSelectedDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section >

      {/* Stats Section */}
      < section className="py-24 bg-zinc-900/50 border-y border-zinc-900" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl font-black text-[#89CFF0] mb-2">+2.5k</div>
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Carros Entregues</div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#89CFF0] mb-2">100%</div>
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Garantia e Procedência</div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#89CFF0] mb-2">R$ 50M</div>
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Em Vendas Anuais</div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#89CFF0] mb-2">24h</div>
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Aprovação de Crédito</div>
            </div>
          </div>
        </div>
      </section >

      <Footer />

      {/* Modals */}
      <SellForm isOpen={showSell} onClose={() => setShowSell(false)} />
      <FinanceForm isOpen={showFinance} onClose={() => setShowFinance(false)} />
      <InterestForm
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        vehicle={selectedVehicle}
      />
      <VehicleDetailsModal
        isOpen={!!selectedDetails}
        onClose={() => setSelectedDetails(null)}
        vehicle={selectedDetails}
        onInterest={setSelectedVehicle}
      />
    </div >
  );
};

export default Home;
