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
    id: 'postal-code',
    name: 'Postal Code Finder',
    description: 'Find postal codes for Sri Lankan cities and areas',
    href: '/postal-code',
    icon: '📮',
    category: 'Location',
  }
];