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

  // ---- Event-night tabs (Programme + Story Wall) ----
  // Set to false to hide the tab bar and show only the invitation.
  showEventNightTabs: true,
  // On the day (from 2 hours before the start until the next morning) the site
  // opens straight on the Programme tab instead of the invitation.
  eventNightAutoOpen: true,
  // Number of tables in the venue (Story Wall table picker + leaderboard).
  tableCount: 12,

  // Final programme. `person` is optional. Messages under "Birthday messages"
  // go in `messages`. Keep names exactly as they should appear on screen.
  programmeDirector: "Mr Ash Nxumalo",
  programmeDurationLabel: "5 hours",
  programme: [
    {
      act: "The Ceremony",
      items: [
        { title: "Arrival of guests", icon: "🥂" },
        { title: "Programme Director", person: "Mr Ash Nxumalo", icon: "🎙️" },
        { title: "Grand entrance of celebrant and family", icon: "👑" },
        { title: "Opening prayer", icon: "🙏" },
        { title: "Welcoming", person: "Mr X Nobuya", icon: "🤝" },
        { title: "Purpose of the day", person: "Mrs M Mlondi", icon: "✨" },
        { title: "Introduction of the speaker", person: "Pst G Makamba", icon: "📜" },
        { title: "Word of God", icon: "📖" },
        { title: "Families — well wishes to the celebrant", icon: "💐" },
        { title: "Prayer for food", icon: "🙏" },
      ],
    },
    {
      act: "Dinner",
      items: [{ title: "Dinner is served", icon: "🍽️" }],
    },
    {
      act: "The Celebration",
      items: [
        {
          title: "Birthday messages",
          icon: "💌",
          messages: [
            { from: "Church", person: "Mr M Ndube" },
            { from: "Friends", person: "Pst N Yeko" },
            { from: "Neighbours", person: "Mr M Mbangata" },
            { from: "Spouse and kids" },
          ],
        },
        { title: "Cutting of the cake", person: "Pstrs Z Nxumalo", icon: "🎂" },
        { title: "Proposal of toast", person: "Mr A Bango", icon: "🍾" },
        { title: "Reply", person: "The celebrant", icon: "🎤" },
        { title: "Vote of thanks", person: "Mr M Lugetye", icon: "💛" },
        { title: "Closing prayer", icon: "🙏" },
      ],
    },
  ],

  // Live features (shared Story Wall + "Now happening" on the programme).
  // Uses a Firebase Realtime Database — see README section 5.
  firebaseDbUrl: (import.meta.env.VITE_FIREBASE_DB_URL || "").replace(/\/+$/, ""),
  // PIN for the Programme Director's controls: open the site with ?mc=<PIN>.
  mcPin: import.meta.env.VITE_MC_PIN || "",

  // ---- Site / sharing ----
  siteUrl: "https://mnx-consulting.co.za/events", // used by Share button
};

export default config;
