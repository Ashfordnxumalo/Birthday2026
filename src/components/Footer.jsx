import React, { useState } from "react";
import { config } from "../../config.js";
import { downloadICS } from "../lib/ics.js";
import { shareInvite } from "../lib/share.js";

export default function Footer() {
  const [shareMsg, setShareMsg] = useState("");

  const handleShare = async () => {
    const result = await shareInvite();
    if (result.method === "clipboard") setShareMsg("Link copied to clipboard!");
    if (result.method === "error") setShareMsg("Could not share. Please copy the URL manually.");
    if (shareMsg) setTimeout(() => setShareMsg(""), 3000);
  };

  return (
    <footer className="border-t border-gold/20 px-6 py-12 text-center" role="contentinfo">
      <p className="font-display text-xl text-gold">{config.hostName}</p>
      <p className="mt-2 text-sm text-ivory/70 theme-light:text-charcoal-deep/70">
        <a href={`mailto:${config.hostContactEmail}`} className="focus-gold underline hover:text-gold">
          {config.hostContactEmail}
        </a>{" "}
        &middot; {config.hostContactPhone}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={downloadICS}
          className="focus-gold rounded-full border border-gold px-6 py-2 text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-charcoal-deep"
        >
          Add to Calendar
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="focus-gold rounded-full border border-gold px-6 py-2 text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-charcoal-deep"
        >
          Share Invitation
        </button>
      </div>

      <p role="status" aria-live="polite" className="mt-3 text-xs text-gold-light">
        {shareMsg}
      </p>

      <p className="mt-8 text-xs text-ivory/40 theme-light:text-charcoal-deep/40">
        &copy; {new Date().getFullYear()} {config.hostName}
      </p>
    </footer>
  );
}
