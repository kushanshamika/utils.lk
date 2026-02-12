export type HolidayType = 'public' | 'bank' | 'mercantile';

export interface Holiday {
  id: number;
  date: string;        // "YYYY-MM-DD"
  name: string;
  types: HolidayType[];
  note?: string;       // optional extra info e.g. "Subject to moon sighting"
}

export interface HolidayYear {
  year: number;
  holidays: Holiday[];
}