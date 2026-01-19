
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  mileage: number;
  price: number;
  imageUrl: string;
  category: 'Nacional' | 'Importado';
}

export interface LeadBase {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
}

export interface SellLead extends LeadBase {
  type: 'SELL';
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleMileage: string;
  expectedValue: string;
  observations: string;
}

export interface FinanceLead extends LeadBase {
  type: 'FINANCE';
  cpf: string;
  vehicleValue: string;
  entryValue: string;
  installments: string;
}

export interface InterestLead extends LeadBase {
  type: 'INTEREST';
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
}

export type Lead = SellLead | FinanceLead | InterestLead;

// LeadInput represents a Lead without auto-generated fields (id, date).
// Using a union of Omit is necessary because Omit<Lead, K> would only include keys common to all Lead types.
export type LeadInput = 
  | Omit<SellLead, 'id' | 'date'> 
  | Omit<FinanceLead, 'id' | 'date'> 
  | Omit<InterestLead, 'id' | 'date'>;

export interface AppState {
  vehicles: Vehicle[];
  leads: Lead[];
}
