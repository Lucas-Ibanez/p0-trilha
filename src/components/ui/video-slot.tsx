"use client";

import Image from "next/image";
import { useState } from "react";
import { logo } from "@/lib/brand";
import type { VideoSource } from "@/lib/demo";
import { track } from "@/lib/track";

type Props = {
  title: string;
  /** Sem fonte: estado "em breve" (nunca um player falso). */
  source: VideoSource | null;
  labels: {
    soon: string;
    lang: string;
    play: string;
    playAria: string;
    newTab: string;
  };
};

const SYMBOL_WIDTH = 56;

function Poster() {
  return (
    <div className="rounded-control bg-subtle flex aspect-video items-center justify-center">
      {/* Pôster provisório: ainda não há captura real da interface (TODO(content)). */}
      <Image
        src={logo.symbol.onAubergineWarmWhite}
        alt=""
        aria-hidden="true"
        width={SYMBOL_WIDTH}
        height={Math.round(SYMBOL_WIDTH / logo.symbol.ratio)}
        unoptimized
      />
    </div>
  );
}

/**
 * Slot de vídeo da demo (docs/06 §7). Click-to-load: o iframe ou o <video> só entram no DOM
 * depois do clique, então nada de terceiros carrega no primeiro acesso.
 */
export function VideoSlot({ title, source, labels }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (!source) {
    return (
      <div>
        <Poster />
        <h3 className="text-h4 mt-4 font-semibold">{title}</h3>
        <p className="text-secondary mt-1">{labels.soon}</p>
        <p className="text-caption text-secondary mt-1">{labels.lang}</p>
      </div>
    );
  }

  return (
    <div>
      {source.kind === "link" ? (
        <>
          <Poster />
          <h3 className="text-h4 mt-4 font-semibold">{title}</h3>
          <a
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track({ name: "demo_play" })}
            className="rounded-control border-primary mt-3 inline-flex min-h-11 items-center border-2 px-4 font-semibold"
          >
            {labels.play}
            <span className="sr-only">
              {" "}
              ({title}, {labels.newTab})
            </span>
          </a>
        </>
      ) : loaded ? (
        <>
          <div className="rounded-control aspect-video overflow-hidden">
            {source.kind === "youtube" ? (
              <iframe
                src={source.embedUrl}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="size-full border-0"
              />
            ) : (
              <video
                src={source.src}
                controls
                autoPlay
                playsInline
                preload="none"
                aria-label={title}
                className="size-full"
              />
            )}
          </div>
          <h3 className="text-h4 mt-4 font-semibold">{title}</h3>
        </>
      ) : (
        <>
          {/* O pôster também é clicável, mas só o botão "Reproduzir" entra na ordem do teclado. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => {
              track({ name: "demo_play" });
              setLoaded(true);
            }}
            className="rounded-control block w-full"
          >
            <Poster />
          </button>
          <h3 className="text-h4 mt-4 font-semibold">{title}</h3>
          <button
            type="button"
            onClick={() => {
              track({ name: "demo_play" });
              setLoaded(true);
            }}
            aria-label={labels.playAria}
            className="rounded-control border-primary mt-3 min-h-11 border-2 px-4 font-semibold"
          >
            {labels.play}
          </button>
        </>
      )}
      <p className="text-caption text-secondary mt-1">{labels.lang}</p>
    </div>
  );
}
