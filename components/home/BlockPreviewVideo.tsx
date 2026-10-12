"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface Props {
  src: string;
  title: string;
  onDone: () => void;
}

/**
 * Тақырып бейнесі: блок түймесін бассаңыз, тәжірибенің нәтиже бейнесі
 * толық экранда (fixed, opaque) ойнайды да, аяқталған соң (немесе өткізіп
 * жіберсе) блок бірден ашылады. Фон мөлдір емес — артындағы бас парақ
 * элементтері (тақырып, түймелер) мүлде көрінбеуі керек.
 */
export function BlockPreviewVideo({ src, title, onDone }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => onDone());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-cover"
        playsInline
        onEnded={onDone}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-6 py-5">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white drop-shadow">
          {title}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/55 to-transparent px-6 py-6">
        <button
          onClick={onDone}
          className="flex items-center gap-1.5 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-black/50"
        >
          <X size={14} /> Өткізіп жіберу
        </button>
      </div>
    </div>
  );
}
