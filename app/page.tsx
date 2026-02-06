import ToolGrid from '@/components/tools/ToolGrid';
import { tools } from '@/data/tools';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Free Online Tools for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Sri Lankans
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Simple, fast, and free utilities to make your daily tasks easier. From finding postal codes to using smart everyday tools — all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-green-500 text-xl">●</span>
              <span className="text-sm font-medium text-gray-700">
                {tools.length} Tools Available
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">🇱🇰</span>
              <span className="text-sm font-medium text-gray-700">
                Made for Sri Lanka
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Available Tools
            </h2>
            <p className="text-gray-600">
              Choose a tool below to get started. All tools are free and work instantly.
            </p>
          </div>

          <ToolGrid tools={tools} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            More Tools Coming Soon!
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            We're constantly adding new utilities to help make your life easier. 
            Check back regularly for updates.
          </p>
          <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
            <span>Suggest a Tool</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}