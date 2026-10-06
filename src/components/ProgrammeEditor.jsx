import React, { useState } from "react";
import { removeValue, setValue } from "../lib/liveStore.js";

// Where the MC's edited running order lives. When empty, config.programme is used.
export const PROGRAMME_PATH = "live/programmeData";

// Firebase can hand arrays back as {0: …, 1: …} objects; turn them back into arrays.
function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => value[k])
      .filter(Boolean);
  }
  return [];
}

// Returns a clean programme from stored data, or null when there is nothing usable.
export function normaliseProgramme(raw) {
  const acts = toArray(raw)
    .map((act) => ({
      act: String(act.act || ""),
      items: toArray(act.items).map((item) => {
        const messages = toArray(item.messages).map((m) => ({
          from: String(m.from || ""),
          ...(m.person ? { person: String(m.person) } : {}),
        }));
        return {
          title: String(item.title || ""),
          ...(item.person ? { person: String(item.person) } : {}),
          ...(messages.length ? { messages } : {}),
        };
      }),
    }))
    .filter((act) => act.items.length);
  return acts.length ? acts : null;
}

// Drop blank rows and empty fields so what's saved matches what guests see.
function cleanForSave(acts) {
  return acts
    .map((act) => ({
      act: act.act.trim(),
      items: act.items
        .filter((item) => item.title.trim())
        .map((item) => {
          const messages = (item.messages || [])
            .filter((m) => m.from.trim())
            .map((m) => ({ from: m.from.trim(), ...(m.person?.trim() ? { person: m.person.trim() } : {}) }));
          return {
            title: item.title.trim(),
            ...(item.person?.trim() ? { person: item.person.trim() } : {}),
            ...(messages.length ? { messages } : {}),
          };
        }),
    }))
    .filter((act) => act.act && act.items.length);
}

const input =
  "focus-gold w-full min-w-0 rounded-lg border border-gold/30 bg-canvas-light px-3 py-2 text-sm text-ink outline-none placeholder:text-ink/35";
const smallBtn =
  "focus-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold-deep hover:bg-gold/15 disabled:opacity-30";
const label = "mb-1 block text-[0.6rem] uppercase tracking-[0.2em] text-gold-deep";

export default function ProgrammeEditor({ programme, isEdited, onClose }) {
  const [acts, setActs] = useState(() => structuredClone(programme));
  const [status, setStatus] = useState("idle"); // idle | saving | error

  const update = (fn) =>
    setActs((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });

  const move = (list, from, to) => {
    if (to < 0 || to >= list.length) return;
    const [row] = list.splice(from, 1);
    list.splice(to, 0, row);
  };

  const save = async () => {
    const cleaned = cleanForSave(acts);
    if (!cleaned.length) return setStatus("error");
    setStatus("saving");
    try {
      await setValue(PROGRAMME_PATH, cleaned);
      onClose();
    } catch {
      setStatus("error");
    }
  };

  const restore = async () => {
    if (!window.confirm("Throw away all edits and go back to the original programme?")) return;
    setStatus("saving");
    try {
      await removeValue(PROGRAMME_PATH);
      onClose();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas" role="dialog" aria-modal="true" aria-label="Edit programme">
      <header className="flex items-center justify-between gap-3 border-b border-gold/30 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gold-deep">Programme Director</p>
          <h2 className="font-display text-xl text-gold">Edit programme</h2>
        </div>
        <button type="button" onClick={onClose} className="focus-gold rounded-full px-3 py-2 text-xs uppercase tracking-[0.15em] text-gold-deep hover:bg-gold/15">
          Close
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto max-w-2xl space-y-8">
          <p className="text-sm text-ink/70">
            Changes show on every guest's phone as soon as you save. Empty rows are left out.
          </p>

          {acts.map((act, a) => (
            <section key={a} className="rounded-2xl border border-gold/30 bg-canvas-light/60 p-4">
              <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <label className={label} htmlFor={`act-${a}`}>Part {a + 1} name</label>
                  <input
                    id={`act-${a}`}
                    className={input}
                    value={act.act}
                    maxLength={80}
                    onChange={(e) => update((d) => { d[a].act = e.target.value; })}
                  />
                </div>
              </div>

              <ol className="mt-4 space-y-3">
                {act.items.map((item, i) => (
                  <li key={i} className="rounded-xl border border-gold/20 bg-canvas p-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-2 w-6 shrink-0 text-center font-display text-sm text-gold">{i + 1}</span>
                      <div className="min-w-0 flex-1 space-y-2">
                        <textarea
                          aria-label={`Part ${a + 1} item ${i + 1} title`}
                          className={`${input} resize-none leading-snug`}
                          placeholder="What's happening"
                          // Grow with the text so long titles stay fully visible on a phone.
                          rows={Math.min(3, Math.max(1, Math.ceil(item.title.length / 24)))}
                          value={item.title}
                          maxLength={120}
                          onChange={(e) => update((d) => { d[a].items[i].title = e.target.value.replace(/\n/g, " "); })}
                        />
                        <input
                          aria-label={`Part ${a + 1} item ${i + 1} person`}
                          className={input}
                          placeholder="Who (optional)"
                          value={item.person || ""}
                          maxLength={80}
                          onChange={(e) => update((d) => { d[a].items[i].person = e.target.value; })}
                        />

                        {item.messages && (
                          <div className="space-y-2 rounded-lg border border-gold/15 p-2">
                            <p className={label}>Messages</p>
                            {item.messages.map((m, k) => (
                              <div key={k} className="flex flex-wrap items-center gap-2 border-b border-gold/10 pb-2 last:border-0">
                                <input
                                  aria-label={`Message ${k + 1} from`}
                                  className={`${input} flex-1 basis-32`}
                                  placeholder="From (e.g. Church)"
                                  value={m.from}
                                  maxLength={60}
                                  onChange={(e) => update((d) => { d[a].items[i].messages[k].from = e.target.value; })}
                                />
                                <input
                                  aria-label={`Message ${k + 1} person`}
                                  className={`${input} flex-1 basis-32`}
                                  placeholder="Who"
                                  value={m.person || ""}
                                  maxLength={80}
                                  onChange={(e) => update((d) => { d[a].items[i].messages[k].person = e.target.value; })}
                                />
                                <button
                                  type="button"
                                  className={smallBtn}
                                  aria-label={`Remove message ${k + 1}`}
                                  onClick={() => update((d) => { d[a].items[i].messages.splice(k, 1); })}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="focus-gold text-xs uppercase tracking-[0.15em] text-gold-deep hover:underline"
                              onClick={() => update((d) => { d[a].items[i].messages.push({ from: "", person: "" }); })}
                            >
                              + Add message
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <button type="button" className={smallBtn} aria-label="Move up" disabled={i === 0}
                          onClick={() => update((d) => move(d[a].items, i, i - 1))}>▲</button>
                        <button type="button" className={smallBtn} aria-label="Move down" disabled={i === act.items.length - 1}
                          onClick={() => update((d) => move(d[a].items, i, i + 1))}>▼</button>
                        <button type="button" className={smallBtn} aria-label={`Remove item ${i + 1}`}
                          onClick={() => update((d) => { d[a].items.splice(i, 1); })}>✕</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <button
                type="button"
                className="focus-gold mt-3 w-full rounded-full border border-dashed border-gold/50 py-2 text-xs uppercase tracking-[0.15em] text-gold-deep hover:bg-gold/10"
                onClick={() => update((d) => { d[a].items.push({ title: "", person: "" }); })}
              >
                + Add item to {act.act || `part ${a + 1}`}
              </button>
            </section>
          ))}
        </div>
      </div>

      <footer className="border-t border-gold/30 bg-canvas-light px-4 py-3">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-end gap-2">
          {status === "error" && (
            <p className="mr-auto text-xs text-rose-700" role="alert">
              Couldn't save. Check the connection and that every part has at least one item.
            </p>
          )}
          {isEdited && (
            <button type="button" onClick={restore} disabled={status === "saving"}
              className="focus-gold rounded-full px-4 py-2 text-xs uppercase tracking-[0.15em] text-gold-deep hover:bg-gold/15">
              Restore original
            </button>
          )}
          <button type="button" onClick={onClose}
            className="focus-gold rounded-full px-4 py-2 text-xs uppercase tracking-[0.15em] text-gold-deep hover:bg-gold/15">
            Cancel
          </button>
          <button type="button" onClick={save} disabled={status === "saving"}
            className="focus-gold rounded-full bg-gold-light px-6 py-2 text-xs uppercase tracking-[0.15em] text-ink disabled:opacity-50">
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </footer>
    </div>
  );
}
