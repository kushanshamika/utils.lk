'use client';

import { useMemo, useRef, useState } from 'react';
import {
  BillingType,
  ConnectionType,
  DataBundlePackage,
  ISP,
  InternetPackage,
  InternetPackagesData,
  PackageKind,
} from '@/types/internet-package';
import packagesRaw from '@/data/internet-packages.json';

const data = packagesRaw as InternetPackagesData;
const { isps, packages: allPackages } = data;

// Only Home Broadband ships in v1. Mobile Broadband packages can already
// carry category: 'mobile-broadband' in the data file without affecting
// this view — see types/internet-package.ts.
const homePackages = allPackages.filter(p => p.category === 'home-broadband');

const MAX_COMPARE = 3;

// ── Config ───────────────────────────────────────────────────────────────────

const CONNECTION_CONFIG: Record<ConnectionType, { label: string; color: string; bg: string; dot: string }> = {
  Fiber: { label: 'Fiber', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  Satellite: { label: 'Satellite', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-300', dot: 'bg-slate-500' },
  '5G': { label: '5G', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200', dot: 'bg-violet-500' },
  '4G': { label: '4G', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  ADSL: { label: 'ADSL', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
};

const TAB_CONFIG: Record<PackageKind, { label: string; blurb: string }> = {
  unlimited: { label: 'Unlimited', blurb: 'No monthly data cap — plans differ by speed only.' },
  databundle: { label: 'Data Bundle', blurb: 'A fixed monthly allowance at a set speed.' },
};

// Kept word-for-word identical to the FAQPage JSON-LD in layout.tsx — search
// engines expect structured data to match what's actually visible on the page.
const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "What's the difference between an unlimited and a data bundle broadband package?",
    answer:
      'Unlimited packages have no monthly data cap — you pick a plan by speed instead (e.g. 100 Mbps vs 300 Mbps), and that speed is what you get all month. Data bundle packages instead give you a fixed monthly data allowance (e.g. 100GB) at a set speed, and either slow down or charge extra once you use it up.',
  },
  {
    question: 'Which connection types are available for home broadband in Sri Lanka?',
    answer:
      'The main options are Fiber (fastest, most widely available in cities and expanding elsewhere), 4G home routers (widely available, no cabling needed), ADSL (older copper-line technology, being phased out in most areas), 5G fixed wireless (limited to select areas so far), and satellite internet via Starlink (available nationwide, including areas with no fixed-line or cellular coverage).',
  },
  {
    question: 'Should I choose a prepaid or postpaid broadband package?',
    answer:
      'Prepaid packages are paid upfront with no contract, which suits short-term needs or unstable income. Postpaid packages are billed monthly, often need a fixed-term contract, and typically work out cheaper per GB or per Mbps for regular, long-term use.',
  },
];

type SortKey = 'price-asc' | 'price-desc' | 'speed-desc' | 'data-desc' | 'value-asc';

const SORT_OPTIONS: Record<PackageKind, { key: SortKey; label: string }[]> = {
  unlimited: [
    { key: 'price-asc', label: 'Price: low to high' },
    { key: 'price-desc', label: 'Price: high to low' },
    { key: 'speed-desc', label: 'Speed: fastest first' },
    { key: 'value-asc', label: 'Value: best price per Mbps' },
  ],
  databundle: [
    { key: 'price-asc', label: 'Price: low to high' },
    { key: 'price-desc', label: 'Price: high to low' },
    { key: 'data-desc', label: 'Data: most first' },
    { key: 'value-asc', label: 'Value: best price per GB' },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  return `Rs. ${n.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function formatSpeed(pkg: InternetPackage): string {
  if (pkg.downloadMbps == null) return 'Speed not published';
  return pkg.uploadMbps != null ? `${pkg.downloadMbps}/${pkg.uploadMbps} Mbps` : `${pkg.downloadMbps} Mbps`;
}

function costPerMbps(pkg: InternetPackage): number | null {
  return pkg.downloadMbps ? pkg.price / pkg.downloadMbps : null;
}

function costPerGB(pkg: InternetPackage): number | null {
  return pkg.kind === 'databundle' ? pkg.price / (pkg as DataBundlePackage).dataCapGB : null;
}

/** The relevant per-unit cost for a package's own kind: Rs/Mbps for unlimited, Rs/GB for data bundles. */
function unitCost(pkg: InternetPackage): number | null {
  return pkg.kind === 'unlimited' ? costPerMbps(pkg) : costPerGB(pkg);
}

function formatUnitCost(pkg: InternetPackage): string | null {
  const cost = unitCost(pkg);
  if (cost == null) return null;
  const rounded = cost < 100 ? cost.toFixed(1) : Math.round(cost).toString();
  return pkg.kind === 'unlimited' ? `Rs. ${rounded}/Mbps` : `Rs. ${rounded}/GB`;
}

function isp(ispId: string): ISP {
  return isps.find(i => i.id === ispId)!;
}

/** "SLT, Dialog and Starlink" — grammatical, and stays correct as ISPs are added or removed. */
function joinNatural(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function formatVerifiedDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' });
}

// The most recent date any package in the current list was checked against
// its ISP's own price list — shown in the hero so the freshness claim is
// real, not just "updated today" on every page load.
const latestVerified = homePackages
  .map(p => p.lastVerified)
  .filter((d): d is string => d != null)
  .sort()
  .at(-1);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InternetPackagesPage() {
  const [activeTab, setActiveTab] = useState<PackageKind>('unlimited');
  const [activeConnections, setActiveConnections] = useState<Set<ConnectionType>>(
    new Set(['Fiber', '5G', '4G', 'ADSL'])
  );
  const [activeBilling, setActiveBilling] = useState<Set<BillingType>>(new Set(['Postpaid', 'Prepaid']));
  const [activeIsps, setActiveIsps] = useState<Set<string>>(new Set(isps.map(i => i.id)));
  const [sortBy, setSortBy] = useState<SortKey>('price-asc');
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  function toggle<T>(set: Set<T>, setSet: (s: Set<T>) => void, value: T) {
    const next = new Set(set);
    if (next.has(value)) {
      if (next.size === 1) return; // keep at least one active, or the list goes empty
      next.delete(value);
    } else {
      next.add(value);
    }
    setSet(next);
  }

  function switchTab(tab: PackageKind) {
    setActiveTab(tab);
    setSortBy('price-asc');
    // Unlimited and Data Bundle packages don't share every field, so a
    // comparison table only ever holds packages from one tab.
    setCompareIds(new Set());
    setCompareOpen(false);
  }

  function toggleCompare(id: string) {
    setCompareIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_COMPARE) return prev;
        next.add(id);
      }
      return next;
    });
  }

  function jumpTo(id: string) {
    cardRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightId(id);
    window.setTimeout(() => setHighlightId(curr => (curr === id ? null : curr)), 1600);
  }

  const tabPackages = useMemo(() => homePackages.filter(p => p.kind === activeTab), [activeTab]);

  const filtered = useMemo(
    () =>
      tabPackages.filter(
        p => activeConnections.has(p.connectionType) && activeBilling.has(p.billingType) && activeIsps.has(p.ispId)
      ),
    [tabPackages, activeConnections, activeBilling, activeIsps]
  );

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'speed-desc':
          return (b.downloadMbps ?? -1) - (a.downloadMbps ?? -1);
        case 'data-desc':
          return ((b as DataBundlePackage).dataCapGB ?? 0) - ((a as DataBundlePackage).dataCapGB ?? 0);
        case 'value-asc': {
          const av = unitCost(a);
          const bv = unitCost(b);
          if (av == null) return 1;
          if (bv == null) return -1;
          return av - bv;
        }
        default:
          return 0;
      }
    });
    return arr;
  }, [filtered, sortBy]);

  // Insights are scoped to whatever the filters currently show, so narrowing
  // to e.g. Fiber-only updates "cheapest" / "fastest" to match.
  //
  // Each metric collects every package that ties for the top spot rather
  // than picking one arbitrarily — two ISPs can genuinely share the same
  // lowest price (see e.g. SLT's and Dialog's Rs. 1,290 plans), and in that
  // case both deserve the tag. "Best value" (cost per Mbps/GB) is computed
  // independently, so when two plans tie on price it still points at
  // whichever of them actually gives more for that price.
  const insights = useMemo(() => {
    if (filtered.length === 0) return null;

    const minPrice = Math.min(...filtered.map(p => p.price));
    const cheapest = filtered.filter(p => p.price === minPrice);

    const withSpeed = filtered.filter(p => p.downloadMbps != null);
    const maxSpeed = withSpeed.length ? Math.max(...withSpeed.map(p => p.downloadMbps!)) : null;
    const fastest = maxSpeed != null ? withSpeed.filter(p => p.downloadMbps === maxSpeed) : [];

    const costed = filtered
      .map(p => ({ p, cost: unitCost(p) }))
      .filter((x): x is { p: InternetPackage; cost: number } => x.cost != null);
    const minCost = costed.length ? Math.min(...costed.map(x => x.cost)) : null;
    const bestValue = minCost != null ? costed.filter(x => x.cost === minCost).map(x => x.p) : [];

    return { cheapest, fastest, bestValue };
  }, [filtered]);

  const cheapestIds = useMemo(() => new Set((insights?.cheapest ?? []).map(p => p.id)), [insights]);
  const bestValueIds = useMemo(() => new Set((insights?.bestValue ?? []).map(p => p.id)), [insights]);
  const fastestIds = useMemo(() => new Set((insights?.fastest ?? []).map(p => p.id)), [insights]);

  const compareList = useMemo(() => sorted.filter(p => compareIds.has(p.id)), [sorted, compareIds]);

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* ── Breadcrumb — mirrors the BreadcrumbList schema in layout.tsx ───────── */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-6 pt-6">
        <ol className="flex items-center gap-1.5 text-xs text-slate-400">
          <li>
            <a href="/" className="hover:text-slate-600 hover:underline">
              Home
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-slate-600">
            Internet Packages Comparison
          </li>
        </ol>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <header className="mx-auto max-w-5xl px-6 pt-8 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Compare Sri Lanka&rsquo;s home broadband packages
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          {homePackages.length} packages from {isps.length} providers — {joinNatural(isps.map(i => i.shortName))} —
          across Fiber, Satellite, 4G, 5G and ADSL. Pick a category, filter by what matters to you, and see who
          actually offers the better deal.
        </p>
        {latestVerified && (
          <p className="mt-2 text-sm text-slate-400">Prices last checked against each ISP&rsquo;s own price list on {formatVerifiedDate(latestVerified)}.</p>
        )}
      </header>

      {/* ── Category tabs — the primary split from the brief ────────────────── */}
      <div className="mx-auto max-w-5xl px-6">
        <div role="tablist" aria-label="Package category" className="grid grid-cols-2 gap-3">
          {(Object.entries(TAB_CONFIG) as [PackageKind, (typeof TAB_CONFIG)[PackageKind]][]).map(([tab, cfg]) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => switchTab(tab)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                activeTab === tab
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-base font-bold">{cfg.label}</span>
                <span className={`text-sm ${activeTab === tab ? 'text-slate-300' : 'text-slate-400'}`}>
                  {homePackages.filter(p => p.kind === tab).length} plans
                </span>
              </div>
              <p className={`mt-1 text-sm ${activeTab === tab ? 'text-slate-300' : 'text-slate-500'}`}>{cfg.blurb}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Insights — the "what should I buy" answer, before any scrolling ──── */}
      {insights && (
        <div className="mx-auto max-w-5xl px-6 pt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <InsightCard
              label="Lowest price"
              accent="emerald"
              pkgs={insights.cheapest}
              stat={`${formatPrice(insights.cheapest[0].price)}/mo`}
              onJump={jumpTo}
            />
            {insights.bestValue.length > 0 && (
              <InsightCard
                label={activeTab === 'unlimited' ? 'Best price per Mbps' : 'Best price per GB'}
                accent="amber"
                pkgs={insights.bestValue}
                stat={formatUnitCost(insights.bestValue[0]) ?? ''}
                onJump={jumpTo}
              />
            )}
            {insights.fastest.length > 0 && (
              <InsightCard
                label="Fastest"
                accent="blue"
                pkgs={insights.fastest}
                stat={formatSpeed(insights.fastest[0])}
                onJump={jumpTo}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div role="group" aria-label="Filter by connection type" className="flex flex-wrap items-center gap-2">
            {(Object.entries(CONNECTION_CONFIG) as [ConnectionType, (typeof CONNECTION_CONFIG)[ConnectionType]][]).map(
              ([type, cfg]) => (
                <button
                  key={type}
                  onClick={() => toggle(activeConnections, setActiveConnections, type)}
                  aria-pressed={activeConnections.has(type)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeConnections.has(type) ? `${cfg.bg} ${cfg.color}` : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
                  {cfg.label}
                </button>
              )
            )}
          </div>

          <div className="h-5 w-px bg-slate-200" aria-hidden="true" />

          <div role="group" aria-label="Filter by billing type" className="flex items-center gap-1 rounded-xl bg-slate-50 p-1">
            {(['Postpaid', 'Prepaid'] as BillingType[]).map(billing => (
              <button
                key={billing}
                onClick={() => toggle(activeBilling, setActiveBilling, billing)}
                aria-pressed={activeBilling.has(billing)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeBilling.has(billing) ? 'bg-slate-900 text-white' : 'text-slate-500'
                }`}
              >
                {billing}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-200" aria-hidden="true" />

          <div role="group" aria-label="Filter by provider" className="flex flex-wrap items-center gap-2">
            {isps.map(i => (
              <button
                key={i.id}
                onClick={() => toggle(activeIsps, setActiveIsps, i.id)}
                aria-pressed={activeIsps.has(i.id)}
                style={activeIsps.has(i.id) ? { borderColor: i.accentColor, color: i.accentColor } : undefined}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeIsps.has(i.id) ? 'bg-white' : 'border-slate-200 text-slate-400'
                }`}
              >
                {i.shortName}
              </button>
            ))}
          </div>

          <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-slate-500">
            Sort
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortKey)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
            >
              {SORT_OPTIONS[activeTab].map(opt => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* ── Package grid ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 pb-10">
        {sorted.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No packages match those filters. Try widening your selection.
          </p>
        ) : (
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map(pkg => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isBest={cheapestIds.has(pkg.id)}
                isBestValue={bestValueIds.has(pkg.id)}
                isFastest={fastestIds.has(pkg.id)}
                comparing={compareIds.has(pkg.id)}
                compareDisabled={!compareIds.has(pkg.id) && compareIds.size >= MAX_COMPARE}
                highlighted={highlightId === pkg.id}
                onToggleCompare={() => toggleCompare(pkg.id)}
                registerRef={el => {
                  if (el) cardRefs.current.set(pkg.id, el);
                  else cardRefs.current.delete(pkg.id);
                }}
              />
            ))}
          </ol>
        )}
      </div>

      {/* ── About — static, crawlable context; not gated behind any filter state ─ */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">About this comparison</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            This page currently covers home broadband only — mobile broadband plans are coming in a later update.
            &ldquo;Best value&rdquo; is worked out from each plan&rsquo;s own price list: cost per Mbps for Unlimited
            plans (since they&rsquo;re sold by speed, not data), and cost per GB for Data Bundle plans. Every price
            is checked against the ISP&rsquo;s own published price list, and the date shown on each card is when
            that check happened — not when the page itself was last edited.
          </p>
        </div>
      </section>

      {/* ── FAQ — visible text matching the FAQPage schema in layout.tsx ───────── */}
      <section className={`mx-auto max-w-5xl px-6 ${compareIds.size > 0 ? 'pb-28' : 'pb-14'}`}>
        <h2 className="mb-3 text-lg font-bold text-slate-900">Frequently asked questions</h2>
        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map(item => (
            <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 marker:content-none">
                {item.question}
              </summary>
              <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Compare tray ─────────────────────────────────────────────────────── */}
      {compareIds.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          {compareOpen && (
            <div className="mx-auto max-h-[50vh] max-w-5xl overflow-y-auto px-6 pt-4">
              <ComparisonTable packages={compareList} onRemove={toggleCompare} />
            </div>
          )}
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
            <span className="text-sm font-semibold text-slate-700">
              {compareIds.size} of {MAX_COMPARE} selected to compare
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompareIds(new Set())}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
              <button
                onClick={() => setCompareOpen(o => !o)}
                disabled={compareIds.size < 2}
                className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                {compareOpen ? 'Hide comparison' : `Compare ${compareIds.size}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function IspLogo({ isp }: { isp: ISP }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        aria-hidden="true"
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
        style={{ backgroundColor: isp.accentColor }}
      >
        {isp.shortName.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={isp.logo}
      alt={`${isp.name} logo`}
      className="h-8 w-8 flex-shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1"
      onError={() => setBroken(true)}
    />
  );
}

function InsightCard({
  label,
  accent,
  pkgs,
  stat,
  onJump,
}: {
  label: string;
  accent: 'emerald' | 'amber' | 'blue';
  /** Every package tied for this metric — usually one, sometimes more. */
  pkgs: InternetPackage[];
  stat: string;
  onJump: (id: string) => void;
}) {
  const ACCENT_BORDER: Record<'emerald' | 'amber' | 'blue', string> = {
    emerald: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    blue: 'border-l-blue-500',
  };

  return (
    <div className={`flex flex-col gap-2 rounded-xl border border-l-4 border-slate-200 bg-white p-4 ${ACCENT_BORDER[accent]}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400">{label}</span>
        {pkgs.length > 1 && <span className="text-xs text-slate-400">{pkgs.length} plans tied</span>}
      </div>
      <span className="text-xl font-bold text-slate-900 tabular-nums">{stat}</span>
      <div className="flex flex-col items-start gap-1">
        {pkgs.map(pkg => (
          <button
            key={pkg.id}
            onClick={() => onJump(pkg.id)}
            className="max-w-full truncate text-left text-xs text-slate-500 transition-colors hover:text-slate-800 hover:underline"
          >
            {isp(pkg.ispId).shortName} · {pkg.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function PackageCard({
  pkg,
  isBest,
  isBestValue,
  isFastest,
  comparing,
  compareDisabled,
  highlighted,
  onToggleCompare,
  registerRef,
}: {
  pkg: InternetPackage;
  isBest: boolean;
  isBestValue: boolean;
  isFastest: boolean;
  comparing: boolean;
  compareDisabled: boolean;
  highlighted: boolean;
  onToggleCompare: () => void;
  registerRef: (el: HTMLLIElement | null) => void;
}) {
  const conn = CONNECTION_CONFIG[pkg.connectionType];
  const record = isp(pkg.ispId);
  const unit = formatUnitCost(pkg);

  const tags: { text: string; className: string }[] = [];
  if (isBest) tags.push({ text: 'Lowest price', className: 'bg-emerald-50 text-emerald-700' });
  if (isBestValue) tags.push({ text: 'Best value', className: 'bg-amber-50 text-amber-700' });
  if (isFastest) tags.push({ text: 'Fastest', className: 'bg-blue-50 text-blue-700' });

  return (
    <li
      ref={registerRef}
      className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 transition-all ${
        highlighted
          ? 'border-slate-900 ring-2 ring-slate-900/20'
          : comparing
          ? 'border-slate-900'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IspLogo isp={record} />
          <span className="text-sm font-semibold text-slate-700">{record.shortName}</span>
        </div>
        <button
          onClick={onToggleCompare}
          disabled={compareDisabled}
          aria-pressed={comparing}
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
            comparing ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300'
          }`}
        >
          {comparing ? 'Comparing' : '+ Compare'}
        </button>
      </div>

      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-900 tabular-nums">{formatPrice(pkg.price)}</span>
          <span className="text-xs text-slate-400">/mo {pkg.priceIncludesTax ? '(incl. tax)' : '(excl. tax)'}</span>
        </div>
        <p className="mt-0.5 text-sm text-slate-600">{pkg.name}</p>
      </div>

      <div className="text-sm text-slate-700">
        {formatSpeed(pkg)}
        {pkg.kind === 'databundle' && ` · ${(pkg as DataBundlePackage).dataCapGB}GB/mo`}
        {pkg.kind === 'unlimited' && ' · No data cap'}
        {unit && <span className="ml-1 text-slate-400">({unit})</span>}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(t => (
            <span key={t.text} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.className}`}>
              {t.text}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${conn.bg} ${conn.color}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${conn.dot}`} aria-hidden="true" />
          {conn.label}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
          {pkg.billingType}
        </span>
        {pkg.lastVerified == null && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
            Verify pricing
          </span>
        )}
      </div>

      {pkg.notes && <p className="text-xs text-slate-400">{pkg.notes}</p>}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        {pkg.lastVerified ? (
          <span className="text-xs text-slate-400">Verified {formatVerifiedDate(pkg.lastVerified)}</span>
        ) : (
          <span />
        )}
        <a
          href={pkg.planUrl ?? record.website}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
        >
          Get this plan ↗
        </a>
      </div>
    </li>
  );
}

function ComparisonTable({ packages, onRemove }: { packages: InternetPackage[]; onRemove: (id: string) => void }) {
  const rows: { label: string; render: (p: InternetPackage) => string }[] = [
    { label: 'Provider', render: p => isp(p.ispId).name },
    { label: 'Package', render: p => p.name },
    { label: 'Price', render: p => `${formatPrice(p.price)}/mo (${p.priceIncludesTax ? 'incl. tax' : 'excl. tax'})` },
    { label: 'Connection', render: p => p.connectionType },
    { label: 'Billing', render: p => p.billingType },
    { label: 'Speed', render: p => formatSpeed(p) },
    { label: 'Data', render: p => (p.kind === 'databundle' ? `${(p as DataBundlePackage).dataCapGB}GB/mo` : 'No cap') },
    { label: 'Cost efficiency', render: p => formatUnitCost(p) ?? '—' },
    { label: 'Contract', render: p => (p.contractMonths ? `${p.contractMonths} months` : 'None') },
    { label: 'Installation', render: p => (p.installationFee ? formatPrice(p.installationFee) : '—') },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="w-32 px-3 py-2" scope="col">
              <span className="sr-only">Field</span>
            </th>
            {packages.map(p => (
              <th key={p.id} className="min-w-[10rem] px-3 py-2" scope="col">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800">{isp(p.ispId).shortName}</span>
                  <button
                    onClick={() => onRemove(p.id)}
                    aria-label={`Remove ${p.name} from comparison`}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.label} className="border-b border-slate-100 last:border-0">
              <th scope="row" className="px-3 py-2 text-left font-semibold text-slate-500">
                {row.label}
              </th>
              {packages.map(p => (
                <td key={p.id} className="px-3 py-2 text-slate-700 tabular-nums">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}