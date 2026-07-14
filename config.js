// =============================================================
//  EDIT EVERYTHING HERE — this is the only file you need to touch
//  for event details. Keys (Formspree/EmailJS) come from .env.
// =============================================================

function musicFile(filename) {
  return filename ? `${import.meta.env.BASE_URL}music/${filename}` : "";
}

export const config = {
  // ---- Guest of honor & event ----
  honoreeName: "Malusi Ndaba",            // TODO: guest of honor's name
  milestone: "45th Birthday",         // e.g. "50th Birthday", "Celebrating 40 Years"
  tagline: "An afternoon of elegance and celebration",  // short subtitle under the name

  // ---- Date & time ----
  // ISO format. Keep the timezone offset correct for your venue.
  eventDateISO: "2026-10-10T14:00:00+02:00", // 10 Oct 2026, 7:00 PM (SAST)
  displayDate: "Saturday, 10 October 2026",
  displayTime: "14:00 PM until late",

  // ---- Venue ----
  venueName: "The Ndaba Residence",    // TODO
  venueAddress: "Mpindweni Ext, Mthatha", // TODO
  // Google Maps embed query (address or place name). URL-encoded automatically.
  mapQuery: "Mpindweni Ext Mthatha",

  // ---- Details ----
  dressCode: "Glitz & Glam",
  hostName: "Designed By - Ash",         // TODO
  hostContactEmail: "Ashford@mnx-consulting.co.za", // TODO — shown in footer
  hostContactPhone: "+27815000053",  // TODO

  // ---- Calendar (.ics) ----
  calendarTitle: "Melusi Ndaba's 45th Birthday — Black Tie",
  calendarDescription: "Join us for an elegant black-tie celebration.",
  calendarDurationHours: 5,           // event length for the .ics file

  // ---- Background music (optional) ----
  // Drop an mp3 in /public/music and reference its filename here, or leave "" to hide the toggle.
  musicSrc: musicFile("Hymn for Taiwa.mp3"),

  // ---- Theme toggle (moon/sun button, optional) ----
  // Set to false to hide the toggle button entirely.
  showThemeToggle: false,
  // Theme shown on first visit, before the guest picks one: "dark" or "light".
  defaultTheme: "dark",

  // ---- Integrations: values read from .env (see .env.example) ----
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || "",
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  },

  // ---- Site / sharing ----
  siteUrl: "https://mnx-consulting.co.za/events", // used by Share button
};

export default config;
