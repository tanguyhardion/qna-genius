/**
 * Represents a single quiz question with multiple levels of context.
 * Used in the frontend to display questions and handle user interactions.
 */
export interface QuizQuestion {
  /** Unique identifier for the question */
  id: string;
  /** The question text (typically in French) */
  question: string;
  /** The correct answer text */
  answer: string;
  /** Large context snippet containing the answer (multiple paragraphs) */
  contextLarge: string;
  /** Medium context snippet containing the answer (few sentences) */
  contextMedium: string;
  /** Small context snippet containing the answer (single paragraph) */
  contextSmall: string;
}

/**
 * Raw quiz item structure as returned by the backend API.
 * Contains the same data as QuizQuestion but without the frontend-specific id field.
 */
export interface BackendQuizItem {
  /** The question text */
  question: string;
  /** The correct answer text */
  answer: string;
  /** Large context snippet from the original article */
  contextLarge: string;
  /** Medium context snippet from the original article */
  contextMedium: string;
  /** Small context snippet from the original article */
  contextSmall: string;
}

/**
 * Response structure for quiz generation API calls.
 * Contains the array of generated questions.
 */
export interface QuizResponse {
  /** Array of quiz questions generated from the article */
  questions: QuizQuestion[];
}

/**
 * Response structure for chat API calls.
 * Contains the AI's response to a user's follow-up question.
 */
export interface ChatResponse {
  /** The AI-generated response text */
  response: string;
  /** Number of conversation attempts for this question */
  attemptCount: number;
  /** The original question being discussed */
  question: string;
}

/**
 * Represents a user's answer to a quiz question.
 * Tracks the user's response, attempts, and any follow-up chat interactions.
 */
export interface UserAnswer {
  /** ID of the question this answer corresponds to */
  questionId: string;
  /** The user's answer text */
  answer: string;
  /** Number of attempts made by the user for this question */
  attempts: number;
  /** Array of chat responses from follow-up questions */
  chatResponses: string[];
}

/**
 * Main application state interface.
 * Manages the overall state of the quiz application flow.
 */
export interface AppState {
  /** Current step in the application flow */
  step: "input" | "quiz" | "completed";
  /** The article content being processed */
  articleContent: string;
  /** Array of all quiz questions */
  questions: QuizQuestion[];
  /** Index of the currently displayed question */
  currentQuestionIndex: number;
  /** Array of user's answers to all questions */
  userAnswers: UserAnswer[];
  /** Loading state for async operations */
  isLoading: boolean;
}
