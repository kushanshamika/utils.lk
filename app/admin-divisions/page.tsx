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
import ToolSchema from '@/components/seo/ToolSchema';

type HierarchyResult =
  | AdministrativeHierarchy
  | Omit<AdministrativeHierarchy, 'village'>
  | null;

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

  // ── Debounced search ───────────────────────────────────────────────────────
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

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  // ── Click outside ──────────────────────────────────────────────────────────
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <ToolSchema
        name="Sri Lanka Administrative Division Finder"
        description="Find Grama Niladhari Division, Divisional Secretariat, District, and Province for any village in Sri Lanka."
        url="https://utils.lk/admin-divisions"
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Grama Niladhari Division
          </h1>
          <p className="text-lg text-gray-600">
            Find the complete administrative hierarchy for any location in Sri Lanka
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <span>🏘️</span>
              <span>{getVillageCount().toLocaleString()} villages</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <span>📋</span>
              <span>{getGNDivisionCount().toLocaleString()} GN divisions</span>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <label htmlFor="location-search" className="block text-sm font-semibold text-gray-700 mb-3">
            Search by Village or GN Division Name
          </label>

          <div className="relative" ref={wrapperRef}>
            <div className="relative">
              <input
                id="location-search"
                type="text"
                value={inputValue}
                onChange={e => handleInputChange(e.target.value)}
                onFocus={() => inputValue.trim().length >= 2 && setIsDropdownOpen(true)}
                placeholder="Type at least 2 characters to search..."
                className="w-full px-4 py-4 pr-14 text-lg text-gray-900 placeholder:text-gray-400 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {inputValue && (
                  <button onClick={handleClear} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" aria-label="Clear">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>

            {inputValue.length === 1 && (
              <p className="mt-2 text-sm text-gray-500">Type one more character to start searching…</p>
            )}

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                {searchResults.map(result => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result)}
                    className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-gray-100 last:border-0 flex items-center justify-between group cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg flex-shrink-0">{result.type === 'village' ? '🏘️' : '📋'}</span>
                      <span className="font-medium text-gray-900 group-hover:text-green-700 truncate">{result.name}</span>
                    </div>
                    <span className={`ml-3 flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                      result.type === 'village' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {result.type === 'village' ? 'Village' : 'GN Division'}
                    </span>
                  </button>
                ))}
                {searchResults.length === 50 && (
                  <div className="px-4 py-3 text-xs text-gray-500 text-center bg-gray-50 rounded-b-xl">
                    Showing first 50 results — type more to narrow down
                  </div>
                )}
              </div>
            )}

            {showNoResults && (
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-700 font-medium">No results for "{inputValue}"</p>
                <p className="text-sm text-gray-500 mt-1">Try a different spelling or location name</p>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {hierarchy && (
          <div className="space-y-4 animate-fadeIn">
            {selectedType === 'gn_division' && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-800">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p><strong>{selectedName}</strong> was found as a GN Division. No separate village entry exists in our database.</p>
              </div>
            )}

            {selectedType === 'village' && 'village' in hierarchy && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white flex items-center gap-4">
                <div className="text-4xl">🏘️</div>
                <div>
                  <div className="text-sm text-green-100 font-medium">Village</div>
                  <div className="text-2xl font-bold">{hierarchy.village.name}</div>
                </div>
              </div>
            )}

            <ResultCard icon="📋" color="blue"   label="Grama Niladhari Division"  value={hierarchy.gramaNiladhariDivision.name} />
            <ResultCard icon="🏛️" color="purple" label="Divisional Secretariat"    value={hierarchy.divisionalSecretariat.name} />
            <ResultCard icon="🏙️" color="orange" label="District"                  value={hierarchy.district.name} />
            <ResultCard icon="🗺️" color="red"    label="Province"                  value={hierarchy.province.name} />
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Administrative Hierarchy in Sri Lanka
          </h3>
          <div className="text-sm text-gray-600 space-y-1 ml-7">
            <p>🗺️ <strong>Province</strong> — Highest level (9 provinces)</p>
            <p>🏙️ <strong>District</strong> — Each province contains multiple districts</p>
            <p>🏛️ <strong>Divisional Secretariat (DS)</strong> — Also known as Pradeshiya Lekam Karyalaya</p>
            <p>📋 <strong>Grama Niladhari Division (GN)</strong> — Smallest administrative unit</p>
            <p>🏘️ <strong>Village</strong> — Individual settlements within GN divisions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ResultCard ────────────────────────────────────────────────────────────────
const colorMap: Record<string, string> = {
  blue:   'border-blue-100 bg-blue-100',
  purple: 'border-purple-100 bg-purple-100',
  orange: 'border-orange-100 bg-orange-100',
  red:    'border-red-100 bg-red-100',
};

function ResultCard({ icon, color, label, value }: { icon: string; color: string; label: string; value: string }) {
  const [border, bg] = colorMap[color].split(' ');
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-2 ${border}`}>
      <div className="flex items-center gap-3">
        <div className={`${bg} p-3 rounded-lg text-2xl`}>{icon}</div>
        <div>
          <div className="text-sm text-gray-500 font-medium">{label}</div>
          <div className="text-xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}