import apiClient from "../apiClient";

/** Especie objetivo de un reto (resumen de la ficha). */
export interface ChallengeTaxon {
  id: number;
  scientific_name: string;
  common_name: string | null;
  default_photo?: { url?: string; medium_url?: string; attribution?: string } | null;
  is_endemic: boolean;
  conservation_status: string | null;
}

export interface ChallengeProgress {
  progress: number;
  completed: boolean;
  completed_at: string | null;
}

export interface Challenge {
  id: number;
  title: string;
  description: string | null;
  reward_points: number;
  /** Avistamientos aprobados necesarios para completarlo. */
  target: number;
  requires_photo: boolean;
  start_date: string | null;
  end_date: string | null;
  participant_count: number;
  taxon: ChallengeTaxon | null;
  /** null si el usuario no ha participado o no inició sesión. */
  my_progress: ChallengeProgress | null;
}

export interface ChallengeEvidence {
  id: number;
  observed_at: string | null;
  location_name: string | null;
  verification_status: "pending" | "approved" | "rejected" | null;
  review_note: string | null;
  photos?: { id: number; photo_url: string }[];
}

export interface ChallengeDetail extends Challenge {
  my_observations: ChallengeEvidence[];
}

export const challengeService = {
  async list(): Promise<Challenge[]> {
    const { data } = await apiClient.get<{ data: Challenge[] }>("/challenges");
    return data.data;
  },

  async get(id: number | string): Promise<ChallengeDetail> {
    const { data } = await apiClient.get<{ data: ChallengeDetail }>(`/challenges/${id}`);
    return data.data;
  },
};

export default challengeService;
