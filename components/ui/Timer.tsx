"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, CheckCircle2 } from "lucide-react";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Timer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const done = remaining === 0;

  return (
    <div
      className={`mt-2 flex items-center gap-3 rounded-md border px-3 py-2 ${
        done ? "border-emerald-300 bg-emerald-50" : "border-line bg-bg"
      }`}
    >
      {done ? (
        <CheckCircle2 size={18} className="text-emerald-600" />
      ) : (
        <span className="font-mono text-sm tabular-nums text-ink">{formatTime(remaining)}</span>
      )}
      <span className="text-xs text-muted">
        {done ? "Күту уақыты аяқталды" : "Күту керек"}
      </span>
      <div className="ml-auto flex items-center gap-1">
        {!done && (
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="rounded-md border border-line bg-surface p-1.5 hover:bg-bg"
            aria-label={running ? "Аялдату" : "Бастау"}
          >
            {running ? <Pause size={14} /> : <Play size={14} />}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setRemaining(seconds);
            setRunning(false);
          }}
          className="rounded-md border border-line bg-surface p-1.5 hover:bg-bg"
          aria-label="Қайта бастау"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
