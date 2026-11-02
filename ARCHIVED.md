# Archived

> **Archived 2026-11. Event delivered 10 Oct 2026. Live copy: https://mnx-consulting.co.za/events/. Successor: Ashfordnxumalo/MashiloInvitation (Firestore-backed, organiser + MC logins).**

This repository was the invitation site for Malusi Ndaba's 45th birthday (10 October 2026).
It is kept read-only as a reference implementation.

- Final state is tagged `archive/malusi-45th-2026-10-10`.
- The deployed files at https://mnx-consulting.co.za/events/ were left in place on purpose.
- Story Wall data (guest names) is **not** in this repo. Any export lives outside the repo
  (`archive-exports/malusi-45th-stories.json` on the organiser's machine), because this repo is public.
- Known limits fixed by the successor: browser-side MC PIN, world-writable `live/*` rules,
  no stored RSVPs or organiser dashboard, and event details hard-coded in `config.js`.
