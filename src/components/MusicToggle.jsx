import React, { useRef, useState } from "react";
import { config } from "../../config.js";

export default function MusicToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  if (!config.musicSrc) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying((p) => !p);
  };

  return (
    <>
      <audio ref={audioRef} src={config.musicSrc} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute background music" : "Play background music"}
        aria-pressed={playing}
        className="focus-gold fixed right-5 top-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-charcoal-light/70 theme-light:bg-champagne/70 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-charcoal-deep"
      >
        {playing ? "♪" : "♪̸"}
      </button>
    </>
  );
}
