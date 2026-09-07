import { createAdminClient } from '@/lib/supabase';
import { format } from 'date-fns';
import { updateStatusAction } from './actions';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  new:       'bg-blue-50  text-blue-700  border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  booked:    'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50   text-red-500   border-red-200',
};

function formatPKR(n: number) {
  return 'PKR ' + Math.round(n).toLocaleString('en-PK');
}

export default async function EnquiriesPage() {
  let enquiries: any[] = [];

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) enquiries = data;
  } catch {
    // Supabase not configured yet
  }

  return (
    <div className="p-8">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-[1.6rem] font-bold text-[#1C2B3A]">Enquiries</h1>
          <p className="text-[15px] text-[#8B9FAE] mt-1">
            {enquiries.length} total · {enquiries.filter((e) => e.status === 'new').length} new
          </p>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] p-16 text-center">
          <p className="text-[#8B9FAE] text-[16px]">No enquiries yet. Form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((enq) => {
            const total = (enq.males ?? 0) + (enq.females ?? 0) + (enq.children ?? 0);
            return (
              <div
                key={enq.id}
                className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden"
              >
                <div className="p-5 flex flex-wrap items-start gap-4">
                  {/* Status badge */}
                  <span className={cn('text-[12px] font-bold px-3 py-1 rounded-full border capitalize shrink-0', STATUS_STYLES[enq.status] ?? STATUS_STYLES.new)}>
                    {enq.status}
                  </span>

                  {/* Core info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <p className="font-bold text-[16px] text-[#1C2B3A]">{enq.lead_name || 'Unknown'}</p>
                      <a href={`tel:${enq.lead_phone}`} className="text-[14px] text-[#C9A84C] font-semibold hover:underline">
                        {enq.lead_phone}
                      </a>
                      {enq.lead_email && (
                        <a href={`mailto:${enq.lead_email}`} className="text-[13px] text-[#8B9FAE] hover:underline">
                          {enq.lead_email}
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[13px] text-[#52697A]">
                      {enq.travel_type && <span className="capitalize font-medium">{enq.travel_type}</span>}
                      {enq.destination  && <span>📍 {enq.destination}</span>}
                      {total > 0        && <span>👥 {total} travelers</span>}
                      {enq.estimated_price > 0 && (
                        <span className="font-semibold text-[#7A5C10]">{formatPKR(enq.estimated_price)}</span>
                      )}
                    </div>
                  </div>

                  {/* Date + status select */}
                  <div className="shrink-0 text-right space-y-2">
                    <p className="text-[12px] text-[#8B9FAE]">
                      {enq.created_at ? format(new Date(enq.created_at), 'dd MMM yyyy, hh:mm a') : '—'}
                    </p>

                    {/* Status changer — form auto-submits on select change */}
                    <form action={updateStatusAction}>
                      <input type="hidden" name="id" value={enq.id} />
                      <select
                        name="status"
                        defaultValue={enq.status}
                        onChange={(e) => (e.target as HTMLSelectElement).form?.requestSubmit()}
                        className="text-[13px] font-medium border border-[rgba(0,0,0,0.10)] rounded-lg px-3 py-1.5 bg-white text-[#1C2B3A] focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="booked">Booked</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </form>
                  </div>
                </div>

                {/* WhatsApp quick link */}
                {enq.lead_phone && (
                  <div className="px-5 pb-4">
                    <a
                      href={`https://wa.me/92${enq.lead_phone.replace(/^0/, '')}?text=${encodeURIComponent(`Hi ${enq.lead_name ?? ''}, regarding your Travocom travel enquiry...`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp {enq.lead_name?.split(' ')[0]}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
