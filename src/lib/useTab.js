import { useCallback, useEffect, useState } from "react";
import { config } from "../../config.js";

export const TABS = [
  { id: "invite", label: "Invitation", icon: "✉" },
  { id: "programme", label: "Programme", icon: "✦" },
  { id: "stories", label: "Story Wall", icon: "❝" },
];

// True from 2 hours before the start until 12 hours after it.
function isEventNight(now = Date.now()) {
  const start = new Date(config.eventDateISO).getTime();
  return now >= start - 2 * 3600e3 && now <= start + 12 * 3600e3;
}

function tabFromUrl() {
  const requested = new URLSearchParams(window.location.search).get("tab");
  if (TABS.some((t) => t.id === requested)) return requested;
  return config.eventNightAutoOpen && isEventNight() ? "programme" : "invite";
}

// Active tab, kept in ?tab= so links like ?tab=stories&table=4 can be shared.
export function useTab() {
  const [tab, setTabState] = useState(() =>
    config.showEventNightTabs ? tabFromUrl() : "invite"
  );

  useEffect(() => {
    const onPop = () => setTabState(tabFromUrl());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const setTab = useCallback((next) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    url.hash = "";
    window.history.pushState(null, "", url);
    setTabState(next);
    window.scrollTo({ top: 0 });
  }, []);

  return [tab, setTab];
}

// Programme Director mode: ?mc=<VITE_MC_PIN>. A light gate, not real security.
export function isMcMode() {
  if (!config.mcPin) return false;
  return new URLSearchParams(window.location.search).get("mc") === config.mcPin;
}
