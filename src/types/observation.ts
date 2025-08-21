export interface Observation {
  id: number;
  species_name: string;
  scientific_name?: string;
  image: string;
  location: string;
  date: string;
  time: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  description: string;
  weather?: string;
  notes?: string;
  is_favorite?: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  content: string;
  created_at: string;
}