export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-xl">🛠️</span>
            <span className="text-lg font-semibold text-gray-900">utils.lk</span>
          </div>

          {/* Center - Made with love */}
          <div className="text-gray-600 text-sm">
            Made with ❤️ Kushan Shamika
          </div>

          {/* Right side - Copyright */}
          <div className="text-gray-500 text-sm">
            © {currentYear} utils.lk. All rights reserved.
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          Free online tools for Sri Lankans
        </div>
      </div>
    </footer>
  );
}