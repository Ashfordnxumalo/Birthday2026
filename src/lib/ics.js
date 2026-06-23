import { config } from "../../config.js";

function toICSDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function downloadICS() {
  const start = new Date(config.eventDateISO);
  const end = new Date(start.getTime() + config.calendarDurationHours * 60 * 60 * 1000);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Black Tie Invite//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@black-tie-invite`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${config.calendarTitle}`,
    `DESCRIPTION:${config.calendarDescription}`,
    `LOCATION:${config.venueName}, ${config.venueAddress}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${config.honoreeName.replace(/\s+/g, "-")}-birthday.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
