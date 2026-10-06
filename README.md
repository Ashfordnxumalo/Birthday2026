# 🥂 Black-Tie Birthday Invitation Website

An elegant, single-page birthday invitation built with React + Vite, Tailwind
CSS, and Framer Motion. Features a live countdown, RSVP form (emailed to the
host via Formspree), automated guest confirmation emails (EmailJS), gold
confetti, a photo gallery with lightbox, an embedded venue map, add-to-calendar
(.ics), share button, and a charcoal/champagne theme toggle.

---

## 1. Quick start

```bash
npm install
cp .env.example .env      # then fill in your keys (see below)
npm run dev                # open the printed localhost URL
```

To build for production:

```bash
npm run build               # outputs to /dist
npm run preview             # preview the production build locally
```

---

## 2. Edit the event details

Everything you'd normally change lives in **`config.js`** at the project root:
honoree name, milestone, date/time, venue, dress code, host contact, calendar
text, and the background music file. Each field is commented. The date drives
the countdown and the `.ics` calendar file, so keep `eventDateISO` accurate
including the timezone offset (the default `+02:00` is South Africa / SAST).

To add background music, drop an `.mp3` into `public/music/` and point
`musicSrc` at it in `config.js` (or set `musicSrc: ""` to hide the music
button). Music is muted/paused by default — the guest must tap the toggle,
respecting browser autoplay rules.

---

## 3. Set up Formspree (host receives each RSVP)

1. Create a free account at <https://formspree.io>.
2. Create a new form and copy its endpoint (looks like
   `https://formspree.io/f/abcdwxyz`).
3. Put it in `.env` as `VITE_FORMSPREE_ENDPOINT`.
4. RSVP submissions will now be emailed to the address on your Formspree
   account.

> **Note:** Formspree's free tier limits monthly submissions. For a large
> guest list, check their current limits and upgrade if needed.

---

## 4. Set up EmailJS (guest gets a confirmation email)

1. Create a free account at <https://www.emailjs.com>.
2. **Add an Email Service** (Gmail, Outlook, etc.) and copy the **Service ID**.
3. **Create an Email Template** and copy the **Template ID**. Use these
   variable names in the template so the code can fill them in:
   - `{{guest_name}}`
   - `{{guest_email}}` (set as the "To" address)
   - `{{event_date}}`
   - `{{event_time}}`
   - `{{venue_name}}`
   - `{{venue_address}}`
   - `{{dress_code}}`
   - `{{honoree_name}}`

   A ready-to-paste template is in **`EMAIL_TEMPLATE.md`**.
4. Go to **Account → API Keys** and copy the **Public Key**.
5. Put all three into `.env`:
   `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`,
   `VITE_EMAILJS_PUBLIC_KEY`.

> **Note:** EmailJS's free tier limits monthly sends. Upgrade if your guest
> list is large.

If any EmailJS key is missing, the site still works — it just skips the
guest confirmation email, and the RSVP still reaches the host via Formspree.

---

## 5. Event-night tabs: Programme & Story Wall

A tab bar at the bottom of the site switches between **Invitation**,
**Programme** and **Story Wall**. Each tab has its own link, so you can share or
print a QR code for it:

- `…/events/?tab=programme` is the running order of the day.
- `…/events/?tab=stories` is the table game. Add `&table=4` to pre-select a
  table, which works well for QR codes printed on each table.

On the event day (from 2 hours before the start), the site opens on the
Programme tab automatically. Edit the running order, the Programme Director,
the number of tables and these switches in `config.js` (`programme`,
`tableCount`, `showEventNightTabs`, `eventNightAutoOpen`).

**Story Wall game:** guests pick their table, enter their name and post a short
story about the celebrant ("Mr Party"). Each story earns their table 10 points,
and each ❤ it receives earns 2 more. The leaderboard shows the leading table
(👑) and who is seated at each table. Tap a table to see its guests and
stories.

**Live database (required for the night).** Without it, stories are only
stored on the device they were typed on (preview mode). To share them between
everyone's phones:

1. Go to <https://console.firebase.google.com> → *Add project* (the free Spark
   plan is enough).
2. *Build → Realtime Database → Create database* (any location, start in
   locked mode).
3. Open the *Rules* tab, paste the contents of `firebase.rules.json`, and
   *Publish*.
4. Copy the database URL into `.env` as `VITE_FIREBASE_DB_URL`, then rebuild
   and redeploy.

**Programme Director controls.** Set `VITE_MC_PIN` and open
`…/events/?tab=programme&mc=<PIN>` on the PD's phone. *Start / Next / Prev*
moves the "Now happening" marker, and every guest's screen follows live. You
can also tap any item to jump to it. With the PIN in the URL, the Story Wall
shows a *Remove* button on each story for moderation. The PIN is a light gate
for a private party, not real security, so don't share the `mc` link.

---

## 6. Deploy (Netlify or Vercel)

**Netlify**
1. Push the project to GitHub.
2. In Netlify: *New site from Git* → pick the repo.
3. Build command `npm run build`, publish directory `dist`.
4. Add your `.env` variables (including `VITE_FIREBASE_DB_URL` and
   `VITE_MC_PIN`) under **Site settings → Environment variables**.
5. Update `siteUrl` in `config.js` to your live URL (used by the Share
   button), then redeploy.

**Vercel**
1. Import the GitHub repo.
2. Framework preset: **Vite**. Build `npm run build`, output `dist`.
3. Add the env variables under **Settings → Environment Variables**.
4. Update `siteUrl` in `config.js` and redeploy.

`netlify.toml` and `vercel.json` are included with sensible defaults.

---

## 7. Accessibility & motion

The site supports keyboard navigation, ARIA labels, sufficient contrast, and
honours `prefers-reduced-motion` (particles, confetti, and reveal animations
are reduced or disabled for users who request it).

---

## 8. Project structure

```
config.js            # ← edit event details here
.env.example         # ← copy to .env and add keys
EMAIL_TEMPLATE.md    # ← paste into EmailJS
firebase.rules.json  # ← paste into Firebase Realtime Database rules
src/
  components/        # Hero, Countdown, Details, RSVP, Gallery, Map, Footer, etc.
  lib/                # ics generator, share helper, theme context, reduced-motion hook
public/
  music/              # optional background track
```
