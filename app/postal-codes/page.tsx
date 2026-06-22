'use client';

import { useState, useMemo } from 'react';
import postalCodesData from '@/data/postal-codes.json';
import { PostalCode } from '@/types';

// ToolSchema removed — JSON-LD is now in layout.tsx (server-rendered),
// which guarantees Googlebot sees it regardless of JS hydration timing.

// Top cities shown as static, always-visible content for Google to index.
// These are concrete named entities with postal codes — much stronger SEO
// signal than just "20,000 locations" with no specifics in the HTML.
const TOP_CITIES: { name: string; code: string; province: string }[] = [
  { name: "Colombo",       code: "00100", province: "Western" },
  { name: "Kandy",         code: "20000", province: "Central" },
  { name: "Galle",         code: "80000", province: "Southern" },
  { name: "Negombo",       code: "11500", province: "Western" },
  { name: "Jaffna",        code: "40000", province: "Northern" },
  { name: "Batticaloa",    code: "30000", province: "Eastern" },
  { name: "Matara",        code: "81000", province: "Southern" },
  { name: "Kurunegala",    code: "60000", province: "North Western" },
  { name: "Anuradhapura",  code: "50000", province: "North Central" },
  { name: "Ratnapura",     code: "70000", province: "Sabaragamuwa" },
  { name: "Badulla",       code: "90000", province: "Uva" },
  { name: "Trincomalee",   code: "31000", province: "Eastern" },
];

export default function PostalCodesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostalCode, setSelectedPostalCode] = useState<PostalCode | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const postalCodes = postalCodesData as PostalCode[];

  const filteredPostalCodes = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lower = searchTerm.toLowerCase();
    return postalCodes
      .filter(pc => pc.name.toLowerCase().includes(lower))
      .slice(0, 50);
  }, [searchTerm, postalCodes]);

  const handleSelect = (postalCode: PostalCode) => {
    setSelectedPostalCode(postalCode);
    setSearchTerm(postalCode.name);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsDropdownOpen(true);
    if (!value.trim()) setSelectedPostalCode(null);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedPostalCode(null);
    setIsDropdownOpen(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header className="text-center mb-12">
          <div className="text-6xl mb-4" role="img" aria-label="Postbox">📮</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sri Lanka Postal Code Finder
          </h1>
          <p className="text-lg text-gray-600">
            Search <strong>20,000+ postal codes</strong> for cities and areas across Sri Lanka.
            Free, instant, and accurate.
          </p>
        </header>

        {/* ── Search ───────────────────────────────────────────────────────── */}
        {/*
         * Using the HTML5 <search> landmark element — semantically signals
         * to Google and screen readers that this is a search widget.
         */}
        <search aria-label="Search Sri Lanka postal codes">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <label htmlFor="postal-search" className="block text-sm font-semibold text-gray-700 mb-3">
              Search by City or Area Name
            </label>

            <div className="relative">
              <div className="relative">
                <input
                  id="postal-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => searchTerm && setIsDropdownOpen(true)}
                  placeholder="e.g., Colombo, Kandy, Galle..."
                  className="w-full px-4 py-4 pr-20 text-lg text-gray-900 placeholder:text-gray-400 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  autoComplete="off"
                  aria-label="Search postal codes by city or area name"
                  aria-autocomplete="list"
                  aria-controls="postal-results"
                  aria-expanded={isDropdownOpen && filteredPostalCodes.length > 0}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {searchTerm && (
                    <button
                      onClick={handleClear}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Clear search"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Dropdown Results */}
              {isDropdownOpen && filteredPostalCodes.length > 0 && (
                <ul
                  id="postal-results"
                  role="listbox"
                  aria-label="Postal code search results"
                  className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto"
                >
                  {filteredPostalCodes.map((postalCode) => (
                    <li key={`${postalCode.code}-${postalCode.name}`} role="option" aria-selected={false}>
                      <button
                        onClick={() => handleSelect(postalCode)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 flex items-center justify-between group cursor-pointer"
                      >
                        <span className="font-medium text-gray-900 group-hover:text-blue-600">
                          {postalCode.name}
                        </span>
                        <span className="text-gray-500 text-sm font-mono group-hover:text-blue-500">
                          {postalCode.code}
                        </span>
                      </button>
                    </li>
                  ))}

                  {filteredPostalCodes.length === 50 && (
                    <li className="px-4 py-3 text-sm text-gray-500 text-center bg-gray-50">
                      Showing first 50 results. Type more to refine your search.
                    </li>
                  )}
                </ul>
              )}

              {/* No Results */}
              {isDropdownOpen && searchTerm && filteredPostalCodes.length === 0 && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 text-center"
                >
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-600">No postal codes found for &ldquo;{searchTerm}&rdquo;</p>
                  <p className="text-sm text-gray-500 mt-1">Try a different city or area name</p>
                </div>
              )}
            </div>
          </div>
        </search>

        {/* ── Selected Result ───────────────────────────────────────────────── */}
        {selectedPostalCode && (
          <section
            aria-label={`Postal code result for ${selectedPostalCode.name}`}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white animate-fadeIn mb-8"
          >
            <div className="text-center">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-semibold">Postal Code</span>
              </div>

              <div className="mb-6">
                <p className="text-7xl font-bold mb-2 tracking-wider">
                  {selectedPostalCode.code}
                </p>
                <p className="text-2xl font-medium text-blue-100">
                  {selectedPostalCode.name}
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedPostalCode.code);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                aria-label={`Copy postal code ${selectedPostalCode.code} to clipboard`}
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Postal Code
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ── Popular Cities (static, always in HTML) ───────────────────────── */}
        {/*
         * This section is ALWAYS rendered — not behind any state flag.
         * It puts concrete city names + postal codes into the static HTML
         * so Google can index queries like "Kandy postal code" and find
         * the answer directly on this page without JS execution.
         *
         * This is the single most impactful SEO addition for a postal code tool.
         */}
        <section aria-labelledby="popular-cities-heading">
          <h2
            id="popular-cities-heading"
            className="text-lg font-bold text-gray-800 mb-4"
          >
            Postal Codes for Major Sri Lankan Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {TOP_CITIES.map((city) => (
              <button
                key={city.code}
                onClick={() => {
                  // Allow clicking these to pre-fill the search
                  const match = (postalCodesData as PostalCode[]).find(
                    p => p.name.toLowerCase() === city.name.toLowerCase()
                  );
                  if (match) {
                    handleSelect(match);
                  } else {
                    handleSelect({ name: city.name, code: city.code } as PostalCode);
                  }
                }}
                className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer"
                aria-label={`${city.name} postal code: ${city.code}`}
              >
                <p className="font-semibold text-gray-800 group-hover:text-blue-600 text-sm">
                  {city.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{city.province} Province</p>
                {/* Postal code visible and indexable in the HTML */}
                <p className="font-mono text-blue-600 font-bold mt-2 text-lg">{city.code}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── About Section (SEO copy — always in HTML) ─────────────────────── */}
        <section aria-labelledby="about-heading" className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h2 id="about-heading" className="font-semibold text-gray-900 mb-3">
            About Sri Lanka Postal Codes
          </h2>
          <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <p>
              Sri Lanka postal codes are <strong>5-digit numbers</strong> managed by{' '}
              <strong>Sri Lanka Post</strong>. The system covers all nine provinces with over
              20,000 unique codes assigned to cities, towns, villages, and rural delivery areas.
            </p>
            <p>
              The first two digits generally identify the postal district: codes starting with{' '}
              <strong>00</strong> are in Colombo, <strong>11–19</strong> in the Western Province,
              <strong> 20</strong> in Kandy, <strong>80–89</strong> in the Southern Province, and so on.
            </p>
            <p>
              Sri Lanka uses postal codes, not ZIP codes. ZIP codes are a United States (USPS) system.
              For international mail to Sri Lanka, use the 5-digit Sri Lanka postal code in the address.
            </p>
          </div>
        </section>

        {/* ── FAQ Section (mirrors FAQPage schema in layout.tsx) ─────────────── */}
        {/*
         * Content must match the FAQPage JSON-LD in layout.tsx.
         * Google cross-checks visible text against structured data.
         * Mismatches can result in rich result penalties.
         */}
        <section aria-labelledby="faq-heading" className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 id="faq-heading" className="font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 text-sm">
            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                What is the postal code for Colombo, Sri Lanka?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                The main postal code for Colombo is <strong>00100</strong>. Different areas within
                Colombo have specific codes — Colombo 2 is 00200, Colombo 3 is 00300, and so on.
                Use the search above to find the exact code for any Colombo area.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                How do Sri Lanka postal codes work?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Sri Lanka postal codes are 5-digit numbers. The first two digits indicate the postal
                district or province. For example, 00xxx is Colombo district, 20xxx is the Kandy/Central
                region, and 80xxx is the Galle/Southern region. The remaining digits identify the
                specific delivery area.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                Does Sri Lanka use ZIP codes?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Sri Lanka uses 5-digit <strong>postal codes</strong>, not ZIP codes. ZIP codes are
                specific to the United States postal system (USPS). For international mail addressed
                to Sri Lanka, use the Sri Lanka Post 5-digit postal code.
              </p>
            </details>

            <details className="group pb-1">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                How many postal codes does Sri Lanka have?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Sri Lanka has over <strong>20,000 postal codes</strong> covering cities, towns,
                villages, and rural delivery areas across all nine provinces. This tool provides a
                searchable database of all of them, free of charge.
              </p>
            </details>
          </div>
        </section>

        {/* ── How to Use ────────────────────────────────────────────────────── */}
        <section aria-labelledby="how-to-use-heading" className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2
            id="how-to-use-heading"
            className="font-semibold text-gray-900 mb-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Find a Postal Code
          </h2>
          <ol className="text-sm text-gray-600 space-y-1 ml-7 list-decimal">
            <li>Type the name of your city, town, or area in the search box above</li>
            <li>Select the matching location from the dropdown suggestions</li>
            <li>Click <strong>Copy Postal Code</strong> to copy it to your clipboard</li>
            <li>Or click any city card below the search to look up a major city instantly</li>
          </ol>
        </section>

      </div>
    </main>
  );
}