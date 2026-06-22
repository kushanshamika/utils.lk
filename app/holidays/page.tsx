'use client';

import { useState, useMemo } from 'react';
import { HolidayType, HolidayYear } from '@/types/holiday';
import holidaysRaw from '@/data/holidays.json';

const allYears = holidaysRaw as HolidayYear[];

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayDate(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function daysUntil(dateStr: string): number {
  return Math.round((parseDate(dateStr).getTime() - todayDate().getTime()) / 86400000);
}

function formatDate(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString('en-LK', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function getMonth(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString('en-LK', { month: 'long' });
}

const TYPE_CONFIG: Record<HolidayType, { label: string; color: string; bg: string; dot: string }> = {
  public:     { label: 'Public',     color: 'text-rose-700',  bg: 'bg-rose-50 border-rose-200',   dot: 'bg-rose-500' },
  bank:       { label: 'Bank',       color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200',   dot: 'bg-blue-500' },
  mercantile: { label: 'Mercantile', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
};

type HolidayEntry = { id: number; date: string; name: string; types: HolidayType[]; note?: string };

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HolidaysPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeFilters, setActiveFilters] = useState<Set<HolidayType>>(
    new Set(['public', 'bank', 'mercantile'])
  );
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const yearData = useMemo(
    () => allYears.find(y => y.year === selectedYear),
    [selectedYear]
  );

  const holidays = useMemo<HolidayEntry[]>(() => {
    if (!yearData) return [];
    return (yearData.holidays as HolidayEntry[]).filter(h =>
      h.types.some(t => activeFilters.has(t))
    );
  }, [yearData, activeFilters]);

  const nextHoliday = useMemo(
    () => holidays.find(h => daysUntil(h.date) >= 0) ?? null,
    [holidays]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, HolidayEntry[]>();
    for (const h of holidays) {
      const month = getMonth(h.date);
      if (!map.has(month)) map.set(month, []);
      map.get(month)!.push(h);
    }
    return map;
  }, [holidays]);

  function toggleFilter(type: HolidayType) {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size === 1) return next;
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  const availableYears = allYears.map(y => y.year);

  return (
    // Wrapping in <main> improves landmark semantics for both Google and screen readers
    <main className="min-h-screen bg-[#FAFAF8]">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      {/*
       * h1 uses the primary keyword phrase verbatim.
       * The subtitle reinforces secondary keywords: bank, mercantile, Poya.
       * NOTE: These are inside a client component so Google sees them after
       * JS hydration. The layout.tsx JSON-LD covers pre-hydration discovery.
       */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-14 text-white">
        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-3 text-5xl" role="img" aria-label="Sri Lanka flag">🇱🇰</div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
            Sri Lanka Public Holidays {selectedYear}
          </h1>
          {/* Subtitle — keyword-rich, always visible */}
          <p className="mb-8 text-lg text-slate-300">
            Official <strong className="text-white">public</strong>,{' '}
            <strong className="text-white">bank</strong> &amp;{' '}
            <strong className="text-white">mercantile holidays</strong> — including all{' '}
            <strong className="text-white">Poya days</strong>
          </p>

          {nextHoliday && selectedYear === currentYear && (
            <div
              aria-label="Next upcoming holiday"
              className="inline-flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-sm"
            >
              {(() => {
                const days = daysUntil(nextHoliday.date);
                return (
                  <>
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Next Holiday</span>
                    <span className="text-xl font-bold">{nextHoliday.name}</span>
                    <span className="text-sm text-slate-300">{formatDate(nextHoliday.date)}</span>
                    <span className="mt-1 text-base font-bold text-amber-400">
                      {days === 0 ? '🎉 Today!' : days === 1 ? '🔔 Tomorrow!' : `⏳ ${days} days away`}
                    </span>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </header>

      {/* ── Controls ─────────────────────────────────────────────────────────── */}
      <nav
        aria-label="Holiday year and type filters"
        className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm"
      >
        <div className="mx-auto max-w-4xl px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Select year"
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1"
          >
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                aria-pressed={selectedYear === year}
                aria-label={`Show ${year} holidays`}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all cursor-pointer ${
                  selectedYear === year ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Filter by holiday type" className="flex flex-wrap items-center gap-2">
              {(Object.entries(TYPE_CONFIG) as [HolidayType, typeof TYPE_CONFIG[HolidayType]][]).map(([type, cfg]) => (
                <button
                  key={type}
                  onClick={() => toggleFilter(type)}
                  aria-pressed={activeFilters.has(type)}
                  aria-label={`${activeFilters.has(type) ? 'Hide' : 'Show'} ${cfg.label} holidays`}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeFilters.has(type)
                      ? `${cfg.bg} ${cfg.color} border`
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${activeFilters.has(type) ? cfg.dot : 'bg-slate-300'}`} />
                  {cfg.label}
                </button>
              ))}
            </div>

            <div role="group" aria-label="View mode" className="ml-1 flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {(['list', 'calendar'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer capitalize ${
                    viewMode === mode ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {mode === 'list' ? 'List' : 'Month'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Holiday List / Calendar ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        {!yearData ? (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-slate-500 text-lg">No holiday data for {selectedYear} yet.</p>
          </div>
        ) : viewMode === 'list' ? (
          <ListView grouped={grouped} currentYear={currentYear} selectedYear={selectedYear} />
        ) : (
          <MonthView holidays={holidays} year={selectedYear} />
        )}

        {/* ── Holiday Type Legend ───────────────────────────────────────────── */}
        <section aria-labelledby="legend-heading" className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 id="legend-heading" className="mb-3 text-sm font-semibold text-slate-700">
            Holiday Types in Sri Lanka
          </h2>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-rose-500" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-800">Public Holiday</p>
                <p className="text-xs text-slate-500">All government offices &amp; most businesses closed</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-800">Bank Holiday</p>
                <p className="text-xs text-slate-500">All banks &amp; financial institutions closed</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-800">Mercantile Holiday</p>
                <p className="text-xs text-slate-500">Shops &amp; commercial establishments closed under the Wages Boards Ordinance</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── About Sri Lanka Holidays (SEO copy — always in static HTML) ────── */}
        {/*
         * This section is unconditionally rendered — not behind any state flag.
         * It gives Google visible body text to match against search queries
         * like "poya days sri lanka 2026", "what are mercantile holidays", etc.
         * It also mirrors the FAQ schema in layout.tsx for rich result consistency.
         */}
        <section aria-labelledby="about-heading" className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 id="about-heading" className="mb-4 text-base font-semibold text-slate-800">
            About Sri Lanka Public Holidays
          </h2>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              Sri Lanka officially observes around <strong>25 public holidays per year</strong>, gazetted by the
              Government of Sri Lanka. These include national, religious, and cultural observances for
              Buddhist, Hindu, Christian, and Muslim communities — making Sri Lanka one of the countries
              with the highest number of public holidays globally.
            </p>
            <p>
              <strong>Poya days</strong> (full moon days) are gazetted public holidays every month.
              Sri Lanka is one of the few countries in the world where every full moon is a public holiday,
              reflecting the country's predominantly Buddhist heritage.
            </p>
            <p>
              <strong>Bank holidays</strong> are declared separately under the Banking Act and apply to all
              licensed banks and financial institutions. <strong>Mercantile holidays</strong> apply to shops
              and commercial establishments regulated under the Wages Boards Ordinance and related statutes.
              A single date can be a public, bank, and mercantile holiday simultaneously.
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Holiday dates are sourced from official Government Gazettes. Dates may occasionally be revised
              by gazette notification — always verify with official sources for time-sensitive planning.
            </p>
          </div>
        </section>

        {/* ── FAQ Section (mirrors FAQPage schema in layout.tsx) ─────────────── */}
        <section aria-labelledby="faq-heading" className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 id="faq-heading" className="mb-4 text-base font-semibold text-slate-800">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 text-sm">
            <details className="group border-b border-slate-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-slate-800">
                What is the difference between public, bank, and mercantile holidays?
                <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Public holidays apply to all government offices and most businesses. Bank holidays apply to
                banks and financial institutions under the Banking Act. Mercantile holidays apply to shops
                and commercial establishments under the Wages Boards Ordinance. A date can fall under one,
                two, or all three categories.
              </p>
            </details>

            <details className="group border-b border-slate-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-slate-800">
                What are Poya days and why are they holidays in Sri Lanka?
                <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Poya days are the full moon days of each month, observed as public holidays due to Sri Lanka's
                Buddhist heritage. They are gazetted monthly, meaning all government offices, banks, and most
                businesses are closed. Sri Lanka is one of the only countries in the world that makes every
                full moon a national public holiday.
              </p>
            </details>

            <details className="group border-b border-slate-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-slate-800">
                Are these holiday dates officially gazetted?
                <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Yes. All holidays listed here are sourced from official Government Gazettes published by
                the Department of Government Printing. Dates can occasionally be changed by subsequent
                gazette notification — always verify with official sources for critical planning.
              </p>
            </details>

            <details className="group pb-1">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-slate-800">
                Does Sri Lanka observe holidays for all religions?
                <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Yes. Sri Lanka officially observes holidays for Buddhism (Poya days, Vesak), Hinduism
                (Thai Pongal, Deepavali), Islam (Id-ul-Fitr, Id-ul-Alha), and Christianity (Christmas,
                Good Friday). This multi-religious holiday calendar reflects Sri Lanka's diverse population.
              </p>
            </details>
          </div>
        </section>

      </div>
    </main>
  );
}

// ── List View ─────────────────────────────────────────────────────────────────

function ListView({
  grouped,
  currentYear,
  selectedYear,
}: {
  grouped: Map<string, HolidayEntry[]>;
  currentYear: number;
  selectedYear: number;
}) {
  if (grouped.size === 0) {
    return (
      <div className="py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-slate-500">No holidays match the selected filters.</p>
      </div>
    );
  }

  return (
    // Using <ol> (ordered list) here is semantically correct for a chronological
    // list of dated events — Google understands list structure well.
    <div className="space-y-8">
      {[...grouped.entries()].map(([month, items]) => (
        <section key={month} aria-labelledby={`month-${month}`}>
          <h2
            id={`month-${month}`}
            className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400"
          >
            {month}
          </h2>
          <ol className="space-y-2 list-none">
            {items.map(h => {
              const days = daysUntil(h.date);
              const isPast = days < 0;
              const isToday = days === 0;
              const isSoon = days > 0 && days <= 7;

              return (
                <li
                  key={h.id}
                  className={`flex items-start gap-4 rounded-2xl border p-4 transition-all ${
                    isToday
                      ? 'border-amber-300 bg-amber-50 shadow-md'
                      : isSoon
                      ? 'border-slate-300 bg-white shadow-sm'
                      : isPast
                      ? 'border-slate-100 bg-slate-50 opacity-50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Date box */}
                  <div
                    aria-hidden="true"
                    className={`w-14 flex-shrink-0 rounded-xl py-2 text-center ${
                      isToday ? 'bg-amber-500 text-white' : isPast ? 'bg-slate-200 text-slate-500' : 'bg-slate-900 text-white'
                    }`}
                  >
                    <div className="text-xs font-medium opacity-75">
                      {parseDate(h.date).toLocaleDateString('en-LK', { month: 'short' })}
                    </div>
                    <div className="text-2xl font-bold leading-none">
                      {parseDate(h.date).getDate()}
                    </div>
                    <div className="text-xs opacity-70">
                      {parseDate(h.date).toLocaleDateString('en-LK', { weekday: 'short' })}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        {/* Using <h3> here gives Google a clear heading hierarchy:
                            page h1 → month h2 → holiday name h3 */}
                        <h3 className={`font-semibold ${isPast ? 'text-slate-500' : 'text-slate-900'}`}>
                          {h.name}
                        </h3>
                        {/* Visible full date for Google to read */}
                        <time
                          dateTime={h.date}
                          className="text-xs text-slate-400 mt-0.5 block"
                        >
                          {formatDate(h.date)}
                        </time>
                        {h.note && <p className="text-xs text-slate-400 mt-0.5">ℹ️ {h.note}</p>}
                      </div>
                      {!isPast && selectedYear === currentYear && (
                        <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                          isToday ? 'bg-amber-500 text-white' : isSoon ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isToday ? '🎉 Today' : days === 1 ? 'Tomorrow' : `${days}d away`}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {h.types.map(type => (
                        <span
                          key={type}
                          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${TYPE_CONFIG[type].bg} ${TYPE_CONFIG[type].color}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${TYPE_CONFIG[type].dot}`} aria-hidden="true" />
                          {TYPE_CONFIG[type].label}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

// ── Month/Calendar View ───────────────────────────────────────────────────────

function MonthView({ holidays, year }: { holidays: HolidayEntry[]; year: number }) {
  const holidayMap = useMemo(() => {
    const map = new Map<string, HolidayEntry[]>();
    for (const h of holidays) {
      if (!map.has(h.date)) map.set(h.date, []);
      map.get(h.date)!.push(h);
    }
    return map;
  }, [holidays]);

  const todayStr = todayDate().toISOString().slice(0, 10);

  const months = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const first = new Date(year, i, 1);
      const daysInMonth = new Date(year, i + 1, 0).getDate();
      const startDay = first.getDay();
      const cells: (Date | null)[] = Array(startDay).fill(null);
      for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, i, d));
      return {
        label: first.toLocaleDateString('en-LK', { month: 'long' }),
        cells,
        hasHolidays: [...holidayMap.keys()].some(k => parseDate(k).getMonth() === i),
      };
    }), [year, holidayMap]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {months.map(({ label, cells, hasHolidays }) => (
        <section
          key={label}
          aria-label={`${label} ${year} holidays`}
          className={`rounded-2xl border bg-white p-4 ${
            hasHolidays ? 'border-slate-300 shadow-sm' : 'border-slate-100 opacity-50'
          }`}
        >
          <h2 className="mb-3 text-sm font-bold text-slate-700">{label}</h2>
          <div className="grid grid-cols-7 gap-y-1 text-center" role="grid" aria-label={`${label} calendar`}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
              <div key={d} role="columnheader" aria-label={d} className="pb-1 text-xs font-semibold text-slate-400">
                {d.charAt(0)}
              </div>
            ))}
            {cells.map((cell, idx) => {
              if (!cell) return <div key={`e-${idx}`} role="gridcell" />;
              const m = String(cell.getMonth() + 1).padStart(2, '0');
              const d = String(cell.getDate()).padStart(2, '0');
              const dateStr = `${year}-${m}-${d}`;
              const dayHolidays = holidayMap.get(dateStr) ?? [];
              const isHoliday = dayHolidays.length > 0;
              const isToday = dateStr === todayStr;
              const isSunday = cell.getDay() === 0;
              const types = [...new Set(dayHolidays.flatMap(h => h.types))];
              const holidayNames = dayHolidays.map(h => h.name).join(', ');

              return (
                <div
                  key={dateStr}
                  role="gridcell"
                  aria-label={isHoliday ? `${cell.getDate()} ${label}: ${holidayNames}` : undefined}
                  className="group relative flex flex-col items-center"
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                    isToday
                      ? 'bg-amber-500 text-white font-bold'
                      : isHoliday
                      ? 'bg-slate-900 text-white'
                      : isSunday
                      ? 'text-rose-400'
                      : 'text-slate-600'
                  }`}>
                    {cell.getDate()}
                  </div>
                  {isHoliday && (
                    <div className="flex gap-0.5 mt-0.5" aria-hidden="true">
                      {types.slice(0, 3).map((t, i) => (
                        <span key={i} className={`h-1 w-1 rounded-full ${TYPE_CONFIG[t].dot}`} />
                      ))}
                    </div>
                  )}
                  {isHoliday && (
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-52 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl group-hover:block">
                      {dayHolidays.map(h => (
                        <div key={h.name} className="mb-1.5 last:mb-0">
                          <p className="text-xs font-semibold text-slate-800 leading-snug">{h.name}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {h.types.map(t => (
                              <span key={t} className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${TYPE_CONFIG[t].bg} ${TYPE_CONFIG[t].color}`}>
                                {TYPE_CONFIG[t].label}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}