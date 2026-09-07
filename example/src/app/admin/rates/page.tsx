import { createAdminClient } from '@/lib/supabase';
import { RatesEditor } from './RatesEditor';
import type { RateRow } from './actions';

interface Props {
  searchParams: Promise<{ type?: string; group?: string; duration?: string }>;
}

export default async function RatesPage({ searchParams }: Props) {
  const sp = await searchParams;

  const travelType = sp.type  === 'hajj'    ? 'hajj'    : 'umrah';
  const groupType  = sp.group === 'private' ? 'private' : 'group';
  const duration   = [10, 14, 21, 30].includes(Number(sp.duration)) ? Number(sp.duration) : 14;

  // Fetch existing rates for this combination from Supabase
  let rates: RateRow[] = [];
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from('hajj_umrah_rates')
      .select('travel_type, zone, comfort_level, duration_days, group_type, price_per_person')
      .eq('travel_type', travelType)
      .eq('group_type', groupType)
      .eq('duration_days', duration);

    if (!error && data) rates = data as RateRow[];
  } catch {
    // Supabase not yet configured — editor shows empty grid, save will fail gracefully
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-7">
        <h1 className="text-[1.6rem] font-bold text-[#1C2B3A]">Daily Rates</h1>
        <p className="text-[15px] text-[#8B9FAE] mt-1">
          Set per-person prices for each zone and comfort level. These override the automatic estimates shown to customers.
        </p>
      </div>

      <RatesEditor
        initialRates={rates}
        travelType={travelType}
        groupType={groupType}
        duration={duration}
      />
    </div>
  );
}
