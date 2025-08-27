import { QuizResponse, ChatResponse, BackendQuizItem } from "@/types";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001/api"
    : "https://qna-genius-backend.vercel.app/api";

export async function generateQuiz(content: string): Promise<QuizResponse> {
  const response = await fetch(`${API_BASE_URL}/quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ articleInput: content }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate quiz: ${response.statusText}`);
  }

  const data = await response.json();

  // Map the backend response to frontend format
  const questions = (data.items || data.questions || []).map(
    (item: BackendQuizItem, index: number) => ({
      id: `question-${index}`,
      question: item.question,
      answer: item.answer,
      contextLarge: item.contextLarge,
      contextMedium: item.contextMedium,
      contextSmall: item.contextSmall,
    }),
  );

  return {
    questions,
  };
}

export async function sendChatMessage(
  question: string,
  answer: string,
  contextLarge: string,
  contextMedium: string,
  contextSmall: string,
  userMessage: string,
  attemptCount: number = 0,
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      qaData: {
        question,
        answer,
        contextLarge,
        contextMedium,
        contextSmall,
      },
      userMessage,
      attemptCount,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send chat message: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchArticleFromUrl(url: string): Promise<string> {
  try {
    // Use the backend extractor endpoint which fetches the URL server-side and returns text
    const response = await fetch(`${API_BASE_URL}/extract-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      // Try to parse error details from the backend
      const errBody = await response.json().catch(() => null);
      const msg =
        errBody?.error ||
        response.statusText ||
        "Failed to extract article text";
      throw new Error(msg);
    }

    const data = await response.json();

    if (!data || typeof data.text !== "string") {
      throw new Error("No text returned from extractor");
    }

    return data.text.trim();
  } catch (error) {
    console.error("Error extracting article text:", error);
    throw new Error(
      "Impossible de récupérer le contenu de l'article. Veuillez coller le contenu manuellement.",
    );
  }
}
