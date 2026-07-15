'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import rawListings from '@/data/mazda-listings.json';

type Category = 'Spare Parts' | 'Workshop' | 'Modifications';

interface Listing {
  id: string;
  name: string;
  categories: Category[];
  location: string;
  description: string;
  mapsUrl?: string;
  phone?: string;
  logoUrl?: string;
  website?: string;
  facebookUrl?: string;
}

type RawListing = {
  id: string;
  name: string;
  category?: string;
  categories?: string[];
  location: string;
  description: string;
  mapsUrl?: string;
  phone?: string;
  logoUrl?: string;
  website?: string;
  facebookUrl?: string;
};

function normalizeListing(raw: RawListing): Listing {
  const categories = (raw.categories ?? (raw.category ? [raw.category] : [])) as Category[];
  return {
    id: raw.id,
    name: raw.name,
    categories,
    location: raw.location,
    description: raw.description,
    mapsUrl: raw.mapsUrl,
    phone: raw.phone,
    logoUrl: raw.logoUrl,
    website: raw.website,
    facebookUrl: raw.facebookUrl,
  };
}

const listings: Listing[] = (rawListings as RawListing[]).map(normalizeListing);

type FilterValue = 'All' | Category;

const CATEGORY_STYLES: Record<Category, { hex: string; tagBg: string; tagText: string; logoBg: string }> = {
  'Spare Parts': {
    hex: '#55606B',
    tagBg: 'bg-[#55606B]/10',
    tagText: 'text-[#3F4750]',
    logoBg: 'bg-[#55606B]/10',
  },
  Workshop: {
    hex: '#C97A2B',
    tagBg: 'bg-[#C97A2B]/15',
    tagText: 'text-[#8A4E13]',
    logoBg: 'bg-[#C97A2B]/15',
  },
  Modifications: {
    hex: '#6B4E8C',
    tagBg: 'bg-[#6B4E8C]/10',
    tagText: 'text-[#4A3661]',
    logoBg: 'bg-[#6B4E8C]/10',
  },
};

function stripeBackground(categories: Category[]): string {
  if (categories.length > 1) {
    const stops = categories.map((cat, i) => {
      const start = (i / categories.length) * 100;
      const end = ((i + 1) / categories.length) * 100;
      return `${CATEGORY_STYLES[cat].hex} ${start}% ${end}%`;
    });
    return `linear-gradient(to bottom, ${stops.join(', ')})`;
  }
  return CATEGORY_STYLES[categories[0]].hex;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function PinIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.05 11.05 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function DirectionsIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 010 18M12 3a14.5 14.5 0 000 18" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 21v-7.6h2.6l.4-3H13.5V8.4c0-.87.25-1.46 1.5-1.46h1.6V4.24C16.3 4.17 15.3 4 14.1 4c-2.4 0-4.05 1.47-4.05 4.16v2.24H7.5v3h2.55V21h3.45z" />
    </svg>
  );
}

function DefaultLogo() {
  return (
    <svg className="w-5 h-5 text-[#8A8578]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function ShopLogo({ listing }: { listing: Listing }) {
  const style = CATEGORY_STYLES[listing.categories[0]];
  if (listing.logoUrl) {
    return (
      <img
        src={listing.logoUrl}
        alt={`${listing.name} logo`}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full object-cover border border-gray-200 bg-white shrink-0"
        loading="lazy"
      />
    );
  }
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${style.logoBg}`} aria-hidden="true">
      <DefaultLogo />
    </div>
  );
}

function IconLink({
  href,
  label,
  external = true,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-[#5C574C] hover:bg-[#96181E] hover:text-white transition-colors shrink-0"
    >
      {children}
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MazdaDirectoryPage() {
  const [filter, setFilter] = useState<FilterValue>('All');
  const [query, setQuery]   = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      const matchesCategory = filter === 'All' || l.categories.includes(filter as Category);
      const matchesQuery =
        q === '' ||
        l.name.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [filter, query]);

  const sparePartsCount   = listings.filter((l) => l.categories.includes('Spare Parts')).length;
  const workshopCount     = listings.filter((l) => l.categories.includes('Workshop')).length;
  const modificationsCount = listings.filter((l) => l.categories.includes('Modifications')).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FAF8F4] via-white to-[#F3EFE7]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {/*
       * h1 is the primary keyword target. The subtitle reinforces secondary
       * keywords: "island-wide", "directions", model names.
       * Being inside 'use client' means Google reads it post-hydration —
       * JSON-LD in layout.tsx handles pre-hydration structured data discovery.
       */}
      <div className="relative overflow-hidden border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-10">
          <p
            className="text-[#96181E] text-xs font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            utils.lk &middot; directory
          </p>
          <h1
            className="text-[#1B1D21] text-4xl sm:text-6xl leading-[0.95] uppercase tracking-tight mb-5"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            Mazda Parts &amp;<br />Service Directory
          </h1>
          {/* Subtitle — keyword-rich subtitle visible in static HTML */}
          <p className="text-[#5C574C] text-base sm:text-lg max-w-xl mb-6">
            Spare parts shops and workshops for <strong>Mazda Demio</strong>,{' '}
            <strong>Axela</strong>, <strong>CX-5</strong>, <strong>Atenza</strong> and more —
            listed island-wide. Find one near you and get directions in one tap.
          </p>
          <div
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#5C574C]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span>
              <span className="text-[#55606B] font-semibold">{sparePartsCount}</span> spare parts shops
            </span>
            <span>
              <span className="text-[#C97A2B] font-semibold">{workshopCount}</span> workshops
            </span>
            <span>
              <span className="text-[#6B4E8C] font-semibold">{modificationsCount}</span> modifications
            </span>
          </div>
        </div>
        {/* hazard stripe divider */}
        <div
          aria-hidden="true"
          className="h-2 w-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #C97A2B 0 14px, #F3EFE7 14px 28px)',
          }}
        />
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      {/*
       * Using <nav> as the landmark for filter/search controls.
       * aria-label distinguishes it from other navs on the page.
       */}
      <nav
        aria-label="Filter listings by category and search"
        className="max-w-4xl mx-auto px-4 pt-8 pb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
      >
        {/* Category filter buttons */}
        <div
          role="group"
          aria-label="Filter by category"
          className="inline-flex flex-wrap bg-gray-100 rounded-lg p-1 gap-1 w-fit"
        >
          {(['All', 'Spare Parts', 'Workshop', 'Modifications'] as FilterValue[]).map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              aria-label={`Show ${value === 'All' ? 'all listings' : value + ' listings'}`}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
                filter === value
                  ? 'bg-white text-[#1B1D21] shadow-sm'
                  : 'text-[#5C574C] hover:text-[#1B1D21]'
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
          <label htmlFor="listing-search" className="sr-only">
            Search by shop name or location
          </label>
          <input
            id="listing-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or location…"
            aria-label="Search listings by name or location"
            className="w-full pl-10 pr-4 py-2.5 bg-white text-[#1B1D21] placeholder-gray-400 rounded-lg border border-gray-300 focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all text-sm"
          />
        </div>
      </nav>

      {/* ── Listings ─────────────────────────────────────────────────────── */}
      {/*
       * Using <section> + aria-label so Google understands this is the main
       * content area, distinct from the about/FAQ sections below.
       * Each listing card uses <article> — semantically a self-contained item.
       * Shop names use <h2> (correct hierarchy: page h1 → listing h2).
       * Location uses <address> — Google understands this as a physical location.
       */}
      <section
        aria-label={`${filtered.length} listing${filtered.length === 1 ? '' : 's'}`}
        aria-live="polite"
        className="max-w-4xl mx-auto px-4 pb-6"
      >
        {filtered.length === 0 ? (
          <div className="py-16 text-center" role="status">
            <p className="text-[#5C574C]">No listings match that search.</p>
          </div>
        ) : (
          <ol className="flex flex-col gap-3 py-6 list-none">
            {filtered.map((listing, i) => (
              <li key={listing.id}>
                <article
                  className="relative bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 overflow-hidden transition-shadow"
                  aria-label={listing.name}
                >
                  {/* Category colour stripe */}
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ background: stripeBackground(listing.categories) }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 pl-6">
                    {/* Logo + name + categories */}
                    <div className="flex items-center gap-3 sm:w-64 shrink-0">
                      <ShopLogo listing={listing} />
                      <div className="min-w-0">
                        <span
                          className="text-gray-400 text-[11px] block"
                          style={{ fontFamily: 'var(--font-mono)' }}
                          aria-hidden="true"
                        >
                          No. {String(i + 1).padStart(2, '0')}
                        </span>
                        {/* h2 — correct heading hierarchy under page h1 */}
                        <h2
                          className="text-[#1B1D21] text-lg leading-tight truncate"
                          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
                        >
                          {listing.name}
                        </h2>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {listing.categories.map((cat) => {
                            const style = CATEGORY_STYLES[cat];
                            return (
                              <span
                                key={cat}
                                className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${style.tagBg} ${style.tagText}`}
                                style={{ fontFamily: 'var(--font-mono)' }}
                              >
                                {cat}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Location + description */}
                    <div className="flex-1 min-w-0">
                      {/* <address> is the correct semantic element for location info */}
                      <address className="not-italic flex items-center gap-1.5 text-[#5C574C] text-sm mb-1">
                        <PinIcon />
                        <span>{listing.location}</span>
                      </address>
                      <p className="text-[#3D3A32] text-sm leading-relaxed">
                        {listing.description}
                      </p>
                    </div>

                    {/* Icon actions */}
                    <div className="flex items-center gap-2 shrink-0 sm:pl-2">
                      {listing.phone && (
                        <IconLink href={`tel:${listing.phone}`} label={`Call ${listing.name}: ${listing.phone}`} external={false}>
                          <PhoneIcon />
                        </IconLink>
                      )}
                      {listing.mapsUrl && (
                        <IconLink href={listing.mapsUrl} label={`Get directions to ${listing.name}`}>
                          <DirectionsIcon />
                        </IconLink>
                      )}
                      {listing.website && (
                        <IconLink href={listing.website} label={`Visit ${listing.name} website`}>
                          <WebsiteIcon />
                        </IconLink>
                      )}
                      {listing.facebookUrl && (
                        <IconLink href={listing.facebookUrl} label={`${listing.name} Facebook page`}>
                          <FacebookIcon />
                        </IconLink>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* ── Suggest a Shop ───────────────────────────────────────────────── */}
      <section aria-labelledby="suggest-heading" className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2
              id="suggest-heading"
              className="text-[#1B1D21] text-xl mb-1"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              Know a shop we&rsquo;re missing?
            </h2>
            <p className="text-[#5C574C] text-sm">
              Suggest a spare parts shop or workshop and we&rsquo;ll review it for the directory.
              Community submissions keep this list useful for every Mazda owner in Sri Lanka.
            </p>
          </div>
          <Link
            href="/mazda-directory/suggest-shop"
            className="shrink-0 px-6 py-3 bg-[#96181E] text-white rounded-lg font-semibold hover:bg-[#7A1319] transition-colors text-center"
          >
            Suggest a Shop
          </Link>
        </div>
      </section>

      {/* ── About Section (SEO copy — always in HTML) ─────────────────────── */}
      {/*
       * This section is ALWAYS rendered — not behind any state flag.
       * Without it, Google sees only a list of shop cards.
       * With it, Google has body text for queries like:
       *   "mazda demio parts sri lanka"
       *   "mazda workshop colombo"
       *   "where to buy mazda axela parts"
       */}
      <section aria-labelledby="about-heading" className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-[#FAF8F4] border border-gray-200 rounded-xl p-6">
          <h2
            id="about-heading"
            className="font-semibold text-[#1B1D21] mb-3 text-base"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            About This Directory
          </h2>
          <div className="text-sm text-[#5C574C] space-y-2 leading-relaxed">
            <p>
              This is a <strong>community-maintained directory</strong> of Mazda spare parts shops
              and service workshops across Sri Lanka. Whether you own a{' '}
              <strong>Mazda Demio</strong> (DW/DY/DE/DJ), <strong>Axela</strong> (BK/BL/BM),{' '}
              <strong>CX-5</strong> (KE/KF), <strong>Atenza</strong>, <strong>Familia</strong>,
              or any other model, this list covers shops island-wide — not just Colombo.
            </p>
            <p>
              <strong>Spare Parts</strong> listings stock body parts, mechanical components,
              electrical parts, filters, and accessories. <strong>Workshop</strong> listings
              offer servicing, repairs, diagnosis, and general mechanical work by mechanics with
              Mazda experience. <strong>Modifications</strong> listings specialize in body kits,
              styling, and performance/custom fabrication work. Some shops offer more than one.
            </p>
            <p>
              Use the search bar to filter by location (e.g. &ldquo;Kandy&rdquo;, &ldquo;Galle&rdquo;)
              or by shop name. Use the Maps icon on each card to open Google Maps directions.
              Know a shop that&rsquo;s missing? Use the <em>Suggest a Shop</em> form above.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ (mirrors FAQPage schema in layout.tsx) ────────────────────── */}
      {/*
       * Visible FAQ section that mirrors the FAQPage JSON-LD in layout.tsx.
       * Google cross-checks visible content against structured data —
       * mismatches can cause rich result removal.
       * The model-specific questions (Demio, Axela, CX-5) target the actual
       * long-tail queries Mazda owners in Sri Lanka search for.
       */}
      <section aria-labelledby="faq-heading" className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2
            id="faq-heading"
            className="font-semibold text-[#1B1D21] mb-4 text-base"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 text-sm">
            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-[#1B1D21]">
                Where can I find Mazda spare parts in Sri Lanka?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-[#5C574C] leading-relaxed">
                This directory lists spare parts shops across Sri Lanka, including specialists for
                the Demio (DW/DY/DE), Axela (BK/BL/BM), CX-5, and Atenza. Filter by
                &ldquo;Spare Parts&rdquo; to find stockists near you, then tap the Maps icon for directions.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-[#1B1D21]">
                Where can I find Mazda Demio spare parts in Sri Lanka?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-[#5C574C] leading-relaxed">
                Several shops in this directory cover Mazda Demio parts, including the DW5W (B5 engine),
                DY3W (ZJ engine), and DE3FS/DE5FS generations. Search &ldquo;Demio&rdquo; in the search box
                to filter relevant listings.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-[#1B1D21]">
                Where can I find a Mazda workshop or service center in Sri Lanka?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-[#5C574C] leading-relaxed">
                Filter by &ldquo;Workshop&rdquo; to see service centers and repair shops that work on Mazda
                vehicles island-wide. Each listing includes a Google Maps link and phone number.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-[#1B1D21]">
                Where can I buy Mazda Axela or CX-5 parts in Sri Lanka?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-[#5C574C] leading-relaxed">
                This directory includes shops that stock Mazda Axela (BK/BL/BM) and CX-5 (KE/KF)
                parts. Browse the Spare Parts listings or use the search bar to find relevant shops.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-[#1B1D21]">
                Where can I find Mazda body kits or styling shops in Sri Lanka?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-[#5C574C] leading-relaxed">
                Filter by &ldquo;Modifications&rdquo; to see shops specializing in body kits, aero
                styling, custom exhaust fabrication, and other performance or cosmetic work for
                Mazda vehicles.
              </p>
            </details>

            <details className="group pb-1">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-[#1B1D21]">
                Does this directory cover the whole island, not just Colombo?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-[#5C574C] leading-relaxed">
                Yes — the directory lists shops island-wide. Search by city or area (e.g.
                &ldquo;Kandy&rdquo;, &ldquo;Galle&rdquo;, &ldquo;Negombo&rdquo;) to find Mazda parts shops and workshops
                near you outside Colombo.
              </p>
            </details>
          </div>
        </div>
      </section>

    </main>
  );
}