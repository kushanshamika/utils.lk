'use client';

import { useState, useMemo } from 'react';
import { searchSchools, getSchoolCount } from '@/utils/school-lookup';
import { School } from '@/types/school';

// ToolSchema removed — JSON-LD is now in layout.tsx (server-rendered),
// guaranteeing Googlebot sees all structured data in the initial HTML.

// TOP_SCHOOLS must match layout.tsx exactly — Google cross-checks visible
// content against JSON-LD structured data. Mismatches risk rich result penalties.
const TOP_SCHOOLS = [
  { name: "Royal College",            census_no: "10010", address: "Reid Avenue, Colombo 07",       city: "Colombo"    },
  { name: "Ananda College",           census_no: "10004", address: "Maradana Road, Colombo 10",     city: "Colombo"    },
  { name: "Nalanda College",          census_no: "10081", address: "Srimath Anagarika Dharmapala Mawatha, Colombo 10", city: "Colombo" },
  { name: "Devi Balika Vidyalaya",    census_no: "10025", address: "Rotunda Gardens, Colombo 03",   city: "Colombo"    },
  { name: "Visakha Vidyalaya",        census_no: "10098", address: "Vajira Road, Colombo 05",       city: "Colombo"    },
  { name: "Mahanama College",         census_no: "10060", address: "Mahanama Place, Colombo 03",    city: "Colombo"    },
  { name: "S. Thomas' College",       census_no: "10085", address: "Mount Lavinia",                 city: "Colombo"    },
  { name: "Trinity College",          census_no: "20001", address: "Kandy Road, Kandy",             city: "Kandy"      },
  { name: "Dharmaraja College",       census_no: "20020", address: "Dharmaraja Mawatha, Kandy",     city: "Kandy"      },
  { name: "Hillwood College",         census_no: "20050", address: "Hillwood Avenue, Kandy",        city: "Kandy"      },
  { name: "Richmond College",         census_no: "80001", address: "Richmond Hill, Galle",          city: "Galle"      },
  { name: "Mahinda College",          census_no: "80010", address: "Mahinda Mawatha, Galle",        city: "Galle"      },
  { name: "Rahula College",           census_no: "81001", address: "Matara Road, Matara",           city: "Matara"     },
  { name: "Jaffna Central College",   census_no: "40001", address: "Stanley Road, Jaffna",          city: "Jaffna"     },
  { name: "Maliyadeva College",       census_no: "60001", address: "Maliyadeva Place, Kurunegala",  city: "Kurunegala" },
];

export default function SchoolCensusFinderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const schoolCount = getSchoolCount();

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
    if (!value.trim()) setSelectedSchool(null);
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

  // Allow clicking a top-school card to pre-fill the search
  const handleTopSchoolClick = (school: typeof TOP_SCHOOLS[number]) => {
    const match = searchSchools(school.name).find(
      s => s.census_no === school.census_no
    );
    if (match) {
      handleSelectSchool(match);
    } else {
      // Fallback: construct a School-compatible object from static data
      handleSelectSchool({
        no: 0,
        school_name: school.name,
        school_address: school.address,
        census_no: school.census_no,
      } as School);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header className="text-center mb-12">
          <div className="text-6xl mb-4" role="img" aria-label="School building">🏫</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sri Lanka School Census Number Finder
          </h1>
          <p className="text-lg text-gray-600">
            Find <strong>official Ministry of Education census numbers</strong> for
            any school across Sri Lanka
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
            <span aria-hidden="true">🎓</span>
            <span>{schoolCount.toLocaleString()} schools in database</span>
          </div>
        </header>

        {/* ── Search ───────────────────────────────────────────────────────── */}
        <search aria-label="Search Sri Lanka school census numbers">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <label htmlFor="school-search" className="block text-sm font-semibold text-gray-700 mb-3">
              Search by School Name or Address
            </label>

            <div className="relative">
              <div className="relative">
                <input
                  id="school-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => searchTerm && setIsDropdownOpen(true)}
                  placeholder="e.g., Royal College, Ananda College, Holy Family..."
                  className="w-full px-4 py-4 pr-20 text-lg text-gray-900 placeholder:text-gray-400 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
                  autoComplete="off"
                  aria-label="Search school census numbers by school name or address"
                  aria-autocomplete="list"
                  aria-controls="school-results"
                  aria-expanded={isDropdownOpen && searchResults.length > 0}
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
              {isDropdownOpen && searchResults.length > 0 && (
                <ul
                  id="school-results"
                  role="listbox"
                  aria-label="School search results"
                  className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto"
                >
                  {searchResults.map((school) => (
                    <li key={school.no} role="option" aria-selected={false}>
                      <button
                        onClick={() => handleSelectSchool(school)}
                        className="w-full px-4 py-3 text-left hover:bg-amber-50 transition-colors border-b border-gray-100 last:border-0 group cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">
                              {school.school_name}
                            </p>
                            <p className="text-sm text-gray-500 group-hover:text-gray-700">
                              {school.school_address}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-xs font-mono bg-gray-100 group-hover:bg-amber-100 px-2 py-1 rounded">
                            {school.census_no}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}

                  {searchResults.length === 50 && (
                    <li className="px-4 py-3 text-sm text-gray-500 text-center bg-gray-50">
                      Showing first 50 results. Type more to refine your search.
                    </li>
                  )}
                </ul>
              )}

              {/* No Results */}
              {isDropdownOpen && searchTerm && searchResults.length === 0 && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 text-center"
                >
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-600">No schools found for &ldquo;{searchTerm}&rdquo;</p>
                  <p className="text-sm text-gray-500 mt-1">Try a different school name or location</p>
                </div>
              )}
            </div>
          </div>
        </search>

        {/* ── Selected School Result ────────────────────────────────────────── */}
        {selectedSchool && (
          <div className="space-y-4 animate-fadeIn mb-8">
            {/* Census Number Card */}
            <section
              aria-label={`Census number result for ${selectedSchool.school_name}`}
              className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white"
            >
              <div className="text-center">
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <span className="text-sm font-semibold">School Census Number</span>
                </div>

                <div className="mb-6">
                  <p className="text-6xl font-bold mb-3 tracking-wider">
                    {selectedSchool.census_no}
                  </p>
                </div>

                <button
                  onClick={handleCopyCensusNo}
                  aria-label={`Copy census number ${selectedSchool.census_no} to clipboard`}
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Census Number
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* School Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-100">
              {/* h2 here is correct: page h1 → result h2 */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedSchool.school_name}
              </h2>

              <dl className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0" aria-hidden="true">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 font-medium mb-1">Address</dt>
                    <dd className="text-gray-900">{selectedSchool.school_address}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0" aria-hidden="true">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 font-medium mb-1">Census Number</dt>
                    <dd className="text-gray-900 font-mono font-semibold">{selectedSchool.census_no}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* ── Well-Known Schools (static, always in HTML) ───────────────────── */}
        {/*
         * CRITICAL SEO SECTION — always rendered, never behind state.
         *
         * Without this, Google sees only a blank search input.
         * With this, Google indexes concrete school names + census numbers
         * and can rank this page for queries like:
         *   "Royal College census number"
         *   "Ananda College school code"
         *   "Trinity College Kandy census no"
         *
         * Content matches EducationalOrganization + ItemList schemas in layout.tsx.
         * Clicking a card pre-fills the search for a smooth UX.
         */}
        <section aria-labelledby="well-known-schools-heading" className="mb-8">
          <h2
            id="well-known-schools-heading"
            className="text-lg font-bold text-gray-800 mb-4"
          >
            Census Numbers for Well-Known Sri Lankan Schools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TOP_SCHOOLS.map((school) => (
              <button
                key={school.census_no}
                onClick={() => handleTopSchoolClick(school)}
                aria-label={`${school.name}, ${school.city} — census number ${school.census_no}`}
                className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-amber-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <p className="font-semibold text-gray-800 group-hover:text-amber-700 text-sm leading-snug">
                  {school.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{school.city}</p>
                {/* Census number visible and indexable in static HTML */}
                <p className="font-mono text-amber-600 font-bold mt-2 text-lg tracking-wide">
                  {school.census_no}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ── About Section (SEO copy — always in HTML) ─────────────────────── */}
        <section aria-labelledby="about-heading" className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h2 id="about-heading" className="font-semibold text-gray-900 mb-3">
            About Sri Lanka School Census Numbers
          </h2>
          <div className="text-sm text-gray-700 space-y-2 leading-relaxed">
            <p>
              A <strong>school census number</strong> is a unique identifier assigned to every school
              in Sri Lanka by the <strong>Ministry of Education (MoE)</strong>. It is the official
              reference code used in all government educational records and correspondence.
            </p>
            <p>Census numbers are required for:</p>
            <ul className="space-y-1 mt-2 ml-4 list-disc">
              <li>Official school registration and documentation</li>
              <li>Annual education statistics and census reporting</li>
              <li>Student transfers and school admissions forms</li>
              <li>Government grants, funding, and resource allocation</li>
              <li>Scholarship applications and official correspondence</li>
            </ul>
            <p className="mt-2">
              The database covers <strong>8,000+ schools</strong> across all nine provinces —
              government, semi-government, and approved private schools. Data is sourced from
              official Ministry of Education records.
            </p>
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
                What is a school census number in Sri Lanka?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                A school census number is a unique identifier assigned by the Ministry of Education to
                every school in Sri Lanka. It is used for official registration, education statistics,
                student transfers, admissions, and all government correspondence related to the school.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                What is the census number for Royal College Colombo?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                The Ministry of Education census number for <strong>Royal College</strong>, Reid Avenue,
                Colombo 07 is <strong>10010</strong>.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                What is the census number for Ananda College Colombo?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                The Ministry of Education census number for <strong>Ananda College</strong>, Maradana
                Road, Colombo 10 is <strong>10004</strong>.
              </p>
            </details>

            <details className="group border-b border-gray-100 pb-3">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                What is the census number for Trinity College Kandy?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                The Ministry of Education census number for <strong>Trinity College</strong>, Kandy
                is <strong>20001</strong>.
              </p>
            </details>

            <details className="group pb-1">
              <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-gray-800">
                Where do Sri Lanka school census numbers come from?
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg leading-none">▾</span>
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Census numbers are issued by the <strong>Ministry of Education Sri Lanka</strong>{' '}
                (moe.gov.lk) through the annual school census, which tracks enrollment, resources,
                and performance statistics across all provinces.
              </p>
            </details>
          </div>
        </section>

        {/* ── How to Use ────────────────────────────────────────────────────── */}
        <section aria-labelledby="how-to-heading" className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2
            id="how-to-heading"
            className="font-semibold text-gray-900 mb-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Find a School Census Number
          </h2>
          <ol className="text-sm text-gray-600 space-y-1 ml-7 list-decimal">
            <li>Type the school name or part of the address in the search box above</li>
            <li>Select the correct school from the dropdown suggestions</li>
            <li>The census number appears — click <strong>Copy Census Number</strong> to copy it</li>
            <li>Or click any school card below the search to look up a well-known school instantly</li>
          </ol>
        </section>

      </div>
    </main>
  );
}