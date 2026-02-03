
import React, { useState } from 'react';
import { Vehicle } from '../types';

interface VehicleDetailsModalProps {
    vehicle: Vehicle | null;
    isOpen: boolean;
    onClose: () => void;
    onInterest: (v: Vehicle) => void;
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({ vehicle, isOpen, onClose, onInterest }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!isOpen || !vehicle) return null;

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % vehicle.imageUrls.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + vehicle.imageUrls.length) % vehicle.imageUrls.length);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-all border border-white/10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image Section */}
                <div className="relative w-full md:w-2/3 bg-black flex items-center justify-center group overflow-hidden h-[300px] md:h-auto">
                    {vehicle.imageUrls.length > 0 ? (
                        <>
                            <img
                                src={vehicle.imageUrls[currentImageIndex]}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="w-full h-full object-contain"
                            />

                            {vehicle.imageUrls.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-[#89CFF0] hover:text-zinc-950 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-[#89CFF0] hover:text-zinc-950 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                                        {vehicle.imageUrls.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-[#89CFF0] w-6' : 'bg-white/30'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-zinc-700 italic">Sem imagem disponível</div>
                    )}
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-between bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800 overflow-y-auto">
                    <div className="space-y-8">
                        <div>
                            <span className="text-[#89CFF0] font-bold tracking-[0.3em] text-[10px] mb-2 block uppercase">
                                {vehicle.category}
                            </span>
                            <h2 className="text-zinc-400 text-sm font-bold uppercase tracking-widest">{vehicle.brand}</h2>
                            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tighter">
                                {vehicle.model}
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800/50 flex flex-col justify-center">
                                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">Ano</p>
                                <p className="text-white font-black text-xl tracking-tight">{vehicle.year}</p>
                            </div>
                            <div className="bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800/50 flex flex-col justify-center">
                                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">Quilometragem</p>
                                <p className="text-white font-black text-xl tracking-tight leading-tight">
                                    {vehicle.mileage.toLocaleString()} <span className="text-[#89CFF0] text-[10px] ml-0.5">KM</span>
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-zinc-800 pt-8">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1 text-center">Valor do Investimento</p>
                            <p className="text-4xl font-black text-[#89CFF0] text-center tracking-tighter">
                                {vehicle.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={() => { onClose(); onInterest(vehicle); }}
                            className="w-full bg-[#89CFF0] text-zinc-950 py-5 rounded-2xl font-black text-sm hover:bg-[#78BFDF] transition-all transform active:scale-95 shadow-xl shadow-[#89CFF0]/10 uppercase tracking-widest"
                        >
                            Tenho Interesse
                        </button>
                        <p className="text-center text-zinc-600 text-[10px] mt-4 font-bold uppercase tracking-widest">
                            Consultoria exclusiva Paris 3
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsModal;
