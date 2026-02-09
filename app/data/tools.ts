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
    id: 'postal-codes',
    name: 'Postal Code Finder',
    description: 'Find postal codes for Sri Lankan cities and areas',
    href: '/postal-codes',
    icon: '📮',
    category: 'Location',
    isNew: true,
  },
  {
    id: 'admin-divisions',
    name: 'Administrative Division Finder',
    description: 'Find GN division, DS, district, and province for any village',
    href: '/admin-divisions',
    icon: '🗺️',
    category: 'Location',
    isNew: true,
  },
];