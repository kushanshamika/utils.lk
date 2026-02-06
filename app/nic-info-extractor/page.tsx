'use client';

import { useState } from 'react';
import { validateAndExtractNIC, formatDate } from '@/utils/nic-validator';
import { NICInfo } from '@/types';

export default function NICInfoExtractorPage() {
  const [nicInput, setNicInput] = useState('');
  const [nicInfo, setNicInfo] = useState<NICInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleExtract = () => {
    setHasSearched(true);
    setError(null);
    setNicInfo(null);

    if (!nicInput.trim()) {
      setError('Please enter a NIC number');
      return;
    }

    const result = validateAndExtractNIC(nicInput);

    if (result.isValid && result.info) {
      setNicInfo(result.info);
    } else {
      setError(result.error || 'Invalid NIC number');
    }
  };

  const handleClear = () => {
    setNicInput('');
    setNicInfo(null);
    setError(null);
    setHasSearched(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExtract();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🪪</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NIC Info Extractor
          </h1>
          <p className="text-lg text-gray-600">
            Extract birth date, age, and gender from Sri Lankan NIC numbers
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <label htmlFor="nic" className="block text-sm font-semibold text-gray-700 mb-3">
            Enter NIC Number
          </label>
          
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                id="nic"
                type="text"
                value={nicInput}
                onChange={(e) => setNicInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 911042754V or 199119202757"
                className="w-full px-4 py-4 text-lg text-gray-900 placeholder:text-gray-400 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                autoComplete="off"
              />
              {nicInput && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Clear input"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <button
              onClick={handleExtract}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Extract
            </button>
          </div>

          {/* Format Help Text */}
          <div className="mt-3 text-sm text-gray-500">
            <p>Supports both old format (9 digits + V/X) and new format (12 digits)</p>
          </div>
        </div>

        {/* Results - Valid NIC Info */}
        {hasSearched && nicInfo && (
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white animate-fadeIn">
            <div className="text-center mb-8">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-semibold">
                  {nicInfo.format} Format NIC
                </span>
              </div>
              <div className="text-2xl font-bold mb-2">
                {nicInfo.nic}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Date of Birth */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">📅</div>
                <div className="text-sm text-purple-100 mb-2 font-medium">Date of Birth</div>
                <div className="text-xl font-bold">
                  {formatDate(nicInfo.dateOfBirth)}
                </div>
              </div>

              {/* Age */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">🎂</div>
                <div className="text-sm text-purple-100 mb-2 font-medium">Current Age</div>
                <div className="text-xl font-bold">
                  {nicInfo.age} years
                </div>
              </div>

              {/* Gender */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">
                  {nicInfo.gender === 'Male' ? '👨' : '👩'}
                </div>
                <div className="text-sm text-purple-100 mb-2 font-medium">Gender</div>
                <div className="text-xl font-bold">
                  {nicInfo.gender}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results - Error */}
        {hasSearched && error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center animate-fadeIn">
            <div className="text-5xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Invalid NIC Number</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Sri Lankan NIC
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Old Format:</strong> 9 digits followed by V or X (e.g., 911042754V)</p>
            <p><strong>New Format:</strong> 12 digits (e.g., 199119202757)</p>
            <p className="mt-3 text-xs text-gray-500">
              The NIC number contains encoded information about birth year, day of year, and gender.
              For females, 500 is added to the day of year.
            </p>
          </div>
        </div>

        {/* Examples Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Example NIC Numbers</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3">
              <span className="font-mono text-purple-600">912501234V</span>
              <span className="text-gray-600 ml-2">- Old format (Male)</span>
            </div>
            <div className="bg-white rounded-lg p-3">
              <span className="font-mono text-purple-600">957501234V</span>
              <span className="text-gray-600 ml-2">- Old format (Female)</span>
            </div>
            <div className="bg-white rounded-lg p-3">
              <span className="font-mono text-purple-600">199125012345</span>
              <span className="text-gray-600 ml-2">- New format (Male)</span>
            </div>
            <div className="bg-white rounded-lg p-3">
              <span className="font-mono text-purple-600">199575012345</span>
              <span className="text-gray-600 ml-2">- New format (Female)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}