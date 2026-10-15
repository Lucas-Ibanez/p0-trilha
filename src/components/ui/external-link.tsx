import { useTranslations } from "next-intl";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Quando presente, o clique vira o evento `explorer_click` (ClickTracker lê o data-attribute). */
  explorerId?: string;
};

/** Link externo: nova aba, rel seguro e aviso para leitor de tela (docs/06 §9). Componente de servidor. */
export function ExternalLink({ href, children, className, explorerId }: Props) {
  const t = useTranslations("a11y");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...(explorerId ? { "data-track": "explorer_click", "data-track-id": explorerId } : {})}
    >
      {children}
      <span className="sr-only"> ({t("newTab")})</span>
    </a>
  );
}
