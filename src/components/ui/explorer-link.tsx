import { useTranslations } from "next-intl";
import { ExternalLink } from "@/components/ui/external-link";

type Props = {
  /** URL já montada por src/lib/evidence.ts (sempre com cluster=devnet). */
  href: string;
  children?: React.ReactNode;
  className?: string;
};

export function ExplorerLink({ href, children, className = "" }: Props) {
  const t = useTranslations("common");
  return (
    <ExternalLink href={href} className={`underline underline-offset-4 ${className}`.trim()}>
      {children ?? t("explorer")} <span aria-hidden="true">↗</span>
    </ExternalLink>
  );
}
