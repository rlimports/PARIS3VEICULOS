
import React, { useState } from 'react';
import { addLead } from '../store';
import { Vehicle } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-[#89CFF0]">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const SellForm: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);

    try {
      const result = await addLead({
        type: 'SELL',
        name: fd.get('name') as string,
        email: fd.get('email') as string,
        phone: fd.get('phone') as string,
        vehicleBrand: fd.get('brand') as string,
        vehicleModel: fd.get('model') as string,
        vehicleYear: fd.get('year') as string,
        vehicleMileage: fd.get('mileage') as string,
        expectedValue: fd.get('value') as string,
        observations: fd.get('obs') as string,
      });

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      } else {
        alert('Erro ao enviar. Tente novamente.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="VENDER MEU CARRO">
      {success ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sucesso!</h3>
          <p className="text-zinc-400">Sua avaliação foi enviada. Entraremos em contato em breve.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <input name="name" required placeholder="Nome Completo" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
            <div className="grid grid-cols-2 gap-4">
              <input name="phone" required placeholder="Telefone / WhatsApp" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="email" type="email" required placeholder="E-mail" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="brand" required placeholder="Marca do Veículo" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="model" required placeholder="Modelo" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <input name="year" required placeholder="Ano" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="mileage" required placeholder="KM" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="value" required placeholder="Valor Pretendido" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
            </div>
            <textarea name="obs" rows={3} placeholder="Observações adicionais" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#89CFF0] text-zinc-950 font-black py-4 rounded-xl hover:bg-[#78BFDF] transition-all transform active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'ENVIANDO...' : 'ENVIAR PARA AVALIAÇÃO'}
          </button>
        </form>
      )}
    </Modal>
  );
};

export const FinanceForm: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);

    try {
      const result = await addLead({
        type: 'FINANCE',
        name: fd.get('name') as string,
        email: fd.get('email') as string,
        phone: fd.get('phone') as string,
        cpf: fd.get('cpf') as string,
        vehicleValue: fd.get('vValue') as string,
        entryValue: fd.get('eValue') as string,
        installments: fd.get('installments') as string,
      });

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      } else {
        alert('Erro ao enviar. Tente novamente.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SOLICITAR FINANCIAMENTO">
      {success ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Solicitação Enviada!</h3>
          <p className="text-zinc-400">Nossa equipe de crédito analisará seu perfil e retornará em breve.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <input name="name" required placeholder="Nome Completo" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
            <input name="cpf" required placeholder="CPF" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
            <div className="grid grid-cols-2 gap-4">
              <input name="phone" required placeholder="Telefone / WhatsApp" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="email" type="email" required placeholder="E-mail" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="vValue" required placeholder="Valor do Veículo" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
              <input name="eValue" required placeholder="Valor de Entrada" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
            </div>
            <select name="installments" className="bg-zinc-800 border-none rounded-xl p-3 text-white focus:ring-2 focus:ring-[#89CFF0]">
              <option value="12">12 Parcelas</option>
              <option value="24">24 Parcelas</option>
              <option value="36">36 Parcelas</option>
              <option value="48">48 Parcelas</option>
              <option value="60">60 Parcelas</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#89CFF0] text-zinc-950 font-black py-4 rounded-xl hover:bg-[#78BFDF] transition-all transform active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'ENVIANDO...' : 'SOLICITAR ANÁLISE DE CRÉDITO'}
          </button>
        </form>
      )}
    </Modal>
  );
};

export const InterestForm: React.FC<{ isOpen: boolean; onClose: () => void; vehicle: Vehicle | null }> = ({ isOpen, onClose, vehicle }) => {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!vehicle) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);

    try {
      const result = await addLead({
        type: 'INTEREST',
        name: fd.get('name') as string,
        email: fd.get('email') as string,
        phone: fd.get('phone') as string,
        vehicleId: vehicle.id,
        vehicleBrand: vehicle.brand,
        vehicleModel: vehicle.model,
      });

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      } else {
        alert('Erro ao enviar. Tente novamente.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`INTERESSE: ${vehicle.model}`}>
      {success ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Recebemos seu contato!</h3>
          <p className="text-zinc-400">Um consultor entrará em contato com você via WhatsApp em instantes.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Veículo Selecionado</p>
            <p className="text-white font-bold">{vehicle.brand} {vehicle.model} - {vehicle.year}</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <input name="name" required placeholder="Seu Nome" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
            <input name="phone" required placeholder="Seu WhatsApp" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
            <input name="email" type="email" required placeholder="Seu E-mail" className="bg-zinc-800 border-none rounded-xl p-3 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#89CFF0]" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#89CFF0] text-zinc-950 font-black py-4 rounded-xl hover:bg-[#78BFDF] transition-all transform active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'ENVIANDO...' : 'QUERO SABER MAIS'}
          </button>
        </form>
      )}
    </Modal>
  );
};
