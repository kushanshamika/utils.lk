'use client';

import { useState, useMemo } from 'react';
import { searchVillages, getAdministrativeHierarchy, getVillageCount } from '@/utils/admin-lookup';
import { Village, AdministrativeHierarchy } from '@/types';

export default function AdminDivisionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedHierarchy, setSelectedHierarchy] = useState<AdministrativeHierarchy | null>(null);

  const villageCount = getVillageCount();

  // Search villages based on input
  const searchResults = useMemo(() => {
    return searchVillages(searchTerm);
  }, [searchTerm]);

  const handleSelectVillage = (village: Village) => {
    const hierarchy = getAdministrativeHierarchy(village.id);
    if (hierarchy) {
      setSelectedHierarchy(hierarchy);
      setSearchTerm(village.name);
      setIsDropdownOpen(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsDropdownOpen(true);
    if (!value.trim()) {
      setSelectedHierarchy(null);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedHierarchy(null);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Administrative Division Finder
          </h1>
          <p className="text-lg text-gray-600">
            Find the administrative hierarchy for any village in Sri Lanka
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <span>🏘️</span>
            <span>{villageCount.toLocaleString()} villages in database</span>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <label htmlFor="village-search" className="block text-sm font-semibold text-gray-700 mb-3">
            Search for Your Village
          </label>

          <div className="relative">
            {/* Search Input */}
            <div className="relative">
              <input
                id="village-search"
                type="text"
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => searchTerm && setIsDropdownOpen(true)}
                placeholder="e.g., Colombo, Kandy, Galle..."
                className="w-full px-4 py-4 pr-20 text-lg text-gray-900 placeholder:text-gray-400 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                autoComplete="off"
              />

              {/* Search Icon or Clear Button */}
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
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Dropdown Results */}
            {isDropdownOpen && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
                {searchResults.map((village) => (
                  <button
                    key={village.id}
                    onClick={() => handleSelectVillage(village)}
                    className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0 flex items-center justify-between group cursor-pointer"
                  >
                    <span className="font-medium text-gray-900 group-hover:text-green-600">
                      {village.name}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}

                {searchResults.length === 50 && (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center bg-gray-50">
                    Showing first 50 results. Type more to refine your search.
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {isDropdownOpen && searchTerm && searchResults.length === 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-600">No villages found for "{searchTerm}"</p>
                <p className="text-sm text-gray-500 mt-1">Try a different spelling or village name</p>
              </div>
            )}
          </div>
        </div>

        {/* Results - Administrative Hierarchy */}
        {selectedHierarchy && (
          <div className="space-y-4 animate-fadeIn">
            {/* Village */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">🏘️</div>
                <div>
                  <div className="text-sm text-green-100 font-medium">Village</div>
                  <div className="text-2xl font-bold">{selectedHierarchy.village.name}</div>
                </div>
              </div>
            </div>

            {/* Grama Niladhari Division */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="text-2xl">📋</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-medium">Grama Niladhari Division</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedHierarchy.gramaNiladhariDivision.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Divisional Secretariat */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <div className="text-2xl">🏛️</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-medium">Divisional Secretariat</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedHierarchy.divisionalSecretariat.name}
                  </div>
                </div>
              </div>
            </div>

            {/* District */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <div className="text-2xl">🏙️</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-medium">District</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedHierarchy.district.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Province */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-100">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <div className="text-2xl">🗺️</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-medium">Province</div>
                  <div className="text-xl font-bold text-gray-900">
                    {selectedHierarchy.province.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Administrative Hierarchy in Sri Lanka
          </h3>
          <div className="text-sm text-gray-600 space-y-1 ml-7">
            <p><strong>Province</strong> → The highest level administrative division</p>
            <p><strong>District</strong> → Each province contains multiple districts</p>
            <p><strong>Divisional Secretariat (DS)</strong> → Also known as Pradeshiya Lekam Karyalaya</p>
            <p><strong>Grama Niladhari Division (GN)</strong> → Smallest administrative unit</p>
            <p><strong>Village</strong> → Individual settlements within GN divisions</p>
          </div>
        </div>
      </div>
    </div>
  );
}