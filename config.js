// =============================================================
//  EDIT EVERYTHING HERE — this is the only file you need to touch
//  for event details. Keys (Formspree/EmailJS) come from .env.
// =============================================================

export const config = {
  // ---- Guest of honor & event ----
  honoreeName: "Jane Doe",            // TODO: guest of honor's name
  milestone: "50th Birthday",         // e.g. "50th Birthday", "Celebrating 40 Years"
  tagline: "An evening of elegance",  // short subtitle under the name

  // ---- Date & time ----
  // ISO format. Keep the timezone offset correct for your venue.
  eventDateISO: "2026-10-10T19:00:00+02:00", // 10 Oct 2026, 7:00 PM (SAST)
  displayDate: "Saturday, 10 October 2026",
  displayTime: "7:00 PM until late",

  // ---- Venue ----
  venueName: "The Grand Ballroom",    // TODO
  venueAddress: "123 Celebration Ave, Johannesburg", // TODO
  // Google Maps embed query (address or place name). URL-encoded automatically.
  mapQuery: "The Grand Ballroom Johannesburg",

  // ---- Details ----
  dressCode: "Black Tie",
  hostName: "The Doe Family",         // TODO
  hostContactEmail: "host@example.com", // TODO — shown in footer
  hostContactPhone: "+27 00 000 0000",  // TODO

  // ---- Calendar (.ics) ----
  calendarTitle: "Jane's 50th Birthday — Black Tie",
  calendarDescription: "Join us for an elegant black-tie celebration.",
  calendarDurationHours: 5,           // event length for the .ics file

  // ---- Background music (optional) ----
  // Drop an mp3 in /public and reference it here, or leave "" to hide the toggle.
  musicSrc: "/music/ambient.mp3",

  // ---- Integrations: values read from .env (see .env.example) ----
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT || "",
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
  },

  // ---- Site / sharing ----
  siteUrl: "https://your-invite.netlify.app", // used by Share button
};

export default config;
