import { useState, useRef, useEffect } from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import {
  FaArrowRight,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaFlag,
  FaSearchPlus,
  FaSearch,
  FaSearchMinus,
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { QuizQuestion, UserAnswer } from "@/types";
import { sendChatMessage } from "@/utils/api";
import { useToast } from "@/hooks/useToast";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./Quiz.module.scss";

interface QuizProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  onAnswerUpdate: (answer: UserAnswer) => void;
  onNext: () => void;
  onComplete: () => void;
}

// displays a quiz question with chat interaction and context
export default function Quiz({
  questions,
  currentQuestionIndex,
  userAnswers,
  onAnswerUpdate,
  onNext,
  onComplete,
}: QuizProps) {
  const toast = useToast();
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement | null>(null);
  const MAX_TEXTAREA_HEIGHT = 200; // px — grows until this height, then scrolls

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(
    (a) => a.questionId === currentQuestion.id,
  );
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Determine which context to show based on number of wrong attempts
  const getContextToShow = () => {
    const attempts = currentAnswer?.attempts || 0;
    if (attempts === 0) {
      return currentQuestion.contextLarge;
    } else if (attempts === 1) {
      return currentQuestion.contextMedium;
    } else {
      // 2 or more attempts, show small context
      return currentQuestion.contextSmall;
    }
  };

  const getContextLabel = () => {
    const attempts = currentAnswer?.attempts || 0;
    if (attempts === 0) {
      return "Contexte (général)";
    } else if (attempts === 1) {
      return "Contexte (intermédiaire)";
    } else {
      return "Contexte (spécifique)";
    }
  };

  const getContextIcon = () => {
    const attempts = currentAnswer?.attempts || 0;
    if (attempts === 0) {
      return <FaSearchMinus className={styles.contextIcon} />;
    } else if (attempts === 1) {
      return <FaSearch className={styles.contextIcon} />;
    } else {
      return <FaSearchPlus className={styles.contextIcon} />;
    }
  };

  const getContextHelpText = () => {
    const attempts = currentAnswer?.attempts || 0;
    if (attempts === 0) {
      return "Contexte général pour vous aider à comprendre le sujet.";
    } else if (attempts === 1) {
      return "Contexte plus ciblé après votre première tentative.";
    } else {
      return "Contexte très spécifique après plusieurs tentatives.";
    }
  };

  const getContextClassName = () => {
    const attempts = currentAnswer?.attempts || 0;
    if (attempts === 0) {
      return `${styles.contextCard} ${styles.contextLarge}`;
    } else if (attempts === 1) {
      return `${styles.contextCard} ${styles.contextMedium}`;
    } else {
      return `${styles.contextCard} ${styles.contextSmall}`;
    }
  };

  // adjusts textarea height for user input
  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    // reset height to measure scrollHeight correctly
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT);
    el.style.height = `${newHeight}px`;
    el.style.overflow =
      el.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
  };

  useEffect(() => {
    // adjust whenever userInput changes
    adjustTextareaHeight();
  }, [userInput]);

  // auto-scrolls chat history to bottom when new responses added
  useEffect(() => {
    if (chatHistoryRef.current && currentAnswer?.chatResponses.length) {
      const chatContainer = chatHistoryRef.current;
      // Use setTimeout to ensure DOM is fully updated before scrolling
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 100);
    }
  }, [currentAnswer?.chatResponses.length]);

  // submits user answer and gets AI response
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        currentQuestion.question,
        currentQuestion.answer,
        currentQuestion.contextLarge,
        currentQuestion.contextMedium,
        currentQuestion.contextSmall,
        userInput.trim(),
        currentAnswer?.attempts || 0,
      );

      const newAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        answer: userInput.trim(),
        attempts: response.attemptCount,
        chatResponses: [
          ...(currentAnswer?.chatResponses || []),
          response.response,
        ],
      };

      onAnswerUpdate(newAnswer);
      setUserInput("");
      toast.success("Réponse envoyée avec succès !");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'envoi de la réponse.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // moves to next question or completes quiz
  const handleNext = () => {
    setShowAnswer(false); // Reset answer visibility for next question
    if (isLastQuestion) {
      onComplete();
    } else {
      onNext();
    }
  };

  // calculates progress percentage
  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

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
              {currentAnswer.attempts} tentative
              {currentAnswer.attempts > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <h2 className={styles.questionText}>{currentQuestion.question}</h2>

        {currentAnswer && currentAnswer.chatResponses.length > 0 && (
          // displays previous chat responses
          <div className={styles.chatHistory} ref={chatHistoryRef}>
            <h3 className={styles.chatTitle}>
              <HiChatBubbleLeftRight className={styles.chatIcon} />
              Réponses de l'assistant :
            </h3>
            {currentAnswer.chatResponses.map((response, index) => (
              <div key={index} className={styles.chatMessage}>
                <div className={styles.chatContent}>{response}</div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmitAnswer} className={styles.answerForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="answer" className={styles.label}>
              Votre réponse :
            </label>
            <textarea
              id="answer"
              ref={textareaRef}
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                requestAnimationFrame(adjustTextareaHeight);
              }}
              placeholder="Tapez votre réponse ici..."
              className={`${styles.textarea} textarea-with-scrollbar`}
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={`btn btn-primary ${styles.submitButton}`}
              disabled={!userInput.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <IoSend size={20} />
                  Envoyer
                </>
              )}
            </button>

            {(currentAnswer && currentAnswer.chatResponses.length > 0) ||
            showAnswer ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleNext}
              >
                {isLastQuestion ? (
                  <>
                    <FaFlag />
                    Terminer le quiz
                  </>
                ) : (
                  <>
                    <FaArrowRight />
                    Question suivante
                  </>
                )}
              </button>
            ) : null}
          </div>
        </form>
      </div>
      {currentQuestion.contextLarge && (
        <div className={getContextClassName()}>
          <h3 className={styles.contextTitle}>
            {getContextIcon()}
            {getContextLabel()}
          </h3>
          <div className={styles.contextHelpText}>{getContextHelpText()}</div>
          <p className={styles.contextText}>{getContextToShow()}</p>
        </div>
      )}
      {/* section to reveal the correct answer */}
      <div className={styles.revealSection}>
        {!showAnswer ? (
          <button
            type="button"
            className={styles.revealButton}
            onClick={() => setShowAnswer(true)}
            title="Afficher la réponse correcte"
          >
            <FaEye className={styles.revealIcon} />
            Voir la réponse
          </button>
        ) : (
          <div className={styles.answerReveal}>
            <div className={styles.answerLabel}>
              <FaCheckCircle className={styles.answerIcon} />
              Réponse correcte :
            </div>
            <div className={styles.answerContent}>{currentQuestion.answer}</div>
            <button
              type="button"
              className={styles.revealButton}
              onClick={() => setShowAnswer(false)}
              title="Masquer la réponse"
            >
              <FaEyeSlash className={styles.revealIcon} />
              Masquer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
