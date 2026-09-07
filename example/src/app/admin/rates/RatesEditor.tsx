'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { saveRatesAction, type RateRow } from './actions';
import { cn } from '@/lib/utils';

const ZONES = [
  { id: 'walking_5',  label: 'Within 5-min walk',  sub: 'Right next to Haram' },
  { id: 'walking_15', label: '10–15-min walk',      sub: 'Close & comfortable' },
  { id: 'shuttle',    label: 'Shuttle distance',    sub: '1–2 km, bus included' },
  { id: 'bus',        label: 'Bus route',           sub: '2–4 km, public transport' },
];

const COMFORT = [
  { id: 'basic',       label: 'Basic',   sub: '2–3★'  },
  { id: 'comfortable', label: 'Comfort', sub: '4★'    },
  { id: 'premium',     label: 'Premium', sub: '5★'    },
  { id: 'luxury',      label: 'Luxury',  sub: '5★ DX' },
];

const DURATIONS = [10, 14, 21, 30];
const ROWS = ZONES.length;
const COLS = COMFORT.length;

// Zone aliases accepted in imported CSV (human-friendly names → id)
const ZONE_ALIASES: Record<string, string> = {
  walking_5: 'walking_5', '5min': 'walking_5', '5 min': 'walking_5', 'within 5': 'walking_5', 'haram': 'walking_5',
  walking_15: 'walking_15', '15min': 'walking_15', '15 min': 'walking_15', 'close': 'walking_15',
  shuttle: 'shuttle', 'shuttle distance': 'shuttle', 'hotel bus': 'shuttle',
  bus: 'bus', 'bus route': 'bus', 'public transport': 'bus',
};

type RateMap = Record<string, Record<string, number>>;

function buildMap(rows: RateRow[]): RateMap {
  const m: RateMap = {};
  for (const r of rows) {
    if (!m[r.zone]) m[r.zone] = {};
    m[r.zone][r.comfort_level] = Number(r.price_per_person);
  }
  return m;
}

function buildRawFromMap(map: RateMap): Record<string, string> {
  const out: Record<string, string> = {};
  for (const z of ZONES)
    for (const c of COMFORT) {
      const v = map[z.id]?.[c.id];
      out[`${z.id}:${c.id}`] = v ? String(v) : '';
    }
  return out;
}

// ── CSV helpers ────────────────────────────────────────────
function toCSV(map: RateMap, travelType: string, groupType: string, duration: number): string {
  const header = `# Travocom rates — ${travelType} · ${groupType} · ${duration} days`;
  const cols   = `zone,${COMFORT.map((c) => c.id).join(',')}`;
  const rows   = ZONES.map((z) =>
    [z.id, ...COMFORT.map((c) => String(map[z.id]?.[c.id] ?? 0))].join(',')
  );
  return [header, cols, ...rows].join('\n');
}

interface ParseResult {
  map: RateMap;
  errors: string[];
  warnings: string[];
}

function parseCSV(text: string): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const map: RateMap = {};

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  if (lines.length === 0) { errors.push('File is empty'); return { map, errors, warnings }; }

  // Parse header row
  const headerCells = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const zoneColIdx  = headerCells.indexOf('zone');
  if (zoneColIdx === -1) { errors.push('No "zone" column found in header row'); return { map, errors, warnings }; }

  // Map comfort column positions
  const comfortCols: { comfortId: string; colIdx: number }[] = [];
  for (const c of COMFORT) {
    const idx = headerCells.indexOf(c.id);
    if (idx !== -1) comfortCols.push({ comfortId: c.id, colIdx: idx });
    else warnings.push(`Column "${c.id}" not found — skipped`);
  }
  if (comfortCols.length === 0) { errors.push('No comfort level columns found'); return { map, errors, warnings }; }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const cells  = lines[i].split(',').map((c) => c.trim());
    const rawZone = cells[zoneColIdx]?.toLowerCase() ?? '';
    const zoneId  = ZONE_ALIASES[rawZone];
    if (!zoneId) { warnings.push(`Row ${i + 1}: unknown zone "${cells[zoneColIdx]}" — skipped`); continue; }
    if (!map[zoneId]) map[zoneId] = {};
    for (const { comfortId, colIdx } of comfortCols) {
      const raw = cells[colIdx]?.replace(/[^0-9]/g, '') ?? '';
      map[zoneId][comfortId] = raw === '' ? 0 : parseInt(raw, 10);
    }
  }

  return { map, errors, warnings };
}

// ── Import modal ───────────────────────────────────────────
interface ImportModalProps {
  onApply: (map: RateMap) => void;
  onClose: () => void;
  currentMap: RateMap;
  travelType: string;
  groupType: string;
  duration: number;
}

function ImportModal({ onApply, onClose, currentMap, travelType, groupType, duration }: ImportModalProps) {
  const [text,    setText]    = useState('');
  const [result,  setResult]  = useState<ParseResult | null>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  const TEMPLATE = toCSV(currentMap, travelType, groupType, duration);

  function handleParse() {
    const r = parseCSV(text);
    setResult(r);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const t = ev.target?.result as string;
      setText(t);
      const r = parseCSV(t);
      setResult(r);
    };
    reader.readAsText(file);
  }

  function handleApply() {
    if (result && result.errors.length === 0) { onApply(result.map); onClose(); }
  }

  const canApply = result && result.errors.length === 0 && Object.keys(result.map).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-[rgba(0,0,0,0.08)] flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.07)]">
          <div>
            <h2 className="text-[17px] font-bold text-[#1C2B3A]">Import CSV</h2>
            <p className="text-[13px] text-[#8B9FAE] mt-0.5">Paste or upload a CSV file to bulk-fill the rate grid</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8B9FAE] hover:bg-[#F3F0EA] hover:text-[#1C2B3A] transition-colors text-[18px] leading-none">×</button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Template download */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8F5F0] border border-[rgba(0,0,0,0.07)]">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1C2B3A]">Expected format</p>
              <p className="text-[12px] text-[#8B9FAE] font-mono mt-0.5 truncate">
                zone, basic, comfortable, premium, luxury
              </p>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([TEMPLATE], { type: 'text/csv' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `travocom-rates-${travelType}-${groupType}-${duration}d.csv`;
                a.click();
              }}
              className="shrink-0 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.10)] text-[12px] font-semibold text-[#52697A] hover:bg-white transition-colors"
            >
              Download template
            </button>
          </div>

          {/* Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#8B9FAE]">Paste CSV here</label>
              <label className="text-[12px] font-semibold text-[#C9A84C] cursor-pointer hover:underline">
                or pick a file
                <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} className="hidden" />
              </label>
            </div>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setResult(null); }}
              placeholder={TEMPLATE}
              rows={8}
              className="w-full font-mono text-[12px] text-[#1C2B3A] placeholder-[#C8C0B4] bg-[#FAFAF8] border border-[rgba(0,0,0,0.09)] rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)] transition-all"
            />
          </div>

          {/* Parse result */}
          {result && (
            <div className="space-y-2">
              {result.errors.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 space-y-1">
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-[13px] text-red-600 font-medium">✕ {e}</p>
                  ))}
                </div>
              )}
              {result.warnings.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 space-y-1">
                  {result.warnings.map((w, i) => (
                    <p key={i} className="text-[12px] text-amber-700">⚠ {w}</p>
                  ))}
                </div>
              )}
              {result.errors.length === 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                  <p className="text-[13px] text-emerald-700 font-semibold">
                    ✓ Parsed {Object.keys(result.map).length} zones · {Object.keys(result.map).reduce((n, z) => n + Object.keys(result.map[z]).length, 0)} price points
                  </p>

                  {/* Preview table */}
                  <div className="mt-3 overflow-x-auto">
                    <table className="text-[11px] w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-1 text-emerald-600 font-semibold">Zone</th>
                          {COMFORT.map((c) => <th key={c.id} className="text-right pb-1 px-2 text-emerald-600 font-semibold">{c.label}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {ZONES.map((z) => (
                          <tr key={z.id} className="border-t border-emerald-100">
                            <td className="py-1 text-[#1C2B3A] font-medium">{z.label}</td>
                            {COMFORT.map((c) => (
                              <td key={c.id} className="py-1 px-2 text-right font-mono text-[#1C2B3A]">
                                {result.map[z.id]?.[c.id]?.toLocaleString() ?? '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[rgba(0,0,0,0.07)]">
          {!result && (
            <button
              onClick={handleParse}
              disabled={!text.trim()}
              className="px-5 py-2 rounded-xl text-[14px] font-semibold bg-[#1C2B3A] text-white disabled:opacity-40 hover:bg-[#243547] transition-colors"
            >
              Parse
            </button>
          )}
          {canApply && (
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-[14px] font-bold text-[#1C2B3A]"
              style={{ background: 'linear-gradient(135deg, #E8C96A, #C9A84C)' }}
            >
              Apply to grid →
            </button>
          )}
          <button onClick={onClose} className="ml-auto text-[13px] font-semibold text-[#8B9FAE] hover:text-[#1C2B3A] transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main editor ────────────────────────────────────────────
interface Props {
  initialRates: RateRow[];
  travelType: string;
  groupType: string;
  duration: number;
}

export function RatesEditor({ initialRates, travelType, groupType, duration }: Props) {
  const router   = useRouter();
  const [rates,  setRates]  = useState<RateMap>(() => buildMap(initialRates));
  const [raw,    setRaw]    = useState<Record<string, string>>(() => buildRawFromMap(buildMap(initialRates)));
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [focused,    setFocused]    = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );

  useEffect(() => {
    const m = buildMap(initialRates);
    setRates(m);
    setRaw(buildRawFromMap(m));
    setSaveStatus('idle');
  }, [initialRates]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const rows: RateRow[] = ZONES.flatMap((z) =>
        COMFORT.map((c) => ({
          travel_type:      travelType,
          zone:             z.id,
          comfort_level:    c.id,
          duration_days:    duration,
          group_type:       groupType,
          price_per_person: rates[z.id]?.[c.id] ?? 0,
        }))
      );
      await saveRatesAction(rows);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3500);
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }, [rates, travelType, groupType, duration]);

  // Ctrl+S / Cmd+S
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function navigate(type: string, group: string, dur: number) {
    router.push(`/admin/rates?type=${type}&group=${group}&duration=${dur}`);
  }

  function focusCell(row: number, col: number) {
    const el = inputRefs.current[row]?.[col];
    if (el) { el.focus(); el.select(); }
  }

  function handleChange(zone: string, comfort: string, value: string) {
    const key   = `${zone}:${comfort}`;
    const clean = value.replace(/[^0-9]/g, '');
    setRaw((p)   => ({ ...p, [key]: clean }));
    setRates((p) => ({ ...p, [zone]: { ...(p[zone] ?? {}), [comfort]: clean === '' ? 0 : parseInt(clean, 10) } }));
    setSaveStatus('idle');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (row + 1 < ROWS) focusCell(row + 1, col);
        else if (col + 1 < COLS) focusCell(0, col + 1);
        else (e.target as HTMLInputElement).blur();
        break;
      case 'ArrowDown':  if (row + 1 < ROWS) { e.preventDefault(); focusCell(row + 1, col); } break;
      case 'ArrowUp':    if (row > 0)         { e.preventDefault(); focusCell(row - 1, col); } break;
      case 'ArrowRight': { const inp = e.target as HTMLInputElement; if (inp.selectionStart === inp.value.length && col + 1 < COLS) { e.preventDefault(); focusCell(row, col + 1); } break; }
      case 'ArrowLeft':  { const inp = e.target as HTMLInputElement; if (inp.selectionStart === 0 && col > 0)                      { e.preventDefault(); focusCell(row, col - 1); } break; }
      case 'Escape':     (e.target as HTMLInputElement).blur(); break;
    }
  }

  function handleImportApply(importedMap: RateMap) {
    // Merge: imported values overwrite existing; missing cells keep current value
    setRates((prev) => {
      const next = { ...prev };
      for (const z of ZONES) {
        next[z.id] = { ...(prev[z.id] ?? {}) };
        for (const c of COMFORT) {
          const v = importedMap[z.id]?.[c.id];
          if (v !== undefined) next[z.id][c.id] = v;
        }
      }
      return next;
    });
    setRaw((prev) => {
      const next = { ...prev };
      for (const z of ZONES)
        for (const c of COMFORT) {
          const v = importedMap[z.id]?.[c.id];
          if (v !== undefined) next[`${z.id}:${c.id}`] = v === 0 ? '' : String(v);
        }
      return next;
    });
    setSaveStatus('idle');
  }

  function handleExport() {
    const csv  = toCSV(rates, travelType, groupType, duration);
    const blob = new Blob([csv], { type: 'text/csv' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `travocom-rates-${travelType}-${groupType}-${duration}d.csv`;
    a.click();
  }

  const btnBase     = 'px-4 py-2 text-[13px] font-semibold transition-colors';
  const btnActive   = 'bg-[#1C2B3A] text-white';
  const btnInactive = 'bg-white text-[#52697A] hover:bg-[#F3F0EA]';

  return (
    <>
      {showImport && (
        <ImportModal
          onApply={handleImportApply}
          onClose={() => setShowImport(false)}
          currentMap={rates}
          travelType={travelType}
          groupType={groupType}
          duration={duration}
        />
      )}

      <div className="space-y-5">

        {/* ── Filter bar ─────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-[rgba(0,0,0,0.09)] bg-white shadow-sm">
            {['umrah', 'hajj'].map((t) => (
              <button key={t} onClick={() => navigate(t, groupType, duration)}
                className={cn(btnBase, 'capitalize', travelType === t ? 'gradient-gold text-[#1C2B3A]' : btnInactive)}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex rounded-xl overflow-hidden border border-[rgba(0,0,0,0.09)] bg-white shadow-sm">
            {['group', 'private'].map((g) => (
              <button key={g} onClick={() => navigate(travelType, g, duration)}
                className={cn(btnBase, 'capitalize', groupType === g ? btnActive : btnInactive)}>
                {g}
              </button>
            ))}
          </div>

          <div className="flex rounded-xl overflow-hidden border border-[rgba(0,0,0,0.09)] bg-white shadow-sm">
            {DURATIONS.map((d) => (
              <button key={d} onClick={() => navigate(travelType, groupType, d)}
                className={cn(btnBase, duration === d ? btnActive : btnInactive)}>
                {d}d
              </button>
            ))}
          </div>

          {/* Import / Export */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold text-[#52697A] bg-white border border-[rgba(0,0,0,0.09)] hover:bg-[#F3F0EA] transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold text-[#1C2B3A] bg-white border border-[rgba(0,0,0,0.09)] hover:bg-[#F3F0EA] transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Import CSV
            </button>
          </div>
        </div>

        {/* Keyboard hint */}
        <p className="text-[12px] text-[#8B9FAE] hidden sm:block">
          <kbd className="px-1.5 py-0.5 rounded bg-[#F0EDE8] border border-[rgba(0,0,0,0.12)] text-[11px] font-mono">Enter</kbd> down ·{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-[#F0EDE8] border border-[rgba(0,0,0,0.12)] text-[11px] font-mono">Tab</kbd> right ·{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-[#F0EDE8] border border-[rgba(0,0,0,0.12)] text-[11px] font-mono">↑↓←→</kbd> navigate ·{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-[#F0EDE8] border border-[rgba(0,0,0,0.12)] text-[11px] font-mono">Ctrl+S</kbd> save
        </p>

        {/* ── Rate grid ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Header */}
          <div className="grid border-b border-[rgba(0,0,0,0.07)]"
            style={{ gridTemplateColumns: '180px repeat(4, 1fr)' }}>
            <div className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-[#8B9FAE]">Zone</div>
            {COMFORT.map((c) => (
              <div key={c.id} className="px-3 py-3.5 text-center">
                <p className="text-[13px] font-bold text-[#1C2B3A]">{c.label}</p>
                <p className="text-[11px] text-[#8B9FAE]">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {ZONES.map((zone, zi) => (
            <div key={zone.id} className="grid border-b border-[rgba(0,0,0,0.05)] last:border-0"
              style={{ gridTemplateColumns: '180px repeat(4, 1fr)' }}>
              <div className="px-5 py-3 flex flex-col justify-center">
                <p className="text-[13px] font-semibold text-[#1C2B3A] leading-tight">{zone.label}</p>
                <p className="text-[11px] text-[#8B9FAE] mt-0.5">{zone.sub}</p>
              </div>

              {COMFORT.map((c, ci) => {
                const key   = `${zone.id}:${c.id}`;
                const isFoc = focused === key;
                return (
                  <div key={c.id} className="px-2 py-2 flex items-center">
                    <div className={cn(
                      'flex w-full rounded-lg border transition-all duration-100',
                      isFoc
                        ? 'border-[#C9A84C] shadow-[0_0_0_3px_rgba(201,168,76,0.15)] bg-white'
                        : 'border-[rgba(0,0,0,0.09)] bg-[#FAFAF8] hover:border-[rgba(201,168,76,0.4)] hover:bg-white',
                    )}>
                      <span className={cn(
                        'px-2 text-[11px] font-semibold border-r shrink-0 flex items-center select-none transition-colors',
                        isFoc ? 'text-[#C9A84C] border-[rgba(201,168,76,0.3)]' : 'text-[#B0B8BF] border-[rgba(0,0,0,0.07)]',
                      )}>
                        PKR
                      </span>
                      <input
                        ref={(el) => { inputRefs.current[zi][ci] = el; }}
                        type="text"
                        inputMode="numeric"
                        value={raw[key] ?? ''}
                        placeholder="0"
                        onChange={(e) => handleChange(zone.id, c.id, e.target.value)}
                        onFocus={(e) => { setFocused(key); e.target.select(); }}
                        onBlur={() => setFocused(null)}
                        onKeyDown={(e) => handleKeyDown(e, zi, ci)}
                        className="flex-1 px-2 py-2.5 text-[14px] font-semibold text-[#1C2B3A] bg-transparent focus:outline-none w-0 min-w-0 text-right"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Footer ─────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-[#8B9FAE]">
            <span className="font-semibold capitalize text-[#1C2B3A]">{travelType} · {groupType} · {duration} days</span>
            {' '}— {ROWS * COLS} price points
          </p>
          <div className="flex items-center gap-3">
            {saveStatus === 'saved' && <span className="text-[14px] font-semibold text-emerald-600">✓ Saved</span>}
            {saveStatus === 'error' && <span className="text-[14px] font-semibold text-red-500">Save failed — retry</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-7 py-2.5 rounded-xl font-bold text-[14px] text-[#1C2B3A] disabled:opacity-50 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #E8C96A, #C9A84C)' }}
            >
              {saving ? 'Saving…' : 'Save Rates'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
