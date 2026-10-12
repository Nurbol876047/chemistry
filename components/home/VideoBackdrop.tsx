"use client";

interface Props {
  src: string;
  poster?: string;
  /** Затемнение поверх видео, 0..1 — чтобы текст и кнопки читались */
  dim?: number;
}

/**
 * Зацикленное фоновое видео на всю главную страницу.
 * На узких экранах видео не воспроизводим (экономия батареи/трафика) — остаётся постер.
 */
export function VideoBackdrop({ src, poster, dim = 0.55 }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden>
      {poster && (
        <div
          className="absolute inset-0 bg-cover bg-center md:hidden"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      <video
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      />
      <div className="absolute inset-0" style={{ background: `rgba(6,12,10,${dim})` }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,10,8,0.92)_100%)]" />
    </div>
  );
}
