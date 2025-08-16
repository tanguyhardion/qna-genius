import { HiTrophy, HiClipboardDocumentList, HiCheckCircle, HiLightBulb, HiChatBubbleLeftRight, HiArrowPath } from 'react-icons/hi2';
import { QuizQuestion, UserAnswer } from '@/types';
import styles from './QuizSummary.module.scss';

interface QuizSummaryProps {
  questions: QuizQuestion[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

export default function QuizSummary({ questions, userAnswers, onRestart }: QuizSummaryProps) {
  const totalQuestions = questions.length;
  const answeredQuestions = userAnswers.length;
  const totalAttempts = userAnswers.reduce((sum, answer) => sum + answer.attempts, 0);
  const averageAttempts = totalAttempts / answeredQuestions;

  return (
    <div className={styles.container}>
      <div className={styles.summaryCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <HiTrophy className={styles.titleIcon} />
            Quiz terminé !
          </h2>
          <p className={styles.subtitle}>
            Félicitations ! Vous avez terminé le quiz. Voici un résumé de votre performance.
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{answeredQuestions}</div>
            <div className={styles.statLabel}>Questions répondues</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalAttempts}</div>
            <div className={styles.statLabel}>Total des tentatives</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{averageAttempts ? averageAttempts.toFixed(2) : '0'}</div>
            <div className={styles.statLabel}>Moyenne par question</div>
          </div>
        </div>

        <div className={styles.questionsReview}>
          <h3 className={styles.reviewTitle}>
            <HiClipboardDocumentList className={styles.reviewIcon} />
            Récapitulatif des questions
          </h3>
          <div className={styles.questionsList}>
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find(a => a.questionId === question.id);
              return (
                <div key={question.id} className={styles.questionItem}>
                  <div className={styles.questionHeader}>
                    <span className={styles.questionNumber}>Question {index + 1}</span>
                    {userAnswer && (
                      <span className={styles.attempts}>
                        {userAnswer.attempts} tentative{userAnswer.attempts > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <h4 className={styles.questionText}>{question.question}</h4>
                  
                  <div className={styles.answers}>
                    <div className={styles.correctAnswer}>
                      <strong>
                        <HiCheckCircle className={styles.answerIcon} />
                        Réponse attendue :
                      </strong>
                      <p>{question.answer}</p>
                    </div>
                    
                    {userAnswer && (
                      <div className={styles.userResponse}>
                        <strong>
                          <HiLightBulb className={styles.answerIcon} />
                          Votre dernière réponse :
                        </strong>
                        <p>{userAnswer.answer}</p>
                        
                        {userAnswer.chatResponses.length > 0 && (
                          <div className={styles.aiResponses}>
                            <strong>
                              <HiChatBubbleLeftRight className={styles.answerIcon} />
                              Retours de l'assistant :
                            </strong>
                            {userAnswer.chatResponses.map((response, responseIndex) => (
                              <div key={responseIndex} className={styles.aiResponse}>
                                <span className={styles.responseNumber}>
                                  Tentative {responseIndex + 1} :
                                </span>
                                <p>{response}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            onClick={onRestart}
            className="btn btn-primary"
          >
            <HiArrowPath className={styles.actionIcon} />
            Recommencer avec un nouvel article
          </button>
        </div>
      </div>
    </div>
  );
}
