# ✉️ EmailJS Confirmation Email Template

Paste the pieces below into your EmailJS template editor. The `{{variables}}`
are filled in automatically by the RSVP form on a successful submission.

---

## Settings

- **To Email:** `{{guest_email}}`
- **From Name:** `{{honoree_name}}'s Birthday`
- **Reply To:** (your host email)
- **Subject:** `You're confirmed — {{honoree_name}}'s Black-Tie Celebration`

---

## HTML body (recommended)

```html
<div style="max-width:560px;margin:0 auto;font-family:Georgia,'Times New Roman',serif;
            background:#111114;color:#f4efe4;padding:40px 32px;border:1px solid #C9A227;">
  <p style="letter-spacing:3px;text-transform:uppercase;font-size:12px;color:#C9A227;
            text-align:center;margin:0 0 8px;">You're on the list</p>

  <h1 style="font-size:30px;text-align:center;margin:0 0 4px;color:#f4efe4;">
    Dear {{guest_name}},
  </h1>

  <p style="text-align:center;font-size:16px;line-height:1.6;color:#d8d2c4;">
    Thank you for your RSVP. We are delighted to confirm your attendance at
    <strong style="color:#C9A227;">{{honoree_name}}'s</strong> black-tie celebration.
    We look forward to sharing this special evening with you.
  </p>

  <div style="border-top:1px solid #C9A227;border-bottom:1px solid #C9A227;
              margin:28px 0;padding:20px 0;text-align:center;">
    <p style="margin:6px 0;font-size:15px;"><strong>Date:</strong> {{event_date}}</p>
    <p style="margin:6px 0;font-size:15px;"><strong>Time:</strong> {{event_time}}</p>
    <p style="margin:6px 0;font-size:15px;"><strong>Venue:</strong> {{venue_name}}</p>
    <p style="margin:6px 0;font-size:15px;color:#d8d2c4;">{{venue_address}}</p>
    <p style="margin:6px 0;font-size:15px;"><strong>Dress Code:</strong> {{dress_code}}</p>
  </div>

  <p style="text-align:center;font-size:14px;color:#a9a394;line-height:1.6;">
    Please keep this email for your records. We can't wait to celebrate with you.
  </p>

  <p style="text-align:center;font-size:18px;color:#C9A227;margin-top:24px;">
    With warm regards,<br>{{honoree_name}}
  </p>
</div>
```

---

## Plain-text fallback

```
Dear {{guest_name}},

Thank you for your RSVP. We are delighted to confirm your attendance at
{{honoree_name}}'s black-tie celebration.

  Date:       {{event_date}}
  Time:       {{event_time}}
  Venue:      {{venue_name}}
              {{venue_address}}
  Dress Code: {{dress_code}}

Please keep this email for your records. We can't wait to celebrate with you.

With warm regards,
{{honoree_name}}
```
