import { HiLightBulb } from 'react-icons/hi2';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <HiLightBulb className={styles.logo} />
          Q&A Genius
        </h1>
        <p className={styles.subtitle}>
          Transformez vos articles en quiz interactifs et apprenez plus efficacement
        </p>
      </div>
    </header>
  );
}
