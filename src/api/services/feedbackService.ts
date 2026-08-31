import apiClient from "../apiClient";

export type FeedbackCategory = "suggestion" | "improvement" | "technical_issue" | "accessibility" | "other";

export const submitGeneralFeedback = async (payload: {
  subject: string;
  comment: string;
  category: FeedbackCategory;
  context?: { page?: string };
}): Promise<{ success: boolean; message: string; data: { id: number; status: string } }> => {
  const response = await apiClient.post("/feedback", payload);
  return response.data;
};
