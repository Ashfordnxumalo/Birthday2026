import { useEffect, useState } from "react";
import { config } from "../../config.js";

// Tiny realtime store for the event-night features.
// With VITE_FIREBASE_DB_URL set, it talks to a Firebase Realtime Database over
// its REST API (writes) and Server-Sent Events (live reads) — no SDK needed.
// Without it, data lives in this browser's localStorage so the pages still
// work for previews and rehearsals.

export const isLive = Boolean(config.firebaseDbUrl);

// Placeholder for "the server's clock"; resolved locally in fallback mode.
export const SERVER_TIME = { ".sv": "timestamp" };

const LOCAL_KEY = "event-night-store";
const localListeners = new Set();

function splitPath(path) {
  return path.split("/").filter(Boolean);
}

function getAtPath(root, segs) {
  return segs.reduce((node, key) => (node && typeof node === "object" ? node[key] : undefined), root);
}

// Immutable set; a null/undefined value deletes the key (like Firebase).
function setAtPath(root, segs, value) {
  if (segs.length === 0) return value ?? null;
  const [head, ...rest] = segs;
  const base = root && typeof root === "object" ? root : {};
  const child = setAtPath(base[head], rest, value);
  const next = { ...base };
  if (child === null || child === undefined) delete next[head];
  else next[head] = child;
  return Object.keys(next).length ? next : null;
}

function resolveServerValues(value) {
  if (value && typeof value === "object") {
    if (value[".sv"] === "timestamp") return Date.now();
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveServerValues(v)]));
  }
  return value;
}

// ---------- localStorage fallback ----------

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || null;
  } catch {
    return null;
  }
}

function writeLocal(path, value) {
  const tree = setAtPath(readLocal(), splitPath(path), resolveServerValues(value));
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(tree));
  } catch {
    // Storage unavailable (private mode) — listeners still get the update.
  }
  localListeners.forEach((fn) => fn(tree));
}

function subscribeLocal(path, onValue, onStatus) {
  const segs = splitPath(path);
  const emit = (tree) => onValue(getAtPath(tree, segs) ?? null);
  const onStorage = (e) => {
    if (e.key === LOCAL_KEY) emit(readLocal());
  };
  localListeners.add(emit);
  window.addEventListener("storage", onStorage);
  onStatus("local");
  emit(readLocal());
  return () => {
    localListeners.delete(emit);
    window.removeEventListener("storage", onStorage);
  };
}

// ---------- Firebase REST + SSE ----------

function dbUrl(path) {
  return `${config.firebaseDbUrl}/${splitPath(path).join("/")}.json`;
}

async function request(method, path, body) {
  const res = await fetch(dbUrl(path), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Live store ${method} ${path} failed (${res.status})`);
  return res.json();
}

function subscribeFirebase(path, onValue, onStatus) {
  let value = null;
  const source = new EventSource(dbUrl(path));
  onStatus("connecting");

  const handle = (kind) => (e) => {
    const { path: changed, data } = JSON.parse(e.data);
    const segs = splitPath(changed);
    if (kind === "put") {
      value = setAtPath(value, segs, data);
    } else {
      Object.entries(data || {}).forEach(([key, v]) => {
        value = setAtPath(value, [...segs, ...splitPath(key)], v);
      });
    }
    onStatus("live");
    onValue(value);
  };

  source.addEventListener("put", handle("put"));
  source.addEventListener("patch", handle("patch"));
  source.addEventListener("open", () => onStatus("live"));
  source.onerror = () => onStatus("connecting"); // EventSource retries on its own
  return () => source.close();
}

// ---------- public API ----------

export function subscribe(path, onValue, onStatus = () => {}) {
  return isLive ? subscribeFirebase(path, onValue, onStatus) : subscribeLocal(path, onValue, onStatus);
}

export async function setValue(path, value) {
  if (isLive) return request("PUT", path, value);
  writeLocal(path, value);
}

export async function removeValue(path) {
  if (isLive) return request("DELETE", path);
  writeLocal(path, null);
}

// Adds a child with a unique, time-ordered key. Returns that key.
export async function pushValue(path, value) {
  if (isLive) {
    const { name } = await request("POST", path, value);
    return name;
  }
  const key = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  writeLocal(`${path}/${key}`, value);
  return key;
}

// { value, status } where status is "connecting" | "live" | "local".
export function useLiveValue(path) {
  const [state, setState] = useState({ value: null, status: "connecting" });
  useEffect(
    () =>
      subscribe(
        path,
        (value) => setState((s) => ({ ...s, value })),
        (status) => setState((s) => (s.status === status ? s : { ...s, status }))
      ),
    [path]
  );
  return state;
}

// A stable anonymous id for this browser (used for hearts and "your story").
export function deviceId() {
  try {
    let id = localStorage.getItem("event-night-device");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("event-night-device", id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}
