'use client';

import { useState, useMemo } from 'react';
import postalCodesData from '@/data/postal-codes.json';
import { PostalCode } from '@/types';
import ToolSchema from '@/components/seo/ToolSchema';

export default function PostalCodesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostalCode, setSelectedPostalCode] = useState<PostalCode | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Type assertion for the imported JSON
  const postalCodes = postalCodesData as PostalCode[];

  // Filter postal codes based on search term
  const filteredPostalCodes = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return postalCodes
      .filter(pc => pc.name.toLowerCase().includes(lowerSearchTerm))
      .slice(0, 50); // Limit to 50 results for performance
  }, [searchTerm, postalCodes]);

  const handleSelect = (postalCode: PostalCode) => {
    setSelectedPostalCode(postalCode);
    setSearchTerm(postalCode.name);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsDropdownOpen(true);
    if (!value.trim()) {
      setSelectedPostalCode(null);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedPostalCode(null);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <ToolSchema
        name="Sri Lanka Postal Code Finder"
        description="Find postal codes for all cities and areas in Sri Lanka. Free online tool with 20,000+ locations."
        url="https://utils.lk/postal-codes"
      />
      
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📮</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sri Lanka Postal Code Finder
          </h1>
          <p className="text-lg text-gray-600">
            Find postal codes for all cities and areas across Sri Lanka
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-3">
            Search by City or Area Name
          </label>
          
          <div className="relative">
            {/* Search Input */}
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => searchTerm && setIsDropdownOpen(true)}
                placeholder="e.g., Colombo, Kandy, Galle..."
                className="w-full px-4 py-4 pr-20 text-lg text-gray-900 placeholder:text-gray-400 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
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
            {isDropdownOpen && filteredPostalCodes.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
                {filteredPostalCodes.map((postalCode) => (
                  <button
                    key={`${postalCode.code}-${postalCode.name}`}
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
                ))}
                
                {filteredPostalCodes.length === 50 && (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center bg-gray-50">
                    Showing first 50 results. Type more to refine your search.
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {isDropdownOpen && searchTerm && filteredPostalCodes.length === 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-600">No postal codes found for "{searchTerm}"</p>
                <p className="text-sm text-gray-500 mt-1">Try a different city or area name</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Result */}
        {selectedPostalCode && (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white animate-fadeIn">
            <div className="text-center">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-semibold">Postal Code</span>
              </div>
              
              <div className="mb-6">
                <div className="text-7xl font-bold mb-2 tracking-wider">
                  {selectedPostalCode.code}
                </div>
                <div className="text-2xl font-medium text-blue-100">
                  {selectedPostalCode.name}
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedPostalCode.code);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Postal Code
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to use
          </h3>
          <ul className="text-sm text-gray-600 space-y-1 ml-7">
            <li>• Start typing the name of your city or area</li>
            <li>• Select from the dropdown suggestions</li>
            <li>• Click "Copy Postal Code" to copy to clipboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}