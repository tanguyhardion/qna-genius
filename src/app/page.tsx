"use client";

import { useState } from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import { AppState, QuizQuestion, UserAnswer } from "@/types";
import { generateQuiz } from "@/utils/api";
import { useToast } from "@/hooks/useToast";
import Header from "@/components/Header";
import ArticleInput from "@/components/ArticleInput";
import Quiz from "@/components/Quiz";
import QuizSummary from "@/components/QuizSummary";
import styles from "./page.module.scss";

export default function Home() {
  const toast = useToast();
  const [appState, setAppState] = useState<AppState>({
    step: "input",
    articleContent: "",
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isLoading: false,
  });

  const handleArticleSubmit = async (content: string) => {
    setAppState((prev) => ({
      ...prev,
      isLoading: true,
      articleContent: content,
    }));

    try {
      const response = await generateQuiz(content);

      // Ensure we have a valid questions array
      const questions = response?.questions || [];

      if (questions.length === 0) {
        throw new Error(
          "Aucune question n'a pu être générée à partir de cet article."
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

      toast.success(
        `Quiz généré avec succès ! ${questionsWithIds.length} questions créées.`
      );
    } catch (error) {
      let errorMessage = "Erreur lors de la génération du quiz.";
      if (error instanceof Error) {
        errorMessage += ` Détails : ${error.message}`;
      }

      toast.error(errorMessage);

      setAppState((prev) => ({
        ...prev,
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
        prev.questions.length - 1
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
    });
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
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
          des inexactitudes. Propulsé par GPT-5 Nano.
        </span>
      </footer>
    </div>
  );
}
