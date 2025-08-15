'use client';

import { useState } from 'react';
import { AppState, QuizQuestion, UserAnswer } from '@/types';
import { generateQuiz } from '@/utils/api';
import Header from '@/components/Header';
import ArticleInput from '@/components/ArticleInput';
import Quiz from '@/components/Quiz';
import QuizSummary from '@/components/QuizSummary';
import styles from './page.module.scss';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    step: 'input',
    articleContent: '',
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isLoading: false,
    error: null,
  });

  const handleArticleSubmit = async (content: string) => {
    setAppState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      articleContent: content,
    }));

    try {
      const response = await generateQuiz(content);
      
      // Add unique IDs to questions if they don't have them
      const questionsWithIds: QuizQuestion[] = response.questions.map((q, index) => ({
        ...q,
        id: q.id || `question-${index}`,
      }));

      setAppState(prev => ({
        ...prev,
        questions: questionsWithIds,
        step: 'quiz',
        isLoading: false,
        currentQuestionIndex: 0,
        userAnswers: [],
      }));
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur lors de la génération du quiz.',
        isLoading: false,
      }));
    }
  };

  const handleAnswerUpdate = (answer: UserAnswer) => {
    setAppState(prev => ({
      ...prev,
      userAnswers: [
        ...prev.userAnswers.filter(a => a.questionId !== answer.questionId),
        answer,
      ],
    }));
  };

  const handleNext = () => {
    setAppState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1),
    }));
  };

  const handleComplete = () => {
    setAppState(prev => ({
      ...prev,
      step: 'completed',
    }));
  };

  const handleRestart = () => {
    setAppState({
      step: 'input',
      articleContent: '',
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
            <div className={styles.errorContent}>
              <span className={styles.errorIcon}>⚠️</span>
              <span className={styles.errorText}>{appState.error}</span>
              <button 
                onClick={() => setAppState(prev => ({ ...prev, error: null }))}
                className={styles.errorClose}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {appState.step === 'input' && (
          <ArticleInput
            onSubmit={handleArticleSubmit}
            isLoading={appState.isLoading}
          />
        )}

        {appState.step === 'quiz' && appState.questions.length > 0 && (
          <Quiz
            questions={appState.questions}
            currentQuestionIndex={appState.currentQuestionIndex}
            userAnswers={appState.userAnswers}
            onAnswerUpdate={handleAnswerUpdate}
            onNext={handleNext}
            onComplete={handleComplete}
          />
        )}

        {appState.step === 'completed' && (
          <QuizSummary
            questions={appState.questions}
            userAnswers={appState.userAnswers}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
