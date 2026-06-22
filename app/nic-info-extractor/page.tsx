'use client';

import { useState } from 'react';
import { validateAndExtractNIC, formatDate } from '@/utils/nic-validator';
import { NICInfo } from '@/types';

// NOTE: ToolSchema component removed from here.
// JSON-LD is now injected server-side in layout.tsx so Googlebot always sees it,
// regardless of client-side hydration timing.

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

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        {/*
         * h1 uses the primary keyword phrase.
         * The subheading reinforces secondary keywords (old/new format, free).
         * These are in the static HTML so Googlebot indexes them immediately.
         */}
        <header className="text-center mb-12">
          <div className="text-6xl mb-4" role="img" aria-label="Identity card">🪪</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sri Lankan NIC Information Extractor
          </h1>
          <p className="text-lg text-gray-600">
            Extract <strong>birth date</strong>, <strong>age</strong>, and <strong>gender</strong> from
            Sri Lankan National Identity Card (NIC) numbers — supports both old and new formats, free and instant.
          </p>
        </header>

        {/* ── Input Card ─────────────────────────────────────────────────────── */}
        <section aria-label="NIC extractor tool">
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
                  aria-describedby="nic-format-hint"
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

            <p id="nic-format-hint" className="mt-3 text-sm text-gray-500">
              Supports old format (9 digits + V/X) and new 12-digit NIC format
            </p>
          </div>
        </section>

        {/* ── Results: Valid NIC ──────────────────────────────────────────────── */}
        {hasSearched && nicInfo && (
          <section
            aria-label="Extracted NIC information"
            className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white animate-fadeIn"
          >
            <div className="text-center mb-8">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-semibold">
                  {nicInfo.format} Format NIC
                </span>
              </div>
              <div className="text-2xl font-bold mb-2">{nicInfo.nic}</div>
            </div>

            <dl className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl mb-3" role="img" aria-label="Calendar">📅</div>
                <dt className="text-sm text-purple-100 mb-2 font-medium">Date of Birth</dt>
                <dd className="text-xl font-bold">{formatDate(nicInfo.dateOfBirth)}</dd>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl mb-3" role="img" aria-label="Birthday cake">🎂</div>
                <dt className="text-sm text-purple-100 mb-2 font-medium">Current Age</dt>
                <dd className="text-xl font-bold">{nicInfo.age} years</dd>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl mb-3" role="img" aria-label="Person">
                  {nicInfo.gender === 'Male' ? '👨' : '👩'}
                </div>
                <dt className="text-sm text-purple-100 mb-2 font-medium">Gender</dt>
                <dd className="text-xl font-bold">{nicInfo.gender}</dd>
              </div>
            </dl>
          </section>
        )}

        {/* ── Results: Error ──────────────────────────────────────────────────── */}
        {hasSearched && error && (
          <div
            role="alert"
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center animate-fadeIn"
          >
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-900 mb-2">Invalid NIC Number</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* ── About NIC (SEO content — always visible in HTML) ───────────────── */}
        {/*
         * This section is always rendered in the static HTML (not conditional).
         * Google values descriptive on-page copy; this gives context for the tool
         * and matches FAQ schema questions in layout.tsx for consistency.
         */}
        <section aria-labelledby="about-nic-heading" className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h2
            id="about-nic-heading"
            className="font-semibold text-gray-900 mb-3 flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Sri Lankan NIC Numbers
          </h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Old Format (9 digits + V/X):</strong> The first two digits represent the birth year,
              followed by three digits for the day of year (females have 500 added), then a serial number,
              and finally V (resident citizen) or X (non-resident/overseas). Example: <code>911042754V</code>
            </p>
            <p>
              <strong>New Format (12 digits):</strong> Introduced after 2016, the first four digits are the
              full birth year, followed by three digits for day of year (same female +500 rule), then a
              serial number. Example: <code>199119202757</code>
            </p>
            <p>
              <strong>How gender is encoded:</strong> In both formats, if the day-of-year value is 500 or above,
              the NIC holder is female. Subtract 500 to get the actual day of year.
            </p>
            <p className="text-xs text-gray-500 pt-2">
              🔒 This tool runs entirely in your browser. No NIC number or personal data is ever sent to a server.
            </p>
          </div>
        </section>

        {/* ── Example NIC Numbers ────────────────────────────────────────────── */}
        <section aria-labelledby="examples-heading" className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 id="examples-heading" className="font-semibold text-gray-900 mb-3">
            Example Sri Lankan NIC Numbers
          </h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3">
              <code className="font-mono text-purple-600">912501234V</code>
              <span className="text-gray-600 ml-2">— Old format, Male</span>
            </div>
            <div className="bg-white rounded-lg p-3">
              <code className="font-mono text-purple-600">957501234V</code>
              <span className="text-gray-600 ml-2">— Old format, Female</span>
            </div>
            <div className="bg-white rounded-lg p-3">
              <code className="font-mono text-purple-600">199125012345</code>
              <span className="text-gray-600 ml-2">— New format, Male</span>
            </div>
            <div className="bg-white rounded-lg p-3">
              <code className="font-mono text-purple-600">199575012345</code>
              <span className="text-gray-600 ml-2">— New format, Female</span>
            </div>
          </div>
        </section>

        {/* ── FAQ Section (mirrors FAQ schema in layout.tsx) ─────────────────── */}
        {/*
         * Visible FAQ section that mirrors the FAQPage JSON-LD schema.
         * Keeping them in sync is important — Google cross-checks visible content
         * against structured data. Mismatches can lead to rich result penalties.
         */}
        <section aria-labelledby="faq-heading" className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
          <h2 id="faq-heading" className="font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-sm text-gray-600">
            <details className="group">
              <summary className="font-medium text-gray-800 cursor-pointer list-none flex justify-between items-center">
                What information can be extracted from a Sri Lankan NIC?
                <span className="text-purple-500 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-2 pl-1">
                A Sri Lankan NIC encodes the holder's date of birth, day of year, and gender. For females,
                500 is added to the day-of-year value. This tool extracts date of birth, current age, and
                gender from both old and new NIC formats.
              </p>
            </details>

            <details className="group">
              <summary className="font-medium text-gray-800 cursor-pointer list-none flex justify-between items-center">
                What does V or X mean at the end of a Sri Lankan NIC?
                <span className="text-purple-500 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-2 pl-1">
                In the old NIC format, <strong>V</strong> stands for <em>Voter</em> and is used for resident
                Sri Lankan citizens. <strong>X</strong> is used for Sri Lankan citizens residing abroad.
                Both are valid old-format NICs and this tool handles both.
              </p>
            </details>

            <details className="group">
              <summary className="font-medium text-gray-800 cursor-pointer list-none flex justify-between items-center">
                Is this NIC extractor tool free and private?
                <span className="text-purple-500 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-2 pl-1">
                Yes. The tool is completely free to use. All extraction logic runs in your browser using
                JavaScript — no NIC number is transmitted to any server.
              </p>
            </details>
          </div>
        </section>

      </div>
    </div>
  );
}