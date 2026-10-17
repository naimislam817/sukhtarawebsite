// Vercel Serverless Function: POST /api/contact
// Handles contact inquiries and sends notification emails via Resend or Nodemailer.

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const {
      name,
      email,
      phone,
      subject = 'General Inquiry',
      checkIn,
      checkOut,
      message,
      botcheck
    } = req.body || {};

    // 1. Spam Honeypot Check: If the hidden honeypot field is filled, silently ignore
    if (botcheck) {
      console.warn('Bot submission blocked via honeypot:', { name, email, botcheck });
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your inquiry has been received.'
      });
    }

    // 2. Server-side validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Please enter your phone number.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Please enter your message.' });
    }

    const primaryEmail = 'info@hotelshuktara.com';
    const fallbackEmail = process.env.RESERVATION_EMAIL || 'reservation@hotelshuktara.com';
    const recipientEmails = [primaryEmail, fallbackEmail].filter((v, i, a) => a.indexOf(v) === i);
    const recipientEmail = recipientEmails.join(', ');
    const emailSubject = `[Website Contact] ${subject} - ${name}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #12352E; color: #ffffff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px; color: #F4C46C;">HOTEL SHUKTARA (PVT.) LTD.</h1>
          <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">New Customer Contact Inquiry</p>
        </div>
        <div style="padding: 24px; background-color: #faf6ef;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #334155; width: 140px;">Customer Name:</td>
              <td style="padding: 10px 0; color: #0f172a;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #334155;">Email Address:</td>
              <td style="padding: 10px 0; color: #0f172a;"><a href="mailto:${escapeHtml(email)}" style="color: #12352E; font-weight: bold;">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #334155;">Phone Number:</td>
              <td style="padding: 10px 0; color: #0f172a;"><a href="tel:${escapeHtml(phone)}" style="color: #12352E; font-weight: bold;">${escapeHtml(phone)}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #334155;">Subject:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${escapeHtml(subject)}</td>
            </tr>
            ${checkIn ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #334155;">Check-In Date:</td>
              <td style="padding: 10px 0; color: #0f172a;">${escapeHtml(checkIn)}</td>
            </tr>
            ` : ''}
            ${checkOut ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #334155;">Check-Out Date:</td>
              <td style="padding: 10px 0; color: #0f172a;">${escapeHtml(checkOut)}</td>
            </tr>
            ` : ''}
          </table>
          <div style="margin-top: 20px; padding: 16px; background-color: #ffffff; border-left: 4px solid #DFA04E; border-radius: 4px;">
            <p style="margin: 0 0 6px; font-weight: bold; color: #12352E;">Customer Message:</p>
            <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
        </div>
        <div style="background-color: #0A1F1B; color: #94a3b8; padding: 14px 24px; text-align: center; font-size: 12px;">
          This message was submitted via the Contact Us form at Hotel Shuktara official website.
        </div>
      </div>
    `;

    // 3. Email Delivery Strategy:
    // A) Resend API (if RESEND_API_KEY is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Hotel Shuktara <onboarding@resend.dev>',
            to: [recipientEmail],
            reply_to: email,
            subject: emailSubject,
            html: emailHtml
          })
        });

        if (!resendRes.ok) {
          const resendErr = await resendRes.text();
          console.warn('Resend API returned non-200:', resendErr);
        } else {
          console.log('✓ Email delivered successfully via Resend to:', recipientEmail);
          return res.status(200).json({
            success: true,
            message: 'Thank you! Your message has been sent successfully. Our front desk will contact you shortly.'
          });
        }
      } catch (resendError) {
        console.warn('Resend delivery error:', resendError);
      }
    }

    // B) Nodemailer (if SMTP configuration is provided)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = (await import('nodemailer')).default;
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: `"Hotel Shuktara Contact" <${process.env.SMTP_USER}>`,
          to: recipientEmail,
          replyTo: email,
          subject: emailSubject,
          html: emailHtml
        });

        console.log('✓ Email delivered successfully via SMTP to:', recipientEmail);
        return res.status(200).json({
          success: true,
          message: 'Thank you! Your message has been sent successfully. Our front desk will contact you shortly.'
        });
      } catch (smtpError) {
        console.warn('SMTP delivery error:', smtpError);
      }
    }

    // C) Fallback: No credentials provided yet (or local dev)
    console.log('ℹ️ Contact form received (no email service keys configured). Details:', {
      name,
      email,
      phone,
      subject,
      checkIn,
      checkOut,
      messageSnippet: message.slice(0, 80)
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received. Our team will get back to you shortly.'
    });

  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred while sending your message. Please try again or call us directly.'
    });
  }
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
