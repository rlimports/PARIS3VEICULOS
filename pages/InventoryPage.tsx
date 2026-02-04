
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VehicleCard from '../components/VehicleCard';
import { getVehicles } from '../store';
import { InterestForm } from '../components/Forms';
import VehicleDetailsModal from '../components/VehicleDetailsModal';
import { Vehicle } from '../types';

const InventoryPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'Tudo' | 'Nacional' | 'Importado'>('Tudo');
  const [search, setSearch] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<Vehicle | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadVehicles = async () => {
      try {
        const data = await getVehicles();
        if (isMounted) {
          setVehicles(data);
        }
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadVehicles();
    return () => { isMounted = false; };
  }, []);

  // Memoize filtered vehicles
  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return vehicles.filter(v => {
      const matchesCategory = filter === 'Tudo' || v.category === filter;
      const matchesSearch =
        v.brand.toLowerCase().includes(searchLower) ||
        v.model.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [vehicles, filter, search]);

  const handleClearFilters = useCallback(() => {
    setFilter('Tudo');
    setSearch('');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">ESTOQUE COMPLETO</h1>
              <div className="flex flex-wrap gap-4">
                {(['Tudo', 'Nacional', 'Importado'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${filter === f
                      ? 'bg-[#89CFF0] text-zinc-950 shadow-[0_0_20px_rgba(137,207,240,0.4)]'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700'
                      }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Pesquisar marca ou modelo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-[#89CFF0] transition-all"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#89CFF0] border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map(v => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    onInterest={setSelectedVehicle}
                    onViewDetails={setSelectedDetails}
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="py-32 text-center">
                  <div className="mb-6 inline-flex p-6 bg-zinc-900 rounded-full border border-zinc-800">
                    <svg className="w-12 h-12 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl text-zinc-500 font-bold">Nenhum veículo encontrado com esses critérios.</h3>
                  <button onClick={handleClearFilters} className="mt-4 text-[#89CFF0] font-bold hover:underline">Limpar filtros</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
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
    </div>
  );
};

export default InventoryPage;
