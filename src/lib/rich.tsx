import type { ReactNode } from "react";

/** Marcação permitida nas mensagens (`<code>…</code>`, `<em>…</em>`), via rich text do next-intl. */
export const richTags = {
  code: (chunks: ReactNode) => <code className="font-mono text-mono">{chunks}</code>,
  em: (chunks: ReactNode) => <em>{chunks}</em>,
};
