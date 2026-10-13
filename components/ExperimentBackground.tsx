"use client";

/**
 * Бір тәжірибе экранының ортақ фоны — каталог/[id] мен журнал беттерінде
 * тұрақты ойналатын жалғыз бейне қабаты ("общий фон"). Беттер арасында
 * ауысқанда қайта іске қосылмайды, себебі AppShell-де бір рет орналасады.
 */
export function ExperimentBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-bg" aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: "url(/videos/lobby-bg-poster.jpg)" }}
      />
      <video
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        src="/videos/lobby-bg.mp4"
        poster="/videos/lobby-bg-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      />
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}
