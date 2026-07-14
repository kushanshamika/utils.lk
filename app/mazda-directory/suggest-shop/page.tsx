'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SuggestShopPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shopName: '',
    categories: [] as string[],
    location: '',
    mapsUrl: '',
    phone: '',
    logoUrl: '',
    website: '',
    facebookUrl: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleCategory = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((c) => c !== value)
        : [...prev.categories, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Replace with your Formspree endpoint (use a separate form ID from
      // the Suggest a Tool form so the two submission types stay separate)
      const response = await fetch('https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          shopName: '',
          categories: [],
          location: '',
          mapsUrl: '',
          phone: '',
          logoUrl: '',
          website: '',
          facebookUrl: '',
          description: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F4] via-white to-[#F3EFE7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔧</div>
          <h1
            className="text-4xl uppercase tracking-tight text-[#1B1D21] mb-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            Suggest a Shop
          </h1>
          <p className="text-lg text-[#5C574C]">
            Know a good Mazda parts shop or workshop? Help other owners find it.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {submitStatus === 'success' ? (
            // Success Message
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-[#1B1D21] mb-3">
                Thank You!
              </h2>
              <p className="text-[#3D3A32] mb-6">
                Your suggestion has been received. We'll review it and consider adding it to the directory!
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="px-6 py-3 bg-[#96181E] text-white rounded-xl font-semibold hover:bg-[#7A1319] transition-colors cursor-pointer"
                >
                  Submit Another
                </button>
                <Link
                  href="/mazda-directory"
                  className="px-6 py-3 bg-gray-100 text-[#1B1D21] rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Directory
                </Link>
              </div>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Your Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#1B1D21] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-[#1B1D21] border-2 border-gray-200 rounded-xl focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all bg-white"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1B1D21] mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-[#1B1D21] border-2 border-gray-200 rounded-xl focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all bg-white"
                  placeholder="john@example.com"
                />
              </div>

              {/* Shop Name */}
              <div>
                <label htmlFor="shopName" className="block text-sm font-semibold text-[#1B1D21] mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-[#1B1D21] border-2 border-gray-200 rounded-xl focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all bg-white"
                  placeholder="e.g., Zoom Auto Works"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-[#1B1D21] mb-2">
                  Category <span className="font-normal text-gray-400">(select one or both)</span>
                </label>
                <div className="flex gap-3">
                  {['Spare Parts', 'Workshop'].map((option) => {
                    const checked = formData.categories.includes(option);
                    return (
                      <label
                        key={option}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all select-none ${
                          checked
                            ? 'border-[#96181E] bg-[#96181E]/5 text-[#96181E] font-semibold'
                            : 'border-gray-200 text-[#1B1D21] hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(option)}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-[#1B1D21] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-[#1B1D21] border-2 border-gray-200 rounded-xl focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all bg-white"
                  placeholder="e.g., Rajagiriya, Colombo"
                />
              </div>

              {/* Phone + Google Maps Link */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[#1B1D21] mb-2">
                    Mobile Number <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-[#1B1D21] border-2 border-gray-200 rounded-xl focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all bg-white"
                    placeholder="077 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="mapsUrl" className="block text-sm font-semibold text-[#1B1D21] mb-2">
                    Google Maps Link <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="url"
                    id="mapsUrl"
                    name="mapsUrl"
                    value={formData.mapsUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-[#1B1D21] border-2 border-gray-200 rounded-xl focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all bg-white"
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label htmlFor="logoUrl" className="block text-sm font-semibold text-[#1B1D21] mb-2">
                  Logo Image URL <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  type="url"
                  id="logoUrl"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-[#1B1D21] border-2 border-gray-200 rounded-xl focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all bg-white"
                  placeholder="Link to a logo image, if the shop has one"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  No logo? Leave this blank — we'll show a default icon instead.
                </p>
              </div>

              {/* Website + Facebook */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="website" className="block text-sm font-semibold text-[#1B1D21] mb-2">
                    Website <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-[#1B1D21] border-2 border-gray-200 rounded-xl focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all bg-white"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="facebookUrl" className="block text-sm font-semibold text-[#1B1D21] mb-2">
                    Facebook Page <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="url"
                    id="facebookUrl"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-[#1B1D21] border-2 border-gray-200 rounded-xl focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all bg-white"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-[#1B1D21] mb-2">
                  Brief Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 text-[#1B1D21] border-2 border-gray-200 rounded-xl focus:border-[#96181E] focus:ring-4 focus:ring-[#96181E]/10 outline-none transition-all resize-none bg-white"
                  placeholder="e.g., Specialized in Mazda 3 body kits and respray work"
                />
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                  <p className="text-red-700 font-medium">
                    Oops! Something went wrong. Please try again.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#96181E] text-white font-semibold rounded-xl hover:bg-[#7A1319] hover:shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Suggestion'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-[#1B1D21] mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#C97A2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            What makes a good suggestion?
          </h3>
          <ul className="text-sm text-[#5C574C] space-y-1 ml-7">
            <li>• Genuinely works on or stocks parts for Mazda vehicles</li>
            <li>• A real, findable location in Sri Lanka</li>
            <li>• A specific description — what they're known for, not just "auto shop"</li>
            <li>• Not a duplicate of a listing already in the directory</li>
          </ul>
        </div>

        {/* Back to Directory */}
        <div className="mt-8 text-center">
          <Link
            href="/mazda-directory"
            className="inline-flex items-center gap-2 text-[#1B1D21] hover:text-[#96181E] font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Directory
          </Link>
        </div>
      </div>
    </div>
  );
}