import apiClient from "../apiClient";

export interface LearningEnrollment {
  id: number;
  content: {
    id: number;
    title: string;
    slug: string;
    type: "course" | "article" | "resource";
    description?: string;
    thumbnail_url?: string;
    difficulty_level?: string;
    estimated_duration: number;
  };
  progress_percentage: number;
  points_earned: number;
  completed_at?: string;
  last_accessed_at?: string;
}

export interface LearningDashboardData {
  learner: {
    id: number;
    name: string;
    avatar?: string;
    total_points: number;
    level?: { id: number; name: string; icon?: string; color?: string; min_points: number };
    next_level?: { name: string; min_points: number; points_remaining: number };
    level_progress: number;
  };
  stats: {
    enrolled: number;
    in_progress: number;
    completed: number;
    learning_points: number;
    time_spent_minutes: number;
  };
  continue_learning: LearningEnrollment[];
  completed_content: LearningEnrollment[];
  achievements: Array<{
    id: number;
    name: string;
    description?: string;
    icon_url?: string;
    rarity?: string;
    earned_at: string;
  }>;
  recent_points: Array<{
    id: number;
    points: number;
    transaction_type?: string;
    description?: string;
    created_at: string;
  }>;
  certificates: Array<{
    verification_code: string;
    content_title: string;
    final_score?: string;
    issued_at: string;
  }>;
}

export const getLearningDashboard = async (): Promise<LearningDashboardData> => {
  const response = await apiClient.get<LearningDashboardData>("/learning/dashboard");
  return response.data;
};

export interface CertificateData {
  verification_code: string;
  is_valid: boolean;
  learner_name: string;
  content_title: string;
  content_slug?: string;
  final_score?: string;
  issued_at: string;
  revoked_at?: string;
}

export const getCertificate = async (verificationCode: string): Promise<CertificateData> => {
  const response = await apiClient.get<CertificateData>(`/certificates/${verificationCode}`);
  return response.data;
};
