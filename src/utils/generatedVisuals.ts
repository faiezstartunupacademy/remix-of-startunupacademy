export interface GeneratedVisualResponse {
  text?: string;
  images?: string[];
  fallback?: boolean;
  source?: "ai" | "fallback";
  reason?: string;
  message?: string;
  error?: string;
}

export const getGeneratedVisualExtension = (imageUrl: string) => {
  if (imageUrl.startsWith("data:image/svg+xml")) return "svg";
  if (imageUrl.startsWith("data:image/jpeg")) return "jpg";
  if (imageUrl.startsWith("data:image/webp")) return "webp";
  return "png";
};

export const getGeneratedVisualMessage = (
  data: GeneratedVisualResponse,
  fallbackText: string,
) => data.message || data.text || data.error || fallbackText;