'use client';

import { useState, useMemo } from 'react';
import { searchSchools, getSchoolCount } from '@/utils/school-lookup';
import { School } from '@/types/school';
import ToolSchema from '@/components/seo/ToolSchema';

export default function SchoolCensusFinderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const schoolCount = getSchoolCount();

  // Search schools based on input
  const searchResults = useMemo(() => {
    return searchSchools(searchTerm);
  }, [searchTerm]);

  const handleSelectSchool = (school: School) => {
    setSelectedSchool(school);
    setSearchTerm(school.school_name);
    setIsDropdownOpen(false);
    setIsCopied(false);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setIsDropdownOpen(true);
    if (!value.trim()) {
      setSelectedSchool(null);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedSchool(null);
    setIsDropdownOpen(false);
    setIsCopied(false);
  };

  const handleCopyCensusNo = () => {
    if (selectedSchool) {
      navigator.clipboard.writeText(selectedSchool.census_no);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 px-4">
      <ToolSchema
        name="Sri Lanka School Census Number Finder"
        description="Find school census numbers for 8,000+ schools in Sri Lanka. Search by school name or address."
        url="https://utils.lk/school-census-finder"
      />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏫</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            School Census Number Finder
          </h1>
          <p className="text-lg text-gray-600">
            Find census numbers for schools across Sri Lanka
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
            <span>🎓</span>
            <span>{schoolCount.toLocaleString()} schools in database</span>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <label htmlFor="school-search" className="block text-sm font-semibold text-gray-700 mb-3">
            Search by School Name or Address
          </label>

          <div className="relative">
            {/* Search Input */}
            <div className="relative">
              <input
                id="school-search"
                type="text"
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => searchTerm && setIsDropdownOpen(true)}
                placeholder="e.g., Royal College, Ananda College, Holy Family..."
                className="w-full px-4 py-4 pr-20 text-lg text-gray-900 placeholder:text-gray-400 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
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
                {searchResults.map((school) => (
                  <button
                    key={school.no}
                    onClick={() => handleSelectSchool(school)}
                    className="w-full px-4 py-3 text-left hover:bg-amber-50 transition-colors border-b border-gray-100 last:border-0 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">
                          {school.school_name}
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-700">
                          {school.school_address}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-xs font-mono bg-gray-100 group-hover:bg-amber-100 px-2 py-1 rounded">
                        {school.census_no}
                      </div>
                    </div>
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
                <p className="text-gray-600">No schools found for "{searchTerm}"</p>
                <p className="text-sm text-gray-500 mt-1">Try a different school name or location</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected School Details */}
        {selectedSchool && (
          <div className="space-y-4 animate-fadeIn">
            {/* Census Number Card */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="text-center">
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <span className="text-sm font-semibold">School Census Number</span>
                </div>
                
                <div className="mb-6">
                  <div className="text-6xl font-bold mb-3 tracking-wider">
                    {selectedSchool.census_no}
                  </div>
                </div>

                <button
                  onClick={handleCopyCensusNo}
                  className="inline-flex items-center gap-2 bg-white text-amber-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
                      Copy Census Number
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* School Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedSchool.school_name}
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium mb-1">Address</div>
                    <div className="text-gray-900">{selectedSchool.school_address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium mb-1">Census Number</div>
                    <div className="text-gray-900 font-mono font-semibold">{selectedSchool.census_no}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About School Census Numbers
          </h3>
          <div className="text-sm text-gray-700 space-y-2 ml-7">
            <p>School census numbers are unique identifiers assigned to each school in Sri Lanka by the Ministry of Education.</p>
            <p>These numbers are used for:</p>
            <ul className="space-y-1 mt-2">
              <li>• Official school registration and documentation</li>
              <li>• Education statistics and reporting</li>
              <li>• School transfers and admissions</li>
              <li>• Government correspondence and records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}