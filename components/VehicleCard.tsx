
import React from 'react';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onInterest: (v: Vehicle) => void;
  onViewDetails: (v: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onInterest, onViewDetails }) => {
  return (
    <div className="group bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#89CFF0]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(137,207,240,0.1)]">
      <div
        className="relative h-64 overflow-hidden cursor-pointer group/img"
        onClick={() => onViewDetails(vehicle)}
      >
        <img
          src={vehicle.imageUrls[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover transform group-hover/img:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/20 group-hover/img:bg-black/0 transition-colors" />
        <div className="absolute top-4 left-4">
          <span className="bg-[#89CFF0] text-zinc-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {vehicle.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center space-x-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          <span>VER DETALHES</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{vehicle.brand}</h3>
            <h4 className="text-xl font-bold text-white group-hover:text-[#89CFF0] transition-colors">{vehicle.model}</h4>
          </div>
          <p className="text-[#89CFF0] font-extrabold text-lg">
            {vehicle.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>

        <div className="flex items-center space-x-4 text-zinc-500 text-sm mb-6 pb-6 border-b border-zinc-800">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {vehicle.year}
          </div>
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {vehicle.mileage.toLocaleString()} km
          </div>
        </div>

        <button
          onClick={() => onInterest(vehicle)}
          className="w-full bg-zinc-800 text-white py-3 rounded-xl font-bold text-sm group-hover:bg-[#89CFF0] group-hover:text-zinc-950 transition-all duration-300 transform active:scale-95"
        >
          TENHO INTERESSE
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
