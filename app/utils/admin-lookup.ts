import {
  Province,
  District,
  DivisionalSecretariat,
  GramaNiladhariDivision,
  Village,
  AdministrativeHierarchy,
} from '@/types';

import provincesData from '../../app/data/admin/provinces.json';
import districtsData from '../../app/data/admin/districts.json';
import divisionalSecretariatsData from '../../app/data/admin/divisional-secretariats.json';
import gramaNiladhariDivisionsData from '../../app/data/admin/grama-niladhari-divisions.json';
import villagesData from '../../app/data/admin/villages.json';

const provinces               = provincesData               as Province[];
const districts               = districtsData               as District[];
const divisionalSecretariats  = divisionalSecretariatsData  as DivisionalSecretariat[];
const gramaNiladhariDivisions = gramaNiladhariDivisionsData as GramaNiladhariDivision[];
const villages                = villagesData                as Village[];

// ── Pre-built Index Maps ─────────────────────────────────────────────────────
const provinceMap  = new Map<string, Province>(provinces.map(p => [p.id, p]));
const districtMap  = new Map<string, District>(districts.map(d => [d.id, d]));
const dsMap        = new Map<string, DivisionalSecretariat>(divisionalSecretariats.map(ds => [ds.id, ds]));
const gnMap        = new Map<string, GramaNiladhariDivision>(gramaNiladhariDivisions.map(gn => [gn.id, gn]));
const villageMap   = new Map<string, Village>(villages.map(v => [v.id, v]));

// ── Exported Types ────────────────────────────────────────────────────────────
export interface SearchResult {
  type: 'village' | 'gn_division';
  id: string;
  name: string;
  displayLabel: string;
}

// ── Hierarchy Builders ────────────────────────────────────────────────────────
function buildHierarchyFromGN(gn: GramaNiladhariDivision): Omit<AdministrativeHierarchy, 'village'> | null {
  const ds = dsMap.get(gn.divisionalSecretariatId);
  if (!ds) {
    return null;
  }
  const district = districtMap.get(ds.districtId);
  if (!district) {
    return null;
  }
  const province = provinceMap.get(district.provinceId);
  if (!province) {
    return null;
  }
  return { gramaNiladhariDivision: gn, divisionalSecretariat: ds, district, province };
}

export function getAdministrativeHierarchy(villageId: string): AdministrativeHierarchy | null {
  const village = villageMap.get(villageId);
  if (!village) {
    return null;
  }

  const gn = gnMap.get(village.gramaNiladhariDivisionId);
  if (!gn) {
    return null;
  }

  const base = buildHierarchyFromGN(gn);
  if (!base) {
    return null;
  }
  return { village, ...base };
}

export function getAdministrativeHierarchyByGN(gnId: string): Omit<AdministrativeHierarchy, 'village'> | null {
  const gn = gnMap.get(gnId);
  if (!gn) {
    return null;
  }
  return buildHierarchyFromGN(gn);
}

// ── Search ────────────────────────────────────────────────────────────────────
export function searchLocations(searchTerm: string, limit = 50): SearchResult[] {
  const term = searchTerm.trim();

  if (term.length < 2) {
    return [];
  }

  const lower = term.toLowerCase();
  const results: SearchResult[] = [];

  // Pass 1 – villages
  for (const v of villages) {
    if (results.length >= limit) break;
    if (v.name.toLowerCase().includes(lower)) {
      results.push({ type: 'village', id: v.id, name: v.name, displayLabel: `${v.name} (Village)` });
    }
  }

  // Pass 2 – GN divisions
  if (results.length < limit) {
    const listedNames = new Set(results.map(r => r.name.toLowerCase()));
    for (const gn of gramaNiladhariDivisions) {
      if (results.length >= limit) break;
      const gnNameLower = gn.name.toLowerCase();
      if (gnNameLower.includes(lower) && !listedNames.has(gnNameLower)) {
        results.push({ type: 'gn_division', id: gn.id, name: gn.name, displayLabel: `${gn.name} (GN Division)` });
        listedNames.add(gnNameLower);
      }
    }
  }

  return results;
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export const getVillageCount    = () => villages.length;
export const getGNDivisionCount = () => gramaNiladhariDivisions.length;
export const getAllVillages      = () => villages;
export const searchVillages     = (term: string, limit = 50) =>
  searchLocations(term, limit)
    .filter(r => r.type === 'village')
    .map(r => villageMap.get(r.id)!)
    .filter(Boolean);