import { QuizResponse, ChatResponse, BackendQuizItem } from "@/types";

/**
 * API utility functions for the Q&A Genius application.
 * Handles communication with the backend API for quiz generation, chat functionality,
 * and article text extraction.
 */

/**
 * Base URL for the backend API.
 * Uses localhost in development mode, production URL otherwise.
 */
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001/api"
    : "https://qna-genius-backend.vercel.app/api";

/**
 * Generates a quiz from the provided article content.
 * Sends the content to the backend API which processes it and returns quiz questions.
 *
 * @param content - The article text content to generate quiz questions from
 * @returns Promise resolving to a QuizResponse containing the generated questions
 * @throws Error if the API request fails
 */
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
  // The backend may return items or questions array, handle both cases
  const questions = (data.items || data.questions || []).map(
    (item: BackendQuizItem, index: number) => ({
      id: `question-${index}`,
      question: item.question,
      answer: item.answer,
      contextLarge: item.contextLarge,
      contextMedium: item.contextMedium,
      contextSmall: item.contextSmall,
    })
  );

  return {
    questions,
  };
}

/**
 * Sends a chat message to the backend API for processing.
 * Used for interactive Q&A functionality where users can ask follow-up questions
 * about quiz answers with different levels of context.
 *
 * @param question - The original quiz question
 * @param answer - The correct answer to the quiz question
 * @param contextLarge - Large context snippet surrounding the answer
 * @param contextMedium - Medium context snippet surrounding the answer
 * @param contextSmall - Small context snippet surrounding the answer
 * @param userMessage - The user's follow-up question or message
 * @param attemptCount - Number of previous attempts (for tracking conversation history)
 * @returns Promise resolving to a ChatResponse with the AI's response
 * @throws Error if the API request fails
 */
export async function sendChatMessage(
  question: string,
  answer: string,
  contextLarge: string,
  contextMedium: string,
  contextSmall: string,
  userMessage: string,
  attemptCount: number = 0
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

/**
 * Extracts and returns the text content from a given URL.
 * Uses the backend API to fetch the URL server-side and extract readable text,
 * avoiding CORS issues that would occur with client-side fetching.
 *
 * @param url - The URL of the article to extract text from
 * @returns Promise resolving to the extracted text content as a string
 * @throws Error if the URL cannot be fetched or text cannot be extracted
 */
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
      "Impossible de récupérer le contenu de l'article. Veuillez coller le contenu manuellement."
    );
  }
}
