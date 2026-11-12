// Runs automatically every time someone submits the "register-interest" form.
// It emails the person straight away to thank them for registering.
// The email account details are read from Netlify environment variables.

const nodemailer = require("nodemailer");

const EVENT_NAME = "Life, Love, Christ 3.0 | An Evening with God";
const EVENT_LINE = "Monday, 28 December 2026, 4:00 PM, Abuja";
const VENUE_LINE = "The Tigris Studio, 26, Ebitu Ukiwe Street, Jabi, Abuja";
const INSTAGRAM = "@officiallovelife_christ";
const PHONE = "+234 808 176 1238";

const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body || "{}");
  if (!payload || payload.form_name !== "register-interest") return { statusCode: 200, body: "ignored" };

  const { name, email } = payload.data || {};
  if (!email) return { statusCode: 200, body: "no email" };
  const first = esc(String(name || "").trim().split(" ")[0] || "friend");

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const text =
    `Hello ${String(name || "").trim().split(" ")[0] || "friend"},\n\n` +
    `Thank you for registering your interest in ${EVENT_NAME}.\n\n` +
    `Your seat is reserved with love, we cannot wait to have you in the room\n\n` +
    `Date: ${EVENT_LINE}\n` +
    `Venue: ${VENUE_LINE}\n\n` +
    `Poetry | Spoken Words | Worship\n\n` +
    `Follow us ${INSTAGRAM} or call ${PHONE} for any enquiries.\n\n` +
    `With love,\nThe Life, Love, Christ team`;

  const html = `
  <div style="background:#fff8e1;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#2a1409">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ead9a8">
      <div style="background:#2a1409;padding:26px 28px;text-align:center">
        <div style="color:#f3d77a;font-size:13px;letter-spacing:4px">POETRY | SPOKEN WORDS | WORSHIP</div>
        <div style="color:#ffffff;font-size:28px;margin-top:10px;font-weight:bold">Life, Love, Christ 3.0</div>
        <div style="color:#d4af37;font-size:16px;margin-top:4px">An Evening with God</div>
      </div>
      <div style="padding:28px">
        <p style="font-size:18px;margin:0 0 14px">Hello ${first},</p>
        <p style="font-size:16px;line-height:1.6;margin:0 0 14px">Thank you for registering your interest. We are so glad you want to be part of this evening.</p>
        <p style="font-size:16px;line-height:1.6;margin:0 0 6px"><strong>Date:</strong> ${esc(EVENT_LINE)}</p>
        <p style="font-size:16px;line-height:1.6;margin:0 0 18px"><strong>Venue:</strong> ${esc(VENUE_LINE)}</p>
        <p style="font-size:15px;line-height:1.6;margin:0;color:#6b5a45">Follow us ${esc(INSTAGRAM)} or call ${esc(PHONE)} for any enquiries.</p>
        <p style="font-size:16px;margin:22px 0 0">With love,<br><strong>The Life, Love, Christ team</strong></p>
      </div>
    </div>
  </div>`;

  await transporter.sendMail({
    from: `"Life, Love, Christ" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: email,
    subject: "Thank you for registering your interest | Life, Love, Christ 3.0",
    text,
    html,
  });
  return { statusCode: 200, body: "sent" };
};
