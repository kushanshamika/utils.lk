import {
  Province,
  District,
  DivisionalSecretariat,
  GramaNiladhariDivision,
  Village,
  AdministrativeHierarchy,
} from '@/types';

import provincesData from '@/data/admin/provinces.json';
import districtsData from '@/data/admin/districts.json';
import divisionalSecretariatsData from '@/data/admin/divisional-secretariats.json';
import gramaNiladhariDivisionsData from '@/data/admin/grama-niladhari-divisions.json';
import villagesData from '@/data/admin/villages.json';

// Type assertions
const provinces = provincesData as Province[];
const districts = districtsData as District[];
const divisionalSecretariats = divisionalSecretariatsData as DivisionalSecretariat[];
const gramaNiladhariDivisions = gramaNiladhariDivisionsData as GramaNiladhariDivision[];
const villages = villagesData as Village[];

/**
 * Get the complete administrative hierarchy for a village
 */
export function getAdministrativeHierarchy(villageId: string): AdministrativeHierarchy | null {
  // Find village
  const village = villages.find((v) => v.id === villageId);
  if (!village) return null;

  // Find Grama Niladhari Division
  const gn = gramaNiladhariDivisions.find(
    (g) => g.id === village.gramaNiladhariDivisionId
  );
  if (!gn) return null;

  // Find Divisional Secretariat
  const ds = divisionalSecretariats.find((d) => d.id === gn.divisionalSecretariatId);
  if (!ds) return null;

  // Find District
  const district = districts.find((d) => d.id === ds.districtId);
  if (!district) return null;

  // Find Province
  const province = provinces.find((p) => p.id === district.provinceId);
  if (!province) return null;

  return {
    village,
    gramaNiladhariDivision: gn,
    divisionalSecretariat: ds,
    district,
    province,
  };
}

/**
 * Search villages by name
 */
export function searchVillages(searchTerm: string, limit = 50): Village[] {
  if (!searchTerm.trim()) {
    return [];
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return villages
    .filter((v) => v.name.toLowerCase().includes(lowerSearchTerm))
    .slice(0, limit);
}

/**
 * Get all villages (use with caution for large datasets)
 */
export function getAllVillages(): Village[] {
  return villages;
}

/**
 * Get total count of villages
 */
export function getVillageCount(): number {
  return villages.length;
}