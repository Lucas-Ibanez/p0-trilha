import { useTranslations } from "next-intl";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/** Link externo: nova aba, rel seguro e aviso para leitor de tela (docs/06 §9). */
export function ExternalLink({ href, children, className }: Props) {
  const t = useTranslations("a11y");
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> ({t("newTab")})</span>
    </a>
  );
}
