export interface QuizQuestion {
  id: string;
  question: string;
  answer: string;
  contextLarge: string;
  contextMedium: string;
  contextSmall: string;
}

export interface BackendQuizItem {
  question: string;
  answer: string;
  contextLarge: string;
  contextMedium: string;
  contextSmall: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
}

export interface ChatResponse {
  response: string;
  attemptCount: number;
  question: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  attempts: number;
  chatResponses: string[];
}

export interface AppState {
  step: "input" | "quiz" | "completed";
  articleContent: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isLoading: boolean;
}
