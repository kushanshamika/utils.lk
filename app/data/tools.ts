import { Tool } from '@/types';

export const tools: Tool[] = [
  {
    id: 'nic-info-extractor',
    name: 'NIC Info Extractor',
    description: 'Extract birth date, age, and gender from Sri Lankan NIC number',
    href: '/nic-info-extractor',
    icon: '🪪',
    category: 'Identity',
    isNew: true,
  },
  {
    id: 'holidays',
    name: 'Public Holiday List',
    description: 'Sri Lanka public, bank & mercantile holidays with countdown',
    href: '/holidays',
    icon: '📅',
    category: 'General',
    isNew: true,
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
    isNew: true,
  },
];