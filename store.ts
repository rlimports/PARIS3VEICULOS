
import { supabase } from './supabaseClient';
import { Vehicle, Lead, LeadInput } from './types';

// ============== VEHICLES ==============

export const getVehicles = async (): Promise<Vehicle[]> => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }

  return (data || []).map(v => {
    let imageUrls: string[] = [];
    try {
      // Try to parse the image_url as JSON (for multiple images)
      imageUrls = JSON.parse(v.image_url || '[]');
      if (!Array.isArray(imageUrls)) {
        imageUrls = v.image_url ? [v.image_url] : [];
      }
    } catch {
      // Fallback for existing single string image URLs
      imageUrls = v.image_url ? [v.image_url] : [];
    }

    return {
      id: v.id,
      brand: v.brand,
      model: v.model,
      year: v.year,
      mileage: v.mileage,
      price: Number(v.price),
      imageUrls: imageUrls,
      category: v.category as 'Nacional' | 'Importado',
    };
  });
};

export const addVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle | null> => {
  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      mileage: vehicle.mileage,
      price: vehicle.price,
      image_url: JSON.stringify(vehicle.imageUrls),
      category: vehicle.category,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding vehicle:', error);
    return null;
  }

  return {
    id: data.id,
    brand: data.brand,
    model: data.model,
    year: data.year,
    mileage: data.mileage,
    price: Number(data.price),
    imageUrls: JSON.parse(data.image_url || '[]'),
    category: data.category as 'Nacional' | 'Importado',
  };
};

export const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<boolean> => {
  const updateData: Record<string, unknown> = {};
  if (updates.brand !== undefined) updateData.brand = updates.brand;
  if (updates.model !== undefined) updateData.model = updates.model;
  if (updates.year !== undefined) updateData.year = updates.year;
  if (updates.mileage !== undefined) updateData.mileage = updates.mileage;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.imageUrls !== undefined) updateData.image_url = JSON.stringify(updates.imageUrls);
  if (updates.category !== undefined) updateData.category = updates.category;

  const { error } = await supabase
    .from('vehicles')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating vehicle:', error);
    return false;
  }

  return true;
};

export const deleteVehicle = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting vehicle:', error);
    return false;
  }

  return true;
};

// ============== LEADS ==============

export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return (data || []).map(l => {
    const baseLead = {
      id: l.id,
      name: l.name,
      phone: l.phone,
      email: l.email,
      date: l.date,
    };

    if (l.type === 'SELL') {
      return {
        ...baseLead,
        type: 'SELL' as const,
        vehicleBrand: l.vehicle_brand || '',
        vehicleModel: l.vehicle_model || '',
        vehicleYear: l.vehicle_year || '',
        vehicleMileage: l.vehicle_mileage || '',
        expectedValue: l.expected_value || '',
        observations: l.observations || '',
      };
    } else if (l.type === 'FINANCE') {
      return {
        ...baseLead,
        type: 'FINANCE' as const,
        cpf: l.cpf || '',
        vehicleValue: l.vehicle_value || '',
        entryValue: l.entry_value || '',
        installments: l.installments || '',
      };
    } else {
      return {
        ...baseLead,
        type: 'INTEREST' as const,
        vehicleId: l.vehicle_id || '',
        vehicleBrand: l.vehicle_brand || '',
        vehicleModel: l.vehicle_model || '',
      };
    }
  });
};

export const addLead = async (lead: LeadInput): Promise<Lead | null> => {
  const insertData: Record<string, unknown> = {
    type: lead.type,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
  };

  if (lead.type === 'SELL') {
    insertData.vehicle_brand = lead.vehicleBrand;
    insertData.vehicle_model = lead.vehicleModel;
    insertData.vehicle_year = lead.vehicleYear;
    insertData.vehicle_mileage = lead.vehicleMileage;
    insertData.expected_value = lead.expectedValue;
    insertData.observations = lead.observations;
  } else if (lead.type === 'FINANCE') {
    insertData.cpf = lead.cpf;
    insertData.vehicle_value = lead.vehicleValue;
    insertData.entry_value = lead.entryValue;
    insertData.installments = lead.installments;
  } else if (lead.type === 'INTEREST') {
    insertData.vehicle_id = lead.vehicleId;
    insertData.vehicle_brand = lead.vehicleBrand;
    insertData.vehicle_model = lead.vehicleModel;
  }

  const { data, error } = await supabase
    .from('leads')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error adding lead:', error);
    return null;
  }

  const baseLead = {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    date: data.date,
  };

  if (data.type === 'SELL') {
    return {
      ...baseLead,
      type: 'SELL' as const,
      vehicleBrand: data.vehicle_brand || '',
      vehicleModel: data.vehicle_model || '',
      vehicleYear: data.vehicle_year || '',
      vehicleMileage: data.vehicle_mileage || '',
      expectedValue: data.expected_value || '',
      observations: data.observations || '',
    };
  } else if (data.type === 'FINANCE') {
    return {
      ...baseLead,
      type: 'FINANCE' as const,
      cpf: data.cpf || '',
      vehicleValue: data.vehicle_value || '',
      entryValue: data.entry_value || '',
      installments: data.installments || '',
    };
  } else {
    return {
      ...baseLead,
      type: 'INTEREST' as const,
      vehicleId: data.vehicle_id || '',
      vehicleBrand: data.vehicle_brand || '',
      vehicleModel: data.vehicle_model || '',
    };
  }
};

export const deleteLead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lead:', error);
    return false;
  }

  return true;
};
