import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  variant?: 'dots' | 'pulse' | 'spin';
}

export default function LoadingSpinner({ size = 'medium', text, variant = 'dots' }: LoadingSpinnerProps) {
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      {variant === 'dots' ? (
        <div className={styles.dotsSpinner}>
          <div className={styles.dot1}></div>
          <div className={styles.dot2}></div>
          <div className={styles.dot3}></div>
        </div>
      ) : variant === 'pulse' ? (
        <div className={styles.pulseSpinner}></div>
      ) : (
        <div className={styles.spinner}></div>
      )}
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}
