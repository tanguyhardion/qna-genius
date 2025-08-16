import { useState } from 'react';
import { QuizQuestion, UserAnswer } from '@/types';
import { sendChatMessage } from '@/utils/api';
import styles from './Quiz.module.scss';

interface QuizProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  onAnswerUpdate: (answer: UserAnswer) => void;
  onNext: () => void;
  onComplete: () => void;
}

export default function Quiz({
  questions,
  currentQuestionIndex,
  userAnswers,
  onAnswerUpdate,
  onNext,
  onComplete,
}: QuizProps) {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(
        currentQuestion.question,
        currentQuestion.answer,
        currentQuestion.context,
        userInput.trim(),
        currentAnswer?.attempts || 0
      );

      const newAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        answer: userInput.trim(),
        attempts: response.attemptCount,
        chatResponses: [...(currentAnswer?.chatResponses || []), response.response],
      };

      onAnswerUpdate(newAnswer);
      setUserInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi de la réponse.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setShowAnswer(false); // Reset answer visibility for next question
    if (isLastQuestion) {
      onComplete();
    } else {
      onNext();
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <span className={styles.questionNumber}>
            Question {currentQuestionIndex + 1} sur {questions.length}
          </span>
          {currentAnswer && (
            <span className={styles.attempts}>
              {currentAnswer.attempts} tentative{currentAnswer.attempts > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <h2 className={styles.questionText}>{currentQuestion.question}</h2>

        {currentAnswer && currentAnswer.chatResponses.length > 0 && (
          <div className={styles.chatHistory}>
            <h3 className={styles.chatTitle}>💬 Réponses de l'assistant :</h3>
            {currentAnswer.chatResponses.map((response, index) => (
              <div key={index} className={styles.chatMessage}>
                <div className={styles.chatContent}>{response}</div>
              </div>
            ))}
          </div>
        )}

        {/* Reveal Answer Section */}
        <div className={styles.revealSection}>
          {!showAnswer ? (
            <button
              type="button"
              className={styles.revealButton}
              onClick={() => setShowAnswer(true)}
              title="Afficher la réponse correcte"
            >
              💡 Voir la réponse
            </button>
          ) : (
            <div className={styles.answerReveal}>
              <div className={styles.answerLabel}>✅ Réponse correcte :</div>
              <div className={styles.answerContent}>{currentQuestion.answer}</div>
              <button
                type="button"
                className={styles.hideButton}
                onClick={() => setShowAnswer(false)}
                title="Masquer la réponse"
              >
                👁️ Masquer
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmitAnswer} className={styles.answerForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="answer" className={styles.label}>
              Votre réponse :
            </label>
            <textarea
              id="answer"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Tapez votre réponse ici..."
              className={styles.textarea}
              rows={4}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className={styles.error}>
              ❌ {error}
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!userInput.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading"></span>
                  Envoi en cours...
                </>
              ) : (
                '💬 Envoyer la réponse'
              )}
            </button>

            {currentAnswer && currentAnswer.chatResponses.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleNext}
              >
                {isLastQuestion ? '🏁 Terminer le quiz' : '➡️ Question suivante'}
              </button>
            )}
          </div>
        </form>
      </div>

      {currentQuestion.context && (
        <div className={styles.contextCard}>
          <h3 className={styles.contextTitle}>📚 Contexte :</h3>
          <p className={styles.contextText}>{currentQuestion.context}</p>
        </div>
      )}
    </div>
  );
}
