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

## 5. Deploy (Netlify or Vercel)

**Netlify**
1. Push the project to GitHub.
2. In Netlify: *New site from Git* → pick the repo.
3. Build command `npm run build`, publish directory `dist`.
4. Add your `.env` variables under **Site settings → Environment variables**.
5. Update `siteUrl` in `config.js` to your live URL (used by the Share
   button), then redeploy.

**Vercel**
1. Import the GitHub repo.
2. Framework preset: **Vite**. Build `npm run build`, output `dist`.
3. Add the env variables under **Settings → Environment Variables**.
4. Update `siteUrl` in `config.js` and redeploy.

`netlify.toml` and `vercel.json` are included with sensible defaults.

---

## 6. Accessibility & motion

The site supports keyboard navigation, ARIA labels, sufficient contrast, and
honours `prefers-reduced-motion` (particles, confetti, and reveal animations
are reduced or disabled for users who request it).

---

## 7. Project structure

```
config.js            # ← edit event details here
.env.example         # ← copy to .env and add keys
EMAIL_TEMPLATE.md    # ← paste into EmailJS
src/
  components/        # Hero, Countdown, Details, RSVP, Gallery, Map, Footer, etc.
  lib/                # ics generator, share helper, theme context, reduced-motion hook
public/
  music/              # optional background track
```
