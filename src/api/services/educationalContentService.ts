import apiClient from '../apiClient';

export interface Activity {
    id: number;
    activity_type: 'quiz_multiple' | 'quiz_true_false' | 'drag_drop' | 'matching';
    title: string;
    instruction?: string;
    max_points: number;
    badge?: string;

    // Mapped fields from backend accessors
    options?: any[]; // For quiz_multiple
    items?: any[]; // For drag_drop
    pairs?: any[]; // For matching/drag-drop

    // True/False specific
    is_true?: string | boolean;
    true_false_feedback?: string;

    // Legacy fields (can be deprecated or mapped if needed, but backend sends above)
    statement?: string;
    answer?: boolean;
    explanation?: string;
}

export interface Lesson {
    id: number;
    title: string;
    description?: string;
    content_text?: string;
    media_url?: string;
    media_type?: string;
    audio_url?: string;
    estimated_duration: number;
    lesson_order: number;
    is_mandatory: boolean;
    points: number;
    activities: Activity[];
    references?: Array<{ citation: string }>;
}

export interface ArticleDetails {
    content_text: string;
    audio_url?: string;
    references?: Array<{ citation: string }>;
}

export interface CourseDetails {
    goals?: string[];
    requirements?: string[];
    completion_points: number;
}

export interface Enrollment {
    id: number;
    user_id: number;
    content_id: number;
    enrolled_at: string;
    completed_at?: string;
    progress_percentage: number;
}

export interface LessonProgress {
    id: number;
    enrollment_id: number;
    lesson_id: number;
    status: 'en_progreso' | 'completada';
    completed_at?: string;
    points_earned: number;
}

export interface EducationalContent {
    id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail_url: string;
    content_type: 'course' | 'article';
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    estimated_duration: number;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    author?: {
        id: number;
        full_name: string;
        avatar?: string;
    };
    rating_average: number;
    view_count: number;

    // Detailed fields
    lessons?: Lesson[];
    article_details?: ArticleDetails;
    course_details?: CourseDetails;

    // Progress fields (attached if authenticated)
    enrollment?: Enrollment;
    lesson_progress?: Record<number, LessonProgress>;
    completed_activities?: number[];
}

export const getEducationalContents = async (params?: { search?: string; category?: string }) => {
    const response = await apiClient.get<EducationalContent[]>('/educational-contents', { params });
    return response.data;
};

export const getEducationalContent = async (id: number | string) => {
    const response = await apiClient.get<EducationalContent>(`/educational-contents/${id}`);
    return response.data;
};

export const startContent = async (slugOrId: string): Promise<Enrollment> => {
    const response = await apiClient.post(`/educational-contents/${slugOrId}/start`);
    return response.data;
};

export const completeLesson = async (id: number) => {
    const response = await apiClient.post<LessonProgress>(`/lessons/${id}/complete`);
    return response.data;
};

export const attemptActivity = async (id: number, is_correct: boolean, score: number, answers?: any) => {
    const response = await apiClient.post(`/activities/${id}/attempt`, { is_correct, score, answers });
    return response.data;
};
