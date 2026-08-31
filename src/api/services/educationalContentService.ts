import apiClient from '../apiClient';

export interface Activity {
    id: number;
    activity_type: 'quiz_multiple' | 'quiz_true_false' | 'drag_drop' | 'matching';
    title: string;
    instruction?: string;
    max_points: number;
    attempts_allowed: number;
    is_mandatory: boolean;
    badge?: string;
    options?: Array<{ id: string; text: string }>;
    categories?: Array<{ id: string; name: string }>;
    items?: Array<{ id: string; label: string }>;
    terms?: Array<{ id: string; text: string }>;
    matches?: Array<{ id: string; text: string }>;
}

export type ActivityAnswers = Record<string, unknown>;

export interface ActivityAttemptResponse {
    attempt: {
        id: number;
        attempt_number: number;
        is_correct: boolean;
        points_earned: number;
    };
    is_correct: boolean;
    already_completed: boolean;
    points_awarded: number;
    total_points_awarded: number;
    feedback?: string | null;
    attempts_remaining: number;
    achievements: Array<{
        id: number;
        name: string;
        description?: string;
        icon_url?: string;
        rarity: string;
    }>;
}

export interface Lesson {
    id: number;
    slug: string;
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
    total_points_earned?: number;
    total_points_possible?: number;
    final_score?: number;
    user_rating?: number;
    user_feedback?: string;
}

export interface EducationalAsset {
    id: number;
    asset_type: 'image' | 'infographic' | 'document' | 'external_link';
    title: string;
    description?: string;
    file_path?: string;
    external_url?: string;
    is_downloadable: boolean;
    asset_order: number;
}

export interface ArticleProgress {
    id: number;
    status: 'no_iniciada' | 'en_progreso' | 'completada';
    reading_progress: number;
    last_position?: number;
    completed_at?: string;
    time_spent: number;
    achievements?: ActivityAttemptResponse['achievements'];
}

export interface LessonProgress {
    id: number;
    enrollment_id: number;
    lesson_id: number;
    status: 'en_progreso' | 'completada';
    completed_at?: string;
    points_earned: number;
}

export interface ActivityProgress {
    id: number;
    is_completed: boolean;
    points_earned: number;
}

export interface EducationalContent {
    id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail_url: string;
    content_type: 'course' | 'article' | 'resource';
    difficulty_level: 'principiante' | 'intermedio' | 'avanzado';
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
    assets?: EducationalAsset[];

    // Progress fields (attached if authenticated)
    enrollment?: Enrollment;
    article_progress?: ArticleProgress;
    lesson_progress?: Record<number, LessonProgress>;
    completed_activities?: number[]; // Backward compatibility
    activity_progress?: ActivityProgress[];
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

export const completeLesson = async (slugOrId: string | number) => {
    const response = await apiClient.post<LessonProgress>(`/lessons/${slugOrId}/complete`);
    return response.data;
};

export const attemptActivity = async (id: number, answers: ActivityAnswers, timeTaken?: number): Promise<ActivityAttemptResponse> => {
    const response = await apiClient.post<ActivityAttemptResponse>(`/activities/${id}/attempt`, {
        answers,
        time_taken: timeTaken,
    });
    return response.data;
};

export interface Announcement {
    id: number;
    title: string;
    slug: string;
    summary?: string;
    body?: string;
    cover_image?: string;
    cta_label?: string;
    cta_url?: string;
    is_pinned: boolean;
    published_at: string;
    starts_at?: string;
    ends_at?: string;
    author?: {
        id: number;
        full_name: string;
        avatar?: string;
    };
}

export const getAnnouncements = async (limit = 3): Promise<Announcement[]> => {
    const response = await apiClient.get<Announcement[]>('/announcements', { params: { limit } });
    return response.data;
};

export const getAnnouncement = async (slug: string): Promise<Announcement> => {
    const response = await apiClient.get<Announcement>(`/announcements/${slug}`);
    return response.data;
};

export const updateArticleProgress = async (
    slugOrId: string | number,
    progress: { reading_progress: number; last_position?: number; time_spent?: number },
): Promise<ArticleProgress> => {
    const response = await apiClient.patch<ArticleProgress>(
        `/educational-contents/${slugOrId}/article-progress`,
        progress,
    );
    return response.data;
};

export const submitContentFeedback = async (
    contentId: number | string,
    feedback: { rating?: number; comment?: string },
): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>(
        `/educational-contents/${contentId}/feedback`,
        feedback,
    );
    return response.data;
};
