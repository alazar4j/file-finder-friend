import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function fmt(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export function AudioPlayer({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setTime(a.currentTime);
    const onMeta = () => setDur(a.duration);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [src]);

  function toggle() {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-full border border-gold/40 bg-primary px-3 py-2 text-primary-foreground">
      <audio ref={ref} src={src} preload="metadata" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-primary transition-opacity hover:opacity-90"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
      </button>
      <input
        type="range"
        min={0}
        max={dur || 0}
        step={0.1}
        value={time}
        aria-label="Seek"
        onChange={(e) => {
          const v = Number(e.target.value);
          if (ref.current) ref.current.currentTime = v;
          setTime(v);
        }}
        className="min-w-0 flex-1 accent-[var(--gold)]"
      />
      <span className="shrink-0 text-xs tabular-nums text-primary-foreground/80">
        {fmt(time)} / {fmt(dur)}
      </span>
    </div>
  );
}
