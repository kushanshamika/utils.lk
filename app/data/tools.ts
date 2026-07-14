import { Tool } from '@/types';

export const tools: Tool[] = [
  {
    id: 'nic-info-extractor',
    name: 'NIC Info Extractor',
    description: 'Extract birth date, age, and gender from Sri Lankan NIC number',
    href: '/nic-info-extractor',
    icon: '🪪',
    category: 'Identity',
  },
  {
    id: 'holidays',
    name: 'Public Holiday List',
    description: 'Sri Lanka public, bank & mercantile holidays with countdown',
    href: '/holidays',
    icon: '📅',
    category: 'General',
  },
  {
    id: 'postal-code',
    name: 'Postal Code Finder',
    description: 'Find postal codes for Sri Lankan cities and areas',
    href: '/postal-codes',
    icon: '📮',
    category: 'Location',
  },
  {
    id: 'admin-divisions',
    name: 'Administrative Division Finder',
    description: 'Find GN division, DS, district, and province for any village',
    href: '/admin-divisions',
    icon: '🗺️',
    category: 'Location',
  },
  {
    id: 'school-census-finder',
    name: 'School Census Number Finder',
    description: 'Find school census numbers for 8,000+ schools in Sri Lanka',
    href: '/school-census-finder',
    icon: '🏫',
    category: 'Education',
  },
  {
    id: 'mazda-directory',
    name: 'Mazda Parts & Service Directory',
    description: 'Find spare parts shops and workshops for your Mazda car in Sri Lanka',
    href: '/mazda-directory',
    icon: '🔧',
    category: 'Automotive',
    isNew: true,
  },
];