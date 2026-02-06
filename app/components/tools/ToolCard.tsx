import Link from 'next/link';
import { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.href}>
      <div className="group relative bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
        {/* New Badge */}
        {tool.isNew && (
          <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            New
          </span>
        )}

        {/* Icon */}
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {tool.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {tool.description}
        </p>

        {/* Category Badge */}
        {tool.category && (
          <div className="mt-4">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
              {tool.category}
            </span>
          </div>
        )}

        {/* Hover Arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg 
            className="w-5 h-5 text-blue-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}