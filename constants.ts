
import { Vehicle } from './types';

export const COLORS = {
  primary: '#09090b', // Deep Black
  accent: '#89CFF0',  // Baby Blue Metallic
  accentHover: '#78BFDF',
  surface: '#18181b',
};

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: '1',
    brand: 'Porsche',
    model: '911 Carrera S',
    year: '2023',
    mileage: 2500,
    price: 1250000,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    category: 'Importado',
  },
  {
    id: '2',
    brand: 'BMW',
    model: 'M3 Competition',
    year: '2024',
    mileage: 0,
    price: 850000,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
    category: 'Importado',
  },
  {
    id: '3',
    brand: 'Toyota',
    model: 'Hilux SRX Plus',
    year: '2024',
    mileage: 0,
    price: 335000,
    imageUrl: 'https://images.unsplash.com/photo-1621252086475-7b830d1d3658?auto=format&fit=crop&q=80&w=800',
    category: 'Nacional',
  },
  {
    id: '4',
    brand: 'Audi',
    model: 'RS6 Avant',
    year: '2022',
    mileage: 12000,
    price: 1050000,
    imageUrl: 'https://images.unsplash.com/photo-1606148429002-19342cca9591?auto=format&fit=crop&q=80&w=800',
    category: 'Importado',
  }
];
