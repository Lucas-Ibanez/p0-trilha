"use client";

import { useRef } from "react";

type Props = {
  label: string;
  children: React.ReactNode;
};

/** Menu de seções para telas estreitas: <details> nativo, fechado ao escolher um destino. */
export function MobileMenu({ label, children }: Props) {
  const ref = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={ref} className="lg:hidden">
      <summary className="rounded-control border-soft text-label inline-flex min-h-11 cursor-pointer list-none items-center gap-2 border px-3 font-semibold">
        {label}
        <span aria-hidden="true">▾</span>
      </summary>
      <div
        className="bg-page border-soft absolute inset-x-0 top-full border-b"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) ref.current?.removeAttribute("open");
        }}
      >
        <div className="container-page py-4">{children}</div>
      </div>
    </details>
  );
}
