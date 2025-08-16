import { useState, useRef, useEffect } from "react";
import {
  HiDocument,
  HiLink,
  HiExclamationTriangle,
  HiXMark,
  HiRocketLaunch,
} from "react-icons/hi2";
import { fetchArticleFromUrl } from "@/utils/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./ArticleInput.module.scss";

interface ArticleInputProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

export default function ArticleInput({
  onSubmit,
  isLoading,
}: ArticleInputProps) {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [inputType, setInputType] = useState<"text" | "url">("text");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const MAX_TEXTAREA_HEIGHT = 480; // px — grows until this height, then scrolls

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (inputType === "text") {
      if (!content.trim()) {
        setError("Veuillez saisir le contenu de l'article.");
        return;
      }
      onSubmit(content.trim());
    } else {
      if (!url.trim()) {
        setError("Veuillez saisir une URL valide.");
        return;
      }

      setIsLoadingUrl(true);
      try {
        const articleContent = await fetchArticleFromUrl(url.trim());
        if (!articleContent) {
          throw new Error("Aucun contenu trouvé à cette URL.");
        }
        onSubmit(articleContent);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération de l'article.",
        );
      } finally {
        setIsLoadingUrl(false);
      }
    }
  };

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
    // adjust whenever content or input type changes
    if (inputType === "text") adjustTextareaHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, inputType]);

  const isSubmitDisabled =
    isLoading ||
    isLoadingUrl ||
    (inputType === "text" ? !content.trim() : !url.trim());

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Commencez votre quiz</h2>
        <p className={styles.description}>
          Collez le contenu d'un article ou fournissez une URL pour générer
          automatiquement un quiz de 10 questions.
        </p>

        <div className={styles.inputTypeSelector}>
          <button
            type="button"
            className={`${styles.tabButton} ${
              inputType === "text" ? styles.active : ""
            }`}
            onClick={() => setInputType("text")}
          >
            <HiDocument className={styles.tabIcon} />
            Coller le texte
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${
              inputType === "url" ? styles.active : ""
            }`}
            onClick={() => setInputType("url")}
          >
            <HiLink className={styles.tabIcon} />
            URL de l'article
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {inputType === "text" ? (
            <div className={styles.inputGroup}>
              <label htmlFor="content" className={styles.label}>
                Contenu de l'article
              </label>
              <textarea
                id="content"
                ref={textareaRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  // immediate adjust for smoother UX
                  requestAnimationFrame(adjustTextareaHeight);
                }}
                placeholder="Collez ici le contenu de votre article..."
                className={styles.textarea}
                rows={3}
                disabled={isLoading}
              />
            </div>
          ) : (
            <div className={styles.inputGroup}>
              <label htmlFor="url" className={styles.label}>
                URL de l'article
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemple.com/article"
                className={styles.input}
                disabled={isLoading || isLoadingUrl}
              />
              <p className={styles.urlNote}>
                <HiExclamationTriangle className={styles.warningIcon} />
                Certaines pages peuvent ne pas être récupérées par raison de
                sécurité ou de contenu dynamique.
              </p>
            </div>
          )}

          {error && (
            <div className={`alert alert-error ${styles.error}`}>
              <HiXMark className={styles.errorIcon} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitButton}`}
            disabled={isSubmitDisabled}
          >
            {isLoading || isLoadingUrl ? (
              <>
                <LoadingSpinner />
                {isLoadingUrl
                  ? "Récupération de l'article..."
                  : "Génération du quiz..."}
              </>
            ) : (
              <>
                <HiRocketLaunch className={styles.submitIcon} />
                Générer le quiz
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
