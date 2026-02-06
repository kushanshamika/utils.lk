export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string; // emoji or icon identifier
  category?: string;
  isNew?: boolean;
}