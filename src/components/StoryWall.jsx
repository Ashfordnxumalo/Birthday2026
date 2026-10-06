import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { config } from "../../config.js";
import { isMcMode } from "../lib/useTab.js";
import {
  SERVER_TIME,
  deviceId,
  isLive,
  pushValue,
  removeValue,
  setValue,
  useLiveValue,
} from "../lib/liveStore.js";
import Reveal from "./Reveal.jsx";

const STORY_MAX = 280;
const NAME_MAX = 40;
const POINTS_PER_STORY = 10;
const POINTS_PER_HEART = 2;
const PROFILE_KEY = "story-wall-profile";

const TABLES = Array.from({ length: config.tableCount }, (_, i) => i + 1);

function loadProfile() {
  const fromUrl = Number(new URLSearchParams(window.location.search).get("table"));
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
  } catch {
    // ignore
  }
  return {
    name: saved.name || "",
    table: TABLES.includes(fromUrl) ? String(fromUrl) : saved.table || "",
  };
}

function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function timeAgo(ts, now) {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return `${h} hr${h > 1 ? "s" : ""} ago`;
}

function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function celebrate() {
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#D4AF37", "#C9A227", "#f4efe4", "#e8cf7e"],
  });
}

function StatusPill({ status }) {
  const label = { live: "Live", connecting: "Connecting…", local: "Preview mode" }[status];
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-gold-light">
      <span
        className={`h-2 w-2 rounded-full ${
          status === "live" ? "bg-emerald-400" : status === "local" ? "bg-gold" : "animate-pulse bg-gold/60"
        }`}
      />
      {label}
    </span>
  );
}

function StoryForm({ onPosted }) {
  const [profile, setProfile] = useState(loadProfile);
  const [story, setStory] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const name = profile.name.trim();
    const text = story.trim();
    const table = Number(profile.table);
    if (!TABLES.includes(table)) return setError("Pick your table number.");
    if (!name) return setError("Tell us your name.");
    if (text.length < 3) return setError("Share a little story — even one line is perfect.");

    setError("");
    setStatus("sending");
    try {
      await pushValue("stories", {
        name: name.slice(0, NAME_MAX),
        table,
        story: text.slice(0, STORY_MAX),
        device: deviceId(),
        ts: SERVER_TIME,
      });
      saveProfile({ name, table: String(table) });
      setStory("");
      setStatus("sent");
      celebrate();
      onPosted(table);
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const field =
    "focus-gold w-full rounded-lg border border-gold/30 bg-charcoal-deep/60 px-4 py-2.5 text-ivory outline-none placeholder:text-ivory/30 theme-light:bg-champagne-light/70 theme-light:text-charcoal-deep";

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-4 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/10 via-charcoal-light/60 to-charcoal-light/40 p-6 theme-light:from-gold/10 theme-light:via-champagne/60 theme-light:to-champagne/40"
    >
      <h3 className="font-display text-2xl text-gold">Share a story</h3>
      <div className="grid grid-cols-[6.5rem_1fr] gap-3">
        <div>
          <label htmlFor="sw-table" className="mb-1 block text-[0.65rem] uppercase tracking-[0.2em] text-gold-light">
            Table
          </label>
          <select
            id="sw-table"
            value={profile.table}
            onChange={(e) => setProfile((p) => ({ ...p, table: e.target.value }))}
            className={field}
          >
            <option value="" className="bg-charcoal-light">
              —
            </option>
            {TABLES.map((t) => (
              <option key={t} value={t} className="bg-charcoal-light">
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sw-name" className="mb-1 block text-[0.65rem] uppercase tracking-[0.2em] text-gold-light">
            Your name
          </label>
          <input
            id="sw-name"
            type="text"
            maxLength={NAME_MAX}
            autoComplete="name"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            className={field}
          />
        </div>
      </div>
      <div>
        <label htmlFor="sw-story" className="mb-1 block text-[0.65rem] uppercase tracking-[0.2em] text-gold-light">
          Your story about Mr Party
        </label>
        <textarea
          id="sw-story"
          rows={4}
          maxLength={STORY_MAX}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder={`The time ${config.honoreeName.split(" ")[0]}…`}
          className={`${field} resize-none`}
        />
        <p className="mt-1 text-right text-[0.65rem] text-ivory/40 theme-light:text-charcoal-deep/50">
          {story.length}/{STORY_MAX}
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="focus-gold w-full rounded-full bg-gold-shimmer bg-[length:200%_auto] py-3 text-sm font-medium uppercase tracking-[0.2em] text-charcoal-deep transition-transform hover:scale-[1.01] animate-shimmer disabled:opacity-60"
      >
        {status === "sending" ? "Posting…" : "Post to the wall"}
      </button>

      <div role="status" aria-live="polite" className="min-h-[1.25rem] text-center text-sm">
        {error && <p className="text-red-400">{error}</p>}
        {status === "sent" && <p className="text-gold">Posted! +{POINTS_PER_STORY} points for your table 🎉</p>}
        {status === "error" && <p className="text-red-400">Couldn't post just now — please try again.</p>}
      </div>
    </form>
  );
}

function Leaderboard({ tables, activeTable, onPick }) {
  const leader = tables[0];
  const maxPoints = leader?.points || 1;

  return (
    <div className="rounded-2xl border border-gold/30 bg-charcoal-light/50 p-6 theme-light:bg-champagne/50">
      <div>
        <h3 className="font-display text-2xl text-gold">Table leaderboard</h3>
        <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold-light">
          Story = {POINTS_PER_STORY} pts · ❤ = {POINTS_PER_HEART} pts
        </p>
      </div>

      {tables.length === 0 ? (
        <p className="mt-6 text-sm text-ivory/60 theme-light:text-charcoal-deep/60">
          No points on the board yet. Be the first table to score!
        </p>
      ) : (
        <ol className="mt-5 space-y-3">
          <AnimatePresence initial={false}>
            {tables.map((t, rank) => (
              <motion.li key={t.table} layout transition={{ type: "spring", stiffness: 400, damping: 34 }}>
                <button
                  type="button"
                  onClick={() => onPick(activeTable === t.table ? null : t.table)}
                  aria-pressed={activeTable === t.table}
                  className={`focus-gold block w-full rounded-xl border p-3 text-left transition-colors ${
                    activeTable === t.table ? "border-gold bg-gold/10" : "border-transparent hover:border-gold/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-display text-lg text-gold">
                      {rank === 0 ? "👑" : rank + 1}
                    </span>
                    <span className="flex-1 font-display text-lg text-ivory theme-light:text-charcoal-deep">
                      Table {t.table}
                    </span>
                    <span className="font-display text-lg text-gold">{t.points}</span>
                  </div>
                  <div className="ml-9 mt-2 h-1.5 overflow-hidden rounded-full bg-gold/10">
                    <motion.div
                      className="h-full rounded-full bg-gold"
                      initial={false}
                      animate={{ width: `${(t.points / maxPoints) * 100}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <p className="ml-9 mt-2 text-xs text-ivory/55 theme-light:text-charcoal-deep/60">
                    <span className="text-gold-light">Seated:</span> {t.guests.join(", ")}
                  </p>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}
    </div>
  );
}

function StoryCard({ story, now, mine, me, mc }) {
  const hearts = Object.keys(story.hearts || {}).length;
  const hearted = Boolean(story.hearts?.[me]);
  const toggleHeart = () =>
    hearted ? removeValue(`stories/${story.id}/hearts/${me}`) : setValue(`stories/${story.id}/hearts/${me}`, true);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`flex gap-3 ${mine ? "flex-row-reverse" : ""}`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/15 font-display text-sm text-gold"
        aria-hidden="true"
      >
        {initials(story.name)}
      </span>
      <div
        className={`min-w-0 max-w-[85%] rounded-2xl border px-4 py-3 ${
          mine
            ? "rounded-tr-sm border-gold/60 bg-gold/10"
            : "rounded-tl-sm border-gold/20 bg-charcoal-light/60 theme-light:bg-champagne/60"
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="font-medium text-ivory theme-light:text-charcoal-deep">{story.name}</p>
          <span className="rounded-full border border-gold/40 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.15em] text-gold">
            Table {story.table}
          </span>
          <span className="text-[0.65rem] text-ivory/40 theme-light:text-charcoal-deep/50">
            {timeAgo(story.ts, now)}
          </span>
        </div>
        <p className="mt-2 whitespace-pre-line break-words font-serif text-lg leading-snug text-ivory/90 theme-light:text-charcoal-deep/90">
          {story.story}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 1.3 }}
            onClick={toggleHeart}
            aria-pressed={hearted}
            aria-label={`${hearted ? "Remove heart from" : "Heart"} ${story.name}'s story`}
            className={`focus-gold flex items-center gap-1 rounded-full px-2 py-0.5 text-sm transition-colors ${
              hearted ? "text-rose-400" : "text-ivory/50 hover:text-rose-300 theme-light:text-charcoal-deep/50"
            }`}
          >
            {hearted ? "❤" : "♡"} <span className="text-xs">{hearts || ""}</span>
          </motion.button>
          {mc && (
            <button
              type="button"
              onClick={() => window.confirm("Remove this story?") && removeValue(`stories/${story.id}`)}
              className="focus-gold text-[0.65rem] uppercase tracking-[0.15em] text-red-400/80 hover:text-red-400"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </motion.li>
  );
}

export default function StoryWall() {
  const { value, status } = useLiveValue("stories");
  const [activeTable, setActiveTable] = useState(null);
  const now = useNow();
  const me = useMemo(deviceId, []);
  const mc = isMcMode();

  const stories = useMemo(
    () =>
      Object.entries(value || {})
        .map(([id, s]) => ({ id, ...s }))
        .filter((s) => s.name && s.story && s.table)
        .sort((a, b) => (b.ts || 0) - (a.ts || 0)),
    [value]
  );

  const tables = useMemo(() => {
    const byTable = new Map();
    stories.forEach((s) => {
      const t = byTable.get(s.table) || { table: s.table, points: 0, stories: 0, guests: [] };
      t.stories += 1;
      t.points += POINTS_PER_STORY + Object.keys(s.hearts || {}).length * POINTS_PER_HEART;
      if (!t.guests.some((g) => g.toLowerCase() === s.name.toLowerCase())) t.guests.push(s.name);
      byTable.set(s.table, t);
    });
    return [...byTable.values()].sort((a, b) => b.points - a.points || a.table - b.table);
  }, [stories]);

  const visible = activeTable ? stories.filter((s) => s.table === activeTable) : stories;
  const activeInfo = tables.find((t) => t.table === activeTable);

  return (
    <div className="px-5 pb-16 pt-24">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-light">The table game</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-gradient-gold sm:text-6xl">
          Tell Us About Mr Party
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-serif text-lg italic text-ivory/75 theme-light:text-charcoal-deep/75">
          Share your favourite story about {config.honoreeName}. Every story scores {POINTS_PER_STORY} points
          for your table, every ❤ it collects adds {POINTS_PER_HEART} more. The leading table at the toast takes the
          crown.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <StatusPill status={status} />
          <span className="text-xs uppercase tracking-[0.2em] text-ivory/50 theme-light:text-charcoal-deep/60">
            {stories.length} {stories.length === 1 ? "story" : "stories"} · {tables.length}{" "}
            {tables.length === 1 ? "table" : "tables"} playing
          </span>
        </div>
        {!isLive && (
          <p className="mx-auto mt-4 max-w-md text-xs text-ivory/40 theme-light:text-charcoal-deep/50">
            Preview mode: stories are saved on this device only until the live database is connected.
          </p>
        )}
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <StoryForm onPosted={() => setActiveTable(null)} />
          <Leaderboard tables={tables} activeTable={activeTable} onPick={setActiveTable} />
        </div>

        <div>
          <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter stories by table">
            <button
              type="button"
              onClick={() => setActiveTable(null)}
              aria-pressed={activeTable === null}
              className={`focus-gold rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors ${
                activeTable === null ? "border-gold bg-gold text-charcoal-deep" : "border-gold/30 text-gold hover:border-gold"
              }`}
            >
              All tables
            </button>
            {tables
              .map((t) => t.table)
              .sort((a, b) => a - b)
              .map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTable(t)}
                  aria-pressed={activeTable === t}
                  className={`focus-gold rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors ${
                    activeTable === t ? "border-gold bg-gold text-charcoal-deep" : "border-gold/30 text-gold hover:border-gold"
                  }`}
                >
                  Table {t}
                </button>
              ))}
          </div>

          {activeInfo && (
            <motion.div
              key={activeInfo.table}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-2xl border border-gold/40 bg-gold/5 p-5"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold-light">Seated at table {activeInfo.table}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeInfo.guests.map((g) => (
                  <span
                    key={g}
                    className="flex items-center gap-2 rounded-full border border-gold/30 py-1 pl-1 pr-3 text-sm text-ivory/90 theme-light:text-charcoal-deep/90"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-[0.6rem] text-gold">
                      {initials(g)}
                    </span>
                    {g}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-ivory/50 theme-light:text-charcoal-deep/60">
                {activeInfo.stories} {activeInfo.stories === 1 ? "story" : "stories"} · {activeInfo.points} points
              </p>
            </motion.div>
          )}

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gold/30 p-12 text-center">
              <p className="text-4xl" aria-hidden="true">
                ❝
              </p>
              <p className="mt-3 font-serif text-xl italic text-ivory/60 theme-light:text-charcoal-deep/60">
                The wall is waiting for its first story…
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {visible.map((s) => (
                  <StoryCard key={s.id} story={s} now={now} mine={s.device === me} me={me} mc={mc} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
