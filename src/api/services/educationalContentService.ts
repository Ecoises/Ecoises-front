import apiClient from '../apiClient';

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
    rating_average: number;
    view_count: number;
}

export const getEducationalContents = async (params?: { search?: string; category?: string }) => {
    const response = await apiClient.get<EducationalContent[]>('/educational-contents', { params });
    return response.data;
};

export const getEducationalContent = async (id: number | string) => {
    const response = await apiClient.get<EducationalContent>(`/educational-contents/${id}`);
    return response.data;
};
