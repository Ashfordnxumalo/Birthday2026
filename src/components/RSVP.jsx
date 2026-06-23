import React, { useState } from "react";
import confetti from "canvas-confetti";
import emailjs from "@emailjs/browser";
import { config } from "../../config.js";
import Reveal from "./Reveal.jsx";

const initialForm = {
  name: "",
  email: "",
  guests: "1",
  attending: "yes",
  dietary: "",
  message: "",
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  const guestCount = Number(form.guests);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
    errors.guests = "Enter a number of guests between 1 and 10.";
  }
  return errors;
}

function fireGoldConfetti() {
  const colors = ["#D4AF37", "#C9A227", "#f4efe4", "#e8cf7e"];
  confetti({
    particleCount: 140,
    spread: 80,
    origin: { y: 0.6 },
    colors,
    scalar: 1.1,
  });
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 60,
    origin: { x: 0, y: 0.7 },
    colors,
  });
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 60,
    origin: { x: 1, y: 0.7 },
    colors,
  });
}

export default function RSVP() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!config.formspreeEndpoint) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch(config.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Formspree submission failed");

      // Confirmation email to the guest, best-effort — RSVP already succeeded.
      const { serviceId, templateId, publicKey } = config.emailjs;
      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            {
              guest_name: form.name,
              guest_email: form.email,
              event_date: config.displayDate,
              event_time: config.displayTime,
              venue_name: config.venueName,
              venue_address: config.venueAddress,
              dress_code: config.dressCode,
              honoree_name: config.honoreeName,
            },
            { publicKey }
          );
        } catch (emailErr) {
          console.error("EmailJS confirmation email failed:", emailErr);
        }
      }

      setStatus("success");
      fireGoldConfetti();
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section id="rsvp" className="px-6 py-24" aria-label="RSVP form">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-display text-3xl text-gold sm:text-4xl">RSVP</h2>
        <div className="gold-divider mt-6 mb-4" />
        <p className="text-sm text-ivory/70 theme-light:text-charcoal-deep/70">
          Kindly respond by completing the form below.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto max-w-xl">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-xl border border-gold/30 bg-charcoal-light/50 theme-light:bg-champagne/50 p-8"
        >
          <div>
            <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-wide text-gold-light">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="focus-gold w-full rounded-md border border-gold/30 bg-transparent px-4 py-2 text-ivory theme-light:text-charcoal-deep outline-none"
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-xs text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-xs uppercase tracking-wide text-gold-light">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="focus-gold w-full rounded-md border border-gold/30 bg-transparent px-4 py-2 text-ivory theme-light:text-charcoal-deep outline-none"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="attending" className="mb-1 block text-xs uppercase tracking-wide text-gold-light">
                Attending?
              </label>
              <select
                id="attending"
                name="attending"
                value={form.attending}
                onChange={handleChange}
                className="focus-gold w-full rounded-md border border-gold/30 bg-transparent px-4 py-2 text-ivory theme-light:text-charcoal-deep outline-none"
              >
                <option value="yes" className="bg-charcoal-light text-ivory">
                  Joyfully Accepts
                </option>
                <option value="no" className="bg-charcoal-light text-ivory">
                  Regretfully Declines
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="guests" className="mb-1 block text-xs uppercase tracking-wide text-gold-light">
                Guests
              </label>
              <input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max="10"
                value={form.guests}
                onChange={handleChange}
                aria-invalid={Boolean(errors.guests)}
                aria-describedby={errors.guests ? "guests-error" : undefined}
                className="focus-gold w-full rounded-md border border-gold/30 bg-transparent px-4 py-2 text-ivory theme-light:text-charcoal-deep outline-none"
              />
              {errors.guests && (
                <p id="guests-error" className="mt-1 text-xs text-red-400">
                  {errors.guests}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="dietary" className="mb-1 block text-xs uppercase tracking-wide text-gold-light">
              Dietary Restrictions (optional)
            </label>
            <input
              id="dietary"
              name="dietary"
              type="text"
              value={form.dietary}
              onChange={handleChange}
              className="focus-gold w-full rounded-md border border-gold/30 bg-transparent px-4 py-2 text-ivory theme-light:text-charcoal-deep outline-none"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-xs uppercase tracking-wide text-gold-light">
              Message (optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={form.message}
              onChange={handleChange}
              className="focus-gold w-full rounded-md border border-gold/30 bg-transparent px-4 py-2 text-ivory theme-light:text-charcoal-deep outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="focus-gold w-full rounded-full border border-gold bg-gold/10 py-3 text-sm uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-charcoal-deep disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Send RSVP"}
          </button>

          <div role="status" aria-live="polite">
            {status === "success" && (
              <p className="text-center text-sm text-gold">
                Thank you — your RSVP has been received with delight.
              </p>
            )}
            {status === "error" && (
              <p className="text-center text-sm text-red-400">
                Something went wrong sending your RSVP. Please try again or contact the host
                directly.
              </p>
            )}
          </div>
        </form>
      </Reveal>
    </section>
  );
}
