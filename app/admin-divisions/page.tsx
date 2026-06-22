'use client';

import { useState, useEffect, useRef } from 'react';
import {
  searchLocations,
  getAdministrativeHierarchy,
  getAdministrativeHierarchyByGN,
  getVillageCount,
  getGNDivisionCount,
  SearchResult,
} from '@/utils/admin-lookup';
import { AdministrativeHierarchy } from '@/types';

// ToolSchema removed — JSON-LD is in layout.tsx (server-rendered),
// guaranteeing Googlebot sees all structured data in the initial HTML.

type HierarchyResult =
  | AdministrativeHierarchy
  | Omit<AdministrativeHierarchy, 'village'>
  | null;

// ── Static data for indexable HTML sections ────────────────────────────────
// Matches layout.tsx schemas exactly — Google cross-checks visible content
// against JSON-LD. Mismatches can revoke rich result eligibility.
const SRI_LANKA_PROVINCES = [
  { name: "Western Province",       capital: "Colombo",      districts: ["Colombo", "Gampaha", "Kalutara"] },
  { name: "Central Province",       capital: "Kandy",        districts: ["Kandy", "Matale", "Nuwara Eliya"] },
  { name: "Southern Province",      capital: "Galle",        districts: ["Galle", "Matara", "Hambantota"] },
  { name: "Northern Province",      capital: "Jaffna",       districts: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"] },
  { name: "Eastern Province",       capital: "Trincomalee",  districts: ["Ampara", "Batticaloa", "Trincomalee"] },
  { name: "North Western Province", capital: "Kurunegala",   districts: ["Kurunegala", "Puttalam"] },
  { name: "North Central Province", capital: "Anuradhapura", districts: ["Anuradhapura", "Polonnaruwa"] },
  { name: "Uva Province",           capital: "Badulla",      districts: ["Badulla", "Monaragala"] },
  { name: "Sabaragamuwa Province",  capital: "Ratnapura",    districts: ["Ratnapura", "Kegalle"] },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDivisionsPage() {
  const [inputValue, setInputValue]         = useState('');
  const [searchResults, setSearchResults]   = useState<SearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching]       = useState(false);
  const [hierarchy, setHierarchy]           = useState<HierarchyResult>(null);
  const [selectedType, setSelectedType]     = useState<'village' | 'gn_division' | null>(null);
  const [selectedName, setSelectedName]     = useState('');
  const debounceRef                         = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef                          = useRef<HTMLDivElement>(null);

  // ── Debounced search ─────────────────────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (inputValue.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      const results = searchLocations(inputValue);
      setSearchResults(results);
      setIsSearching(false);
      setIsDropdownOpen(true);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [inputValue]);

  // ── Click outside ────────────────────────────────────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputChange(value: string) {
    setInputValue(value);
    if (!value.trim()) {
      setHierarchy(null);
      setSelectedType(null);
      setSelectedName('');
      setIsDropdownOpen(false);
    }
  }

  function handleSelect(result: SearchResult) {
    const found =
      result.type === 'village'
        ? getAdministrativeHierarchy(result.id)
        : getAdministrativeHierarchyByGN(result.id);
    if (found) {
      setHierarchy(found);
      setSelectedType(result.type);
      setSelectedName(result.name);
      setInputValue(result.name);
      setIsDropdownOpen(false);
      setSearchResults([]);
    }
  }

  function handleClear() {
    setInputValue('');
    setSearchResults([]);
    setHierarchy(null);
    setSelectedType(null);
    setSelectedName('');
    setIsDropdownOpen(false);
  }

  const showDropdown  = isDropdownOpen && inputValue.trim().length >= 2;
  const showNoResults = showDropdown && !isSearching && searchResults.length === 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="text-center mb-12">
          <div className="text-6xl mb-4" role="img" aria-label="Map">🗺️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sri Lanka Grama Niladhari Division Finder
          </h1>
          <p className="text-lg text-gray-600">
            Find the complete <strong>administrative hierarchy</strong> for any village in Sri Lanka —
            GN Division, Divisional Secretariat, District, and Province
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <span aria-hidden="true">🏘️</span>
              <span>{getVillageCount().toLocaleString()} villages</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <span aria-hidden="true">📋</span>
              <span>{getGNDivisionCount().toLocaleString()} GN divisions</span>
            </div>
          </div>
        </header>

        {/* ── Search ─────────────────────────────────────────────────────── */}
        <search aria-label="Search Sri Lanka administrative divisions">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <label htmlFor="location-search" className="block text-sm font-semibold text-gray-700 mb-3">
              Search by Village or GN Division Name
            </label>

            <div className="relative" ref={wrapperRef}>
              <div className="relative">
                <input
                  id="location-search"
                  type="search"
                  value={inputValue}
                  onChange={e => handleInputChange(e.target.value)}
                  onFocus={() => inputValue.trim().length >= 2 && setIsDropdownOpen(true)}
                  placeholder="Type at least 2 characters — e.g., Nugegoda, Peradeniya…"
                  className="w-full px-4 py-4 pr-14 text-lg text-gray-900 placeholder:text-gray-400 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                  autoComplete="off"
                  aria-label="Search villages or GN divisions"
                  aria-autocomplete="list"
                  aria-controls="admin-results"
                  aria-expanded={showDropdown && searchResults.length > 0}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {inputValue && (
                    <button
                      onClick={handleClear}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      aria-label="Clear search"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {isSearching ? (
                    <svg className="animate-spin h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" aria-label="Searching">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </div>

              {inputValue.length === 1 && (
                <p className="mt-2 text-sm text-gray-500" role="status">
                  Type one more character to start searching…
                </p>
              )}

              {/* Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <ul
                  id="admin-results"
                  role="listbox"
                  aria-label="Location search results"
                  className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto"
                >
                  {searchResults.map(result => (
                    <li key={`${result.type}-${result.id}`} role="option" aria-selected={false}>
                      <button
                        onClick={() => handleSelect(result)}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-gray-100 last:border-0 flex items-center justify-between group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg flex-shrink-0" aria-hidden="true">
                            {result.type === 'village' ? '🏘️' : '📋'}
                          </span>
                          <span className="font-medium text-gray-900 group-hover:text-green-700 truncate">
                            {result.name}
                          </span>
                        </div>
                        <span className={`ml-3 flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                          result.type === 'village'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {result.type === 'village' ? 'Village' : 'GN Division'}
                        </span>
                      </button>
                    </li>
                  ))}
                  {searchResults.length === 50 && (
                    <li className="px-4 py-3 text-xs text-gray-500 text-center bg-gray-50 rounded-b-xl">
                      Showing first 50 results — type more to narrow down
                    </li>
                  )}
                </ul>
              )}

              {/* No Results */}
              {showNoResults && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 text-center"
                >
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-700 font-medium">No results for &ldquo;{inputValue}&rdquo;</p>
                  <p className="text-sm text-gray-500 mt-1">Try a different spelling or location name</p>
                </div>
              )}
            </div>
          </div>
        </search>

        {/* ── Results ────────────────────────────────────────────────────── */}
        {hierarchy && (
          <section
            aria-label={`Administrative hierarchy for ${selectedName}`}
            className="space-y-4 animate-fadeIn mb-8"
          >
            {selectedType === 'gn_division' && (
              <div
                role="note"
                className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-800"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                  <strong>{selectedName}</strong> was found as a GN Division.
                  No separate village entry exists in our database.
                </p>
              </div>
            )}

            {selectedType === 'village' && 'village' in hierarchy && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white flex items-center gap-4">
                <div className="text-4xl" aria-hidden="true">🏘️</div>
                <div>
                  <p className="text-sm text-green-100 font-medium">Village</p>
                  {/* Using h2 for the result — correct hierarchy under page h1 */}
                  <h2 className="text-2xl font-bold">{hierarchy.village.name}</h2>
                </div>
              </div>
            )}

            {/* Using <dl> for the hierarchy — semantically correct for labelled data */}
            <dl className="space-y-4">
              <ResultCard
                icon="📋" color="blue"
                label="Grama Niladhari (GN) Division"
                value={hierarchy.gramaNiladhariDivision.name}
              />
              <ResultCard
                icon="🏛️" color="purple"
                label="Divisional Secretariat (DS) Office"
                value={hierarchy.divisionalSecretariat.name}
              />
              <ResultCard
                icon="🏙️" color="orange"
                label="District"
                value={hierarchy.district.name}
              />
              <ResultCard
                icon="🗺️" color="red"
                label="Province"
                value={hierarchy.province.name}
              />
            </dl>
          </section>
        )}

        {/* ── Administrative Hierarchy Explained (SEO — always in HTML) ────── */}
        {/*
         * Always rendered — not behind state. Gives Google body text to
         * match queries like "what is grama niladhari", "how many provinces
         * does sri lanka have", "divisional secretariat vs grama niladhari".
         * Mirrors FAQ schema in layout.tsx exactly.
         */}
        <section aria-labelledby="hierarchy-heading" className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <h2
            id="hierarchy-heading"
            className="font-semibold text-gray-900 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sri Lanka Administrative Hierarchy
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Sri Lanka&apos;s administrative system is structured into five tiers from national to village level:
          </p>
          <ol className="text-sm text-gray-600 space-y-3 ml-2 list-none">
            <li className="flex items-start gap-3">
              <span className="text-lg" aria-hidden="true">🗺️</span>
              <div>
                <strong className="text-gray-800">Province</strong> — The highest tier. Sri Lanka has{' '}
                <strong>9 provinces</strong>: Western, Central, Southern, Northern, Eastern, North Western,
                North Central, Uva, and Sabaragamuwa.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg" aria-hidden="true">🏙️</span>
              <div>
                <strong className="text-gray-800">District</strong> — Each province contains multiple districts.
                Sri Lanka has <strong>25 districts</strong> in total.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg" aria-hidden="true">🏛️</span>
              <div>
                <strong className="text-gray-800">Divisional Secretariat (DS)</strong> — Also called{' '}
                <em>Pradeshiya Lekam Karyalaya</em>. Sri Lanka has <strong>331 DS offices</strong>.
                Handles civil registration, land records, social services, and official documentation.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg" aria-hidden="true">📋</span>
              <div>
                <strong className="text-gray-800">Grama Niladhari (GN) Division</strong> — The smallest
                official administrative unit, managed by a Grama Niladhari officer. Sri Lanka has approximately{' '}
                <strong>14,000 GN divisions</strong>. The GN officer issues character certificates, income
                certificates, residence certificates, and other official documents.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg" aria-hidden="true">🏘️</span>
              <div>
                <strong className="text-gray-800">Village</strong> — Individual settlements within
                a GN division. Multiple villages may share one GN division.
              </div>
            </li>
          </ol>
        </section>

        {/* ── Provinces & Districts (SEO — always in HTML) ──────────────────── */}
        {/*
         * All 9 provinces with their districts hardcoded in static HTML.
         * Google can index this to rank for queries like:
         *   "Kandy district province" → Central Province
         *   "Hambantota district" → Southern Province
         *   "which province is Vavuniya in" → Northern Province
         *
         * Matches provincesItemListSchema + districtsItemListSchema in layout.tsx.
         */}
        <section aria-labelledby="provinces-heading" className="mb-6">
          <h2 id="provinces-heading" className="text-lg font-bold text-gray-800 mb-4">
            Sri Lanka Provinces and Districts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SRI_LANKA_PROVINCES.map((province) => (
              <div
                key={province.name}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  {province.name}
                </h3>
                <p className="text-xs text-gray-400 mb-2">Capital: {province.capital}</p>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {province.districts.map(d => (
                    <li key={d} className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-green-400 flex-shrink-0" aria-hidden="true" />
                      {d} District
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ (mirrors FAQPage schema in layout.tsx) ────────────────────── */}
        <section aria-labelledby="faq-heading" className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 id="faq-heading" className="font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 text-sm">
            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                What is a Grama Niladhari Division in Sri Lanka?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                A Grama Niladhari (GN) Division is the smallest administrative unit in Sri Lanka&apos;s
                government structure, managed by a Grama Niladhari officer. It falls under a Divisional
                Secretariat (DS) office. Sri Lanka has approximately 14,000 GN divisions covering all
                villages and urban areas.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                What is a Divisional Secretariat (DS) office?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                A Divisional Secretariat (DS) office, also known as <em>Pradeshiya Lekam Karyalaya</em>,
                is the government office handling civil registration, land administration, and social
                services at the divisional level. Sri Lanka has 331 DS offices across 25 districts.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                How many provinces and districts does Sri Lanka have?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Sri Lanka has <strong>9 provinces</strong> and <strong>25 districts</strong>. The
                provinces are Western, Central, Southern, Northern, Eastern, North Western, North
                Central, Uva, and Sabaragamuwa. Each province contains 2–5 districts.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                What documents does the Grama Niladhari officer issue?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                The Grama Niladhari officer issues official documents including character certificates,
                income certificates, residence certificates, poverty certificates, land ownership
                confirmations, and certifications needed for school admissions, government services,
                and official applications.
              </p>
            </details>

            <details className="group pb-1">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                What is the difference between GN Division and Divisional Secretariat?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                The Grama Niladhari (GN) Division is the village-level unit, managed by a single GN
                officer. The Divisional Secretariat (DS) is the tier above it, covering multiple GN
                divisions and handling larger administrative functions. For most official certificates,
                you visit your GN officer first, then the DS office if escalation is needed.
              </p>
            </details>
          </div>
        </section>

      </div>
    </main>
  );
}

// ── ResultCard ────────────────────────────────────────────────────────────────
const colorMap: Record<string, { border: string; bg: string }> = {
  blue:   { border: 'border-blue-100',   bg: 'bg-blue-100'   },
  purple: { border: 'border-purple-100', bg: 'bg-purple-100' },
  orange: { border: 'border-orange-100', bg: 'bg-orange-100' },
  red:    { border: 'border-red-100',    bg: 'bg-red-100'    },
};

function ResultCard({
  icon, color, label, value,
}: {
  icon: string; color: string; label: string; value: string;
}) {
  const { border, bg } = colorMap[color];
  return (
    // Using <div> wrapping dt/dd inside a dl in the parent for semantic correctness
    <div className={`bg-white rounded-xl shadow-md p-6 border-2 ${border}`}>
      <div className="flex items-center gap-3">
        <div className={`${bg} p-3 rounded-lg text-2xl`} aria-hidden="true">{icon}</div>
        <div>
          <dt className="text-sm text-gray-500 font-medium">{label}</dt>
          <dd className="text-xl font-bold text-gray-900">{value}</dd>
        </div>
      </div>
    </div>
  );
}