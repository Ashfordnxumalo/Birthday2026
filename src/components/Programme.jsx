import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../config.js";
import { isMcMode } from "../lib/useTab.js";
import { removeValue, setValue, useLiveValue } from "../lib/liveStore.js";
import Particles from "./Particles.jsx";
import Reveal from "./Reveal.jsx";
import ProgrammeEditor, { PROGRAMME_PATH, normaliseProgramme } from "./ProgrammeEditor.jsx";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const isDinnerInterlude = (act) => act.items.length === 1 && act.act.toLowerCase().includes("dinner");

// Number every item across acts so the live marker can point at one index.
function useFlatProgramme(programme) {
  return useMemo(() => {
    let n = 0;
    const acts = programme.map((act) => ({
      ...act,
      items: act.items.map((item) => ({ ...item, index: n++ })),
    }));
    return { acts, flat: acts.flatMap((a) => a.items.map((i) => ({ ...i, act: a.act }))) };
  }, [programme]);
}

function NowPlaying({ current, next, total }) {
  if (!current) return null;
  const progress = ((current.index + 1) / total) * 100;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="sticky top-[4.5rem] z-30 mx-auto mb-14 sm:top-4 max-w-2xl overflow-hidden rounded-2xl border border-gold/60 bg-canvas-light/85 p-5 shadow-[0_0_60px_rgba(212,175,55,0.18)] backdrop-blur-md"
      aria-live="polite"
    >
      <div className="flex items-center gap-4">
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold-deep">Now happening</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={current.index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="break-words font-display text-lg leading-snug text-ink sm:text-2xl"
            >
              {current.title}
              {current.person && <span className="text-gold"> · {current.person}</span>}
            </motion.p>
          </AnimatePresence>
          {next && (
            <p className="mt-1 break-words text-xs text-ink/60">
              Up next: {next.title}
            </p>
          )}
        </div>
        <p className="shrink-0 font-display text-sm text-gold">
          {current.index + 1}
          <span className="text-gold/50">/{total}</span>
        </p>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-gold/15">
        <motion.div
          className="h-full rounded-full bg-gold-shimmer bg-[length:200%_auto] animate-shimmer"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

function ProgrammeItem({ item, state, mc, onSelect }) {
  const node = {
    done: "border-gold/40 bg-gold/20 text-gold",
    current: "border-gold bg-gold-light text-ink shadow-[0_0_24px_rgba(212,175,55,0.8)]",
    upcoming: "border-gold/40 bg-canvas-light text-gold",
  }[state];

  const Wrapper = mc ? "button" : "div";

  return (
    <div data-step={item.index} className="relative pl-16 sm:pl-20">
      <span
        className={`absolute left-0 top-1 flex h-11 w-11 items-center justify-center rounded-full border font-display text-sm transition-all duration-500 sm:left-1 ${node}`}
        aria-hidden="true"
      >
        {state === "done" ? "✓" : String(item.index + 1).padStart(2, "0")}
      </span>

      <Wrapper
        {...(mc ? { type: "button", onClick: () => onSelect(item.index) } : {})}
        aria-current={state === "current" ? "step" : undefined}
        className={`group block w-full rounded-xl border p-5 text-left transition-all duration-500 ${
          state === "current"
            ? "border-gold bg-gradient-to-br from-gold/15 to-transparent"
            : "border-gold/15 bg-canvas-light/40 hover:border-gold/40"
        } ${state === "done" ? "opacity-70" : ""} ${mc ? "focus-gold cursor-pointer" : ""}`}
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="break-words font-display text-lg leading-snug text-ink sm:text-xl">
              {item.title}
            </h3>
            {item.person && (
              <p className="mt-1 break-words text-sm uppercase tracking-[0.15em] text-gold-deep">{item.person}</p>
            )}
            {item.messages && (
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {item.messages.map((m) => (
                  <li
                    key={m.from}
                    className="min-w-0 rounded-lg border border-gold/20 bg-canvas-light/50 px-4 py-3"
                  >
                    <p className="break-words text-[0.65rem] uppercase tracking-[0.25em] text-gold-deep">
                      From {m.from}
                    </p>
                    <p className="mt-0.5 break-words font-serif text-lg italic text-ink/90">
                      {m.person || "With love"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {state === "current" && (
            <span className="shrink-0 rounded-full bg-gold-light px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ink">
              Live
            </span>
          )}
        </div>
      </Wrapper>
    </div>
  );
}

function DinnerInterlude({ item, state, mc, onSelect }) {
  const Wrapper = mc ? "button" : "div";
  return (
    <Wrapper
      {...(mc ? { type: "button", onClick: () => onSelect(item.index) } : {})}
      data-step={item.index}
      aria-current={state === "current" ? "step" : undefined}
      className={`relative block w-full overflow-hidden rounded-2xl border px-6 py-10 text-center transition-all duration-500 ${
        state === "current" ? "border-gold shadow-[0_0_50px_rgba(212,175,55,0.25)]" : "border-gold/25"
      } ${state === "done" ? "opacity-70" : ""} ${mc ? "focus-gold cursor-pointer" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-gold/15 to-gold/5" aria-hidden="true" />
      <p className="relative font-display text-3xl text-gradient-gold sm:text-4xl">Dinner Time</p>
      <p className="relative mt-2 break-words font-serif text-lg italic text-ink/70">
        {item.title}, enjoy the feast
      </p>
      {state === "current" && (
        <span className="relative mt-4 inline-block rounded-full bg-gold-light px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ink">
          Live
        </span>
      )}
    </Wrapper>
  );
}

function McControls({ currentIndex, total, onEdit }) {
  const go = (index) => setValue("live/programme", { index, at: Date.now() });
  const hasCurrent = Number.isInteger(currentIndex);
  return (
    <div className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-3">
      <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-3xl border border-gold bg-canvas-light/95 p-1.5 text-xs uppercase tracking-[0.12em] text-gold-deep shadow-2xl backdrop-blur sm:gap-2 sm:rounded-full">
        <span className="hidden px-3 text-[0.6rem] sm:inline">PD controls</span>
        <button
          type="button"
          className="focus-gold rounded-full px-3 py-2 hover:bg-gold/20"
          onClick={onEdit}
        >
          ✎ Edit
        </button>
        <button
          type="button"
          className="focus-gold rounded-full px-3 py-2 hover:bg-gold/20 disabled:opacity-30"
          disabled={!hasCurrent || currentIndex === 0}
          onClick={() => go(currentIndex - 1)}
        >
          ◀ Prev
        </button>
        <button
          type="button"
          className="focus-gold rounded-full bg-gold-light px-4 py-2 text-ink disabled:opacity-30"
          disabled={hasCurrent && currentIndex >= total - 1}
          onClick={() => go(hasCurrent ? currentIndex + 1 : 0)}
        >
          {hasCurrent ? "Next ▶" : "Start ▶"}
        </button>
        <button
          type="button"
          className="focus-gold rounded-full px-3 py-2 hover:bg-gold/20"
          onClick={() => removeValue("live/programme")}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function Programme() {
  // The MC's live edits (if any) replace the running order from config.js.
  const { value: edited } = useLiveValue(PROGRAMME_PATH);
  const programme = useMemo(() => normaliseProgramme(edited) || config.programme, [edited]);
  const { acts, flat } = useFlatProgramme(programme);
  const { value: live } = useLiveValue("live/programme");
  const mc = isMcMode();
  const [editing, setEditing] = useState(false);
  const liveIndex = Number.isInteger(live?.index) ? live.index : null;
  // If an edit removed items, keep the marker on the last one rather than nowhere.
  const currentIndex = liveIndex === null ? null : Math.min(liveIndex, flat.length - 1);
  const current = currentIndex !== null ? flat[currentIndex] : null;
  const select = (index) => setValue("live/programme", { index, at: Date.now() });

  // Guests follow along: keep the live item in view as the PD moves on.
  useEffect(() => {
    if (currentIndex === null || mc) return;
    const id = setTimeout(() => {
      document.querySelector(`[data-step="${currentIndex}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => clearTimeout(id);
  }, [currentIndex, mc]);

  const stateOf = (index) =>
    currentIndex === null ? "upcoming" : index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";

  return (
    <div>
      <section
        aria-label="Programme header"
        className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-24 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-canvas-light via-canvas to-canvas" />
        <Particles count={18} />
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.35em" }}
          transition={{ duration: 1.2 }}
          className="relative text-xs uppercase text-gold-deep"
        >
          Order of Proceedings
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mt-5 break-words font-display text-4xl font-semibold text-gradient-gold sm:text-7xl"
        >
          The Programme
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative mt-4 font-serif text-2xl italic text-ink/85"
        >
          {config.honoreeName} · {config.milestone}
        </motion.p>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="relative mt-10 grid w-full max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gold/30 bg-gold/20 sm:grid-cols-3"
        >
          {[
            ["Programme Director", config.programmeDirector],
            ["Date", config.displayDate],
            ["Duration", config.programmeDurationLabel],
          ].map(([label, value]) => (
            <div key={label} className="bg-canvas-light/90 px-5 py-4">
              <dt className="text-[0.65rem] uppercase tracking-[0.3em] text-gold-deep">{label}</dt>
              <dd className="mt-1 break-words font-display text-lg text-ink">{value}</dd>
            </div>
          ))}
        </motion.dl>
      </section>

      <section className="px-5 py-16" aria-label="Programme running order">
        <NowPlaying current={current} next={current ? flat[current.index + 1] : null} total={flat.length} />

        <div className="mx-auto max-w-2xl space-y-16">
          {acts.map((act, a) => {
            const isInterlude = isDinnerInterlude(act);
            // Number parts without counting the dinner interlude: Part I, Interlude, Part II.
            const part = acts.slice(0, a + 1).filter((x) => !isDinnerInterlude(x)).length;
            return (
              <div key={`${a}-${act.act}`}>
                <Reveal className="mb-8 text-center">
                  <p className="text-[0.65rem] uppercase tracking-[0.4em] text-gold-deep">
                    {isInterlude ? "Interlude" : `Part ${ROMAN[part - 1] || part}`}
                  </p>
                  {!isInterlude && (
                    <h2 className="mt-2 break-words font-display text-3xl text-gold sm:text-4xl">{act.act}</h2>
                  )}
                  <div className="gold-divider mt-4" />
                </Reveal>

                {isInterlude ? (
                  <Reveal>
                    <DinnerInterlude item={act.items[0]} state={stateOf(act.items[0].index)} mc={mc} onSelect={select} />
                  </Reveal>
                ) : (
                  <div className="relative">
                    <span
                      className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-gold/60 via-gold/25 to-gold/60 sm:left-[25px]"
                      aria-hidden="true"
                    />
                    <ol className="relative space-y-5">
                      {act.items.map((item, i) => (
                        <Reveal as="li" key={item.index} delay={Math.min(i * 0.05, 0.3)}>
                          <ProgrammeItem item={item} state={stateOf(item.index)} mc={mc} onSelect={select} />
                        </Reveal>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Reveal className="mx-auto mt-20 max-w-xl text-center">
          <div className="gold-divider mb-6" />
          <p className="font-serif text-xl italic text-ink/70">
            Thank you for celebrating with us.
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold-deep">
            Head to the Story Wall to share a memory
          </p>
        </Reveal>
      </section>

      {mc && !editing && (
        <McControls currentIndex={currentIndex} total={flat.length} onEdit={() => setEditing(true)} />
      )}
      {mc && editing && (
        <ProgrammeEditor programme={programme} isEdited={Boolean(edited)} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}
