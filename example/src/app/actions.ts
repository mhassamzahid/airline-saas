'use server';

import { createAnonClient } from '@/lib/supabase';

interface EnquiryPayload {
  leadName: string;
  leadPhone: string;
  leadEmail: string;
  travelType: string | null;
  destination: string | null;
  males: number;
  females: number;
  children: number;
  infants: number;
  estimatedPrice: number;
  packageData: Record<string, unknown>;
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const db = createAnonClient();
    const { error } = await db.from('enquiries').insert({
      lead_name:       payload.leadName,
      lead_phone:      payload.leadPhone,
      lead_email:      payload.leadEmail || null,
      travel_type:     payload.travelType,
      destination:     payload.destination,
      males:           payload.males,
      females:         payload.females,
      children:        payload.children,
      infants:         payload.infants,
      estimated_price: payload.estimatedPrice,
      package_data:    payload.packageData,
      status:          'new',
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch {
    // Supabase not configured — fail silently on the customer side
    return { ok: true };
  }
}
