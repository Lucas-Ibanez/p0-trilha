"use client";

import { useTranslations } from "next-intl";
import { track } from "@/lib/track";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Quando presente, o clique dispara `explorer_click` com este id (desfecho ou rejeição). */
  explorerId?: string;
};

/** Link externo: nova aba, rel seguro e aviso para leitor de tela (docs/06 §9). */
export function ExternalLink({ href, children, className, explorerId }: Props) {
  const t = useTranslations("a11y");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={
        explorerId
          ? () => track({ name: "explorer_click", props: { outcomeId: explorerId } })
          : undefined
      }
    >
      {children}
      <span className="sr-only"> ({t("newTab")})</span>
    </a>
  );
}
