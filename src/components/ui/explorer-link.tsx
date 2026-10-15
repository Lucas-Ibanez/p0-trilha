import { useTranslations } from "next-intl";
import { ExternalLink } from "@/components/ui/external-link";

type Props = {
  /** URL já montada por src/lib/evidence.ts (sempre com cluster=devnet). */
  href: string;
  /** Id do desfecho ou da rejeição, para o evento `explorer_click`. */
  explorerId: string;
  children?: React.ReactNode;
  className?: string;
};

export function ExplorerLink({ href, explorerId, children, className = "" }: Props) {
  const t = useTranslations("common");
  return (
    <ExternalLink
      href={href}
      explorerId={explorerId}
      className={`underline underline-offset-4 ${className}`.trim()}
    >
      {children ?? t("explorer")} <span aria-hidden="true">↗</span>
    </ExternalLink>
  );
}
