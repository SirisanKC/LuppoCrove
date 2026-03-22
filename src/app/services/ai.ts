const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export type AIFieldType =
  | "short-text"
  | "long-text"
  | "number"
  | "dropdown"
  | "file-upload"
  | "date";

export type AITemplateField = {
  id?: string;
  label: string;
  fieldType: AIFieldType;
  required: boolean;
  hasCharacterLimit: boolean;
  characterLimit: number | null;
  placeholder: string;
  dropdownOptions: string[];
  acceptedFileTypes: string[];
  maxFileSizeMB: number;
};

export type AIMilestone = {
  id?: string;
  name: string;
  date: string;
  requiresUpload: boolean;
};

export type AICourseExtractResponse = {
  title: string;
  courseCode: string;
  semester: string;
  startDate: string;
  endDate: string;
  proposalDeadline: string;
  description: string;
  templateFields: AITemplateField[];
  milestones: AIMilestone[];
};

async function safeJson(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "Invalid JSON response" };
  }
}

export async function extractCourseFromAI(rawText: string): Promise<AICourseExtractResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai/course-extract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawText }),
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to extract course data");
  }

  return data;
}

export async function polishCourseDescription(
  description: string
): Promise<{ polishedDescription: string }> {
  const response = await fetch(`${API_BASE_URL}/api/ai/polish-course-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to polish description");
  }

  return data;
}