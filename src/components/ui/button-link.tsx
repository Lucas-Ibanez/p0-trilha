"use client";

import { track, type TrackEvent } from "@/lib/track";

type Props = {
  href: string;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  className?: string;
  /** Evento de analytics disparado no clique (docs/01 §5.3); no-op até a decisão D8. */
  trackEvent?: TrackEvent;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

const base =
  "rounded-control inline-flex items-center justify-center text-center font-semibold transition-opacity hover:opacity-90";
const sizes = {
  md: "min-h-12 px-6 text-body",
  sm: "min-h-11 px-4 text-label",
};
const variants = {
  /* Âmbar: ação prioritária, no máximo um por viewport (docs/04 §10). */
  primary: "bg-action text-on-action",
  secondary: "border-primary text-primary border-2",
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  trackEvent,
  children,
  onClick,
  ...rest
}: Props) {
  return (
    <a
      href={href}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`.trim()}
      onClick={(event) => {
        if (trackEvent) track(trackEvent);
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
