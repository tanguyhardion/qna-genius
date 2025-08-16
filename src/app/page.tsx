"use client";

import { useState } from "react";
import { HiExclamationTriangle, HiXMark } from "react-icons/hi2";
import { AppState, QuizQuestion, UserAnswer } from "@/types";
import { generateQuiz } from "@/utils/api";
import Header from "@/components/Header";
import ArticleInput from "@/components/ArticleInput";
import Quiz from "@/components/Quiz";
import QuizSummary from "@/components/QuizSummary";
import styles from "./page.module.scss";

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    step: "input",
    articleContent: "",
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isLoading: false,
    error: null,
  });

  const handleArticleSubmit = async (content: string) => {
    setAppState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      articleContent: content,
    }));

    try {
      const response = await generateQuiz(content);

      // Ensure we have a valid questions array
      const questions = response?.questions || [];

      if (questions.length === 0) {
        throw new Error(
          "Aucune question n'a pu être générée à partir de cet article.",
        );
      }

      // Add unique IDs to questions if they don't have them
      const questionsWithIds: QuizQuestion[] = questions.map((q, index) => ({
        ...q,
        id: q.id || `question-${index}`,
      }));

      setAppState((prev) => ({
        ...prev,
        questions: questionsWithIds,
        step: "quiz",
        isLoading: false,
        currentQuestionIndex: 0,
        userAnswers: [],
      }));
    } catch (error) {
      setAppState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la génération du quiz.",
        isLoading: false,
      }));
    }
  };

  const handleAnswerUpdate = (answer: UserAnswer) => {
    setAppState((prev) => ({
      ...prev,
      userAnswers: [
        ...prev.userAnswers.filter((a) => a.questionId !== answer.questionId),
        answer,
      ],
    }));
  };

  const handleNext = () => {
    setAppState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.min(
        prev.currentQuestionIndex + 1,
        prev.questions.length - 1,
      ),
    }));
  };

  const handleComplete = () => {
    setAppState((prev) => ({
      ...prev,
      step: "completed",
    }));
  };

  const handleRestart = () => {
    setAppState({
      step: "input",
      articleContent: "",
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      isLoading: false,
      error: null,
    });
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        {appState.error && (
          <div className={styles.errorBanner}>
            <div className={`alert alert-error ${styles.errorContent}`}>
              <HiExclamationTriangle className={styles.errorIcon} />
              <span className={styles.errorText}>{appState.error}</span>
              <button
                onClick={() =>
                  setAppState((prev) => ({ ...prev, error: null }))
                }
                className={styles.errorClose}
                aria-label="Fermer l'erreur"
              >
                <HiXMark />
              </button>
            </div>
          </div>
        )}

        {appState.step === "input" && (
          <ArticleInput
            onSubmit={handleArticleSubmit}
            isLoading={appState.isLoading}
          />
        )}

        {appState.step === "quiz" && appState.questions.length > 0 && (
          <Quiz
            questions={appState.questions}
            currentQuestionIndex={appState.currentQuestionIndex}
            userAnswers={appState.userAnswers}
            onAnswerUpdate={handleAnswerUpdate}
            onNext={handleNext}
            onComplete={handleComplete}
          />
        )}

        {appState.step === "completed" && (
          <QuizSummary
            questions={appState.questions}
            userAnswers={appState.userAnswers}
            onRestart={handleRestart}
          />
        )}
      </main>
      <footer className={styles.disclaimer}>
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}
        >
          <HiExclamationTriangle className={styles.disclaimerIcon} />
          Les questions et réponses sont générées par une IA et peuvent contenir
          des inexactitudes. Propulsé par GPT-4.1 Nano.
        </span>
      </footer>
    </div>
  );
}
