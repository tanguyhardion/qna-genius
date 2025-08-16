import { IoSparkles } from "react-icons/io5";
import { FaBolt, FaLightbulb } from "react-icons/fa6";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <FaLightbulb className={styles.logo} />
            Q&A Genius
          </h1>
        </div>
        <p className={styles.subtitle}>
          Transformez vos articles, textes et documents en quiz interactifs pour
          apprendre efficacement.
        </p>
        <div className={styles.aiPowered}>
          <FaBolt className={styles.aiIcon} />
          <span className={styles.aiText}>Propulsé par l'IA</span>
          <IoSparkles className={styles.sparkles} />
        </div>
      </div>
    </header>
  );
}
