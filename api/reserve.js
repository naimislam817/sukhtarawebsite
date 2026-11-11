// Vercel Serverless Function: POST /api/reserve
// Handles room reservations, alerts info@hotelshuktara.com, and sends confirmation to the guest.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const {
      fullName,
      email,
      phone,
      roomPreference = 'Standard Room',
      checkIn,
      checkOut,
      numRooms = 1,
      numGuests = 1,
      specialRequest = '',
      bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000),
      botcheck
    } = req.body || {};

    // 1. Spam Honeypot Check
    if (botcheck) {
      console.warn('Bot reservation blocked via honeypot:', { fullName, email });
      return res.status(200).json({
        success: true,
        message: 'Reservation received successfully.'
      });
    }

    // 2. Server-side validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Please enter your phone number.' });
    }

    const primaryNotificationEmail = 'reservation@hotelshuktara.com';
    const fallbackEmail = process.env.RESERVATION_EMAIL || 'info@hotelshuktara.com';
    const recipientEmails = [primaryNotificationEmail, fallbackEmail].filter((v, i, a) => a.indexOf(v) === i);

    const safeName = escapeHtml(fullName.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = escapeHtml(phone.trim());
    const safeRoom = escapeHtml(roomPreference);
    const safeCheckIn = escapeHtml(checkIn || 'Not specified');
    const safeCheckOut = escapeHtml(checkOut || 'Not specified');
    const safeRooms = escapeHtml(String(numRooms));
    const safeGuests = escapeHtml(String(numGuests));
    const safeMsg = escapeHtml(specialRequest || 'None');
    const safeId = escapeHtml(bookingId);
    const formattedDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'medium', timeStyle: 'short' });

    // ── Email 1: Hotel Staff Notification ──────────────────────────
    const staffSubject = `🛎️ New Reservation [${safeId}]: ${safeRoom} — ${safeName}`;
    const staffHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #091714 0%, #12463d 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #dfa04e;">
            <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #dfa04e; font-weight: 700;">Direct Website Booking</p>
            <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 700; letter-spacing: 1px;">HOTEL SHUKTARA DHAKA</h1>
            <p style="margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.8);">New Guest Reservation Alert</p>
          </div>

          <!-- Highlight Status Strip -->
          <div style="background-color: #fdf6ec; border-bottom: 1px solid #f9e7cd; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-size: 12px; color: #78350f; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Booking ID</span>
              <p style="margin: 2px 0 0; font-size: 18px; font-weight: 800; color: #12463d; font-family: monospace;">${safeId}</p>
            </div>
            <div style="text-align: right;">
              <span style="display: inline-block; background: #12463d; color: #dfa04e; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">Status: Pending Confirmation</span>
              <p style="margin: 4px 0 0; font-size: 11px; color: #78350f;">Booked: ${formattedDate} (BST)</p>
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 28px 24px;">

            <!-- Section 1: Guest Information -->
            <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #12463d; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
              👤 Guest Details
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; color: #64748b; font-weight: 600; width: 140px; border-radius: 6px 0 0 6px;">Full Name:</td>
                <td style="padding: 10px 14px; color: #0f172a; font-weight: 700; font-size: 15px; border-radius: 0 6px 6px 0;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Phone Number:</td>
                <td style="padding: 10px 14px; color: #0f172a;">
                  <a href="tel:${safePhone}" style="color: #12463d; font-weight: 700; text-decoration: none; font-size: 15px;">📞 ${safePhone}</a>
                  <a href="https://wa.me/${safePhone.replace(/[^0-9]/g, '')}" style="margin-left: 10px; display: inline-block; background: #25D366; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 12px; text-decoration: none;">WhatsApp</a>
                </td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; color: #64748b; font-weight: 600; border-radius: 6px 0 0 6px;">Email Address:</td>
                <td style="padding: 10px 14px; color: #0f172a; border-radius: 0 6px 6px 0;">
                  <a href="mailto:${safeEmail}" style="color: #12463d; font-weight: 600; text-decoration: underline;">${safeEmail}</a>
                </td>
              </tr>
            </table>

            <!-- Section 2: Stay Details -->
            <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #12463d; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
              🏨 Stay & Room Information
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; color: #64748b; font-weight: 600; width: 140px; border-radius: 6px 0 0 6px;">Room Category:</td>
                <td style="padding: 10px 14px; color: #12463d; font-weight: 800; font-size: 15px; border-radius: 0 6px 6px 0;">${safeRoom}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Check-In Date:</td>
                <td style="padding: 10px 14px; color: #0f172a; font-weight: 700;">📅 ${safeCheckIn}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; color: #64748b; font-weight: 600; border-radius: 6px 0 0 6px;">Check-Out Date:</td>
                <td style="padding: 10px 14px; color: #0f172a; font-weight: 700; border-radius: 0 6px 6px 0;">📅 ${safeCheckOut}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Rooms & Guests:</td>
                <td style="padding: 10px 14px; color: #0f172a; font-weight: 600;">
                  ${safeRooms} Room(s) &bull; ${safeGuests} Guest(s)
                </td>
              </tr>
            </table>

            <!-- Section 3: Special Request -->
            <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #12463d; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
              💬 Special Requests & Notes
            </h3>
            <div style="background: #f8fafc; border-left: 4px solid #dfa04e; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 28px;">
              <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; font-style: ${specialRequest ? 'normal' : 'italic'};">
                ${safeMsg}
              </p>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; padding-top: 8px;">
              <a href="tel:${safePhone}" style="display: inline-block; background: #12463d; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; margin: 4px; box-shadow: 0 4px 12px rgba(18,70,61,0.25);">
                📞 Call Guest Now
              </a>
              <a href="mailto:${safeEmail}?subject=Reservation%20Confirmed%20-%20Hotel%20Shuktara%20[${safeId}]" style="display: inline-block; background: #dfa04e; color: #091714; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; margin: 4px; box-shadow: 0 4px 12px rgba(223,160,78,0.3);">
                ✉️ Reply via Email
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #091714; color: #94a3b8; padding: 18px 24px; text-align: center; font-size: 12px; border-top: 1px solid rgba(223,160,78,0.2);">
            <p style="margin: 0 0 4px; color: #ffffff; font-weight: 600;">Hotel Shuktara (Pvt.) Ltd. Dhaka</p>
            <p style="margin: 0; color: #64748b;">HH 20/A, Indira Road, Sher-E-Bangla Nagar, Dhaka-1215 &bull; Hotline: +880 1400-334422</p>
          </div>

        </div>
      </body>
      </html>
    `;

    // ── Email 2: Guest Confirmation Receipt ────────────────────────
    const guestSubject = `Reservation Request Received [${safeId}] - Hotel Shuktara Dhaka`;
    const guestHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
        <div style="background-color: #0e3b30; color: #ffffff; padding: 28px 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px; color: #DFA04E;">HOTEL SHUKTARA</h1>
          <p style="margin: 6px 0 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.85;">A Tradition of Gracious Hospitality</p>
        </div>

        <div style="padding: 28px 24px; background-color: #faf8f5;">
          <h2 style="font-size: 18px; color: #0e3b30; margin-top: 0;">Dear ${safeName},</h2>
          <p style="font-size: 14px; color: #334155; line-height: 1.6;">
            Thank you for choosing <strong>Hotel Shuktara (Pvt.) Ltd.</strong> for your upcoming stay in Dhaka. We have successfully received your reservation request. Our 24/7 front desk team is reviewing your details and will contact you promptly.
          </p>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <div style="border-bottom: 2px solid #0e3b30; padding-bottom: 10px; margin-bottom: 14px; display: flex; justify-content: space-between;">
              <span style="font-size: 14px; font-weight: bold; color: #0e3b30; text-transform: uppercase;">Reservation Summary</span>
              <span style="font-size: 13px; color: #a67524; font-weight: bold;">Ref: ${safeId}</span>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 160px;">Room Category:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${safeRoom}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Number of Rooms:</td>
                <td style="padding: 8px 0; color: #0f172a;">${safeRooms} Room(s)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Number of Persons / Guests:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${safeGuests} Guest(s)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Check-In:</td>
                <td style="padding: 8px 0; color: #0f172a;"><strong>${safeCheckIn}</strong> (from 2:00 PM)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Check-Out:</td>
                <td style="padding: 8px 0; color: #0f172a;"><strong>${safeCheckOut}</strong> (until 12:00 PM)</td>
              </tr>
            </table>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 14px; font-weight: bold; color: #166534;">Complimentary Amenities Included:</p>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #166534; line-height: 1.6;">
              <li>Daily Complimentary Buffet Breakfast at Skylight Rooftop Restaurant (7:00 AM – 10:30 AM)</li>
              <li>High-speed Wi-Fi access throughout the hotel</li>
              <li>Complimentary tea and coffee setup replenished daily</li>
              <li>Free secure on-site parking with 24/7 security</li>
            </ul>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px;">
            <p style="margin: 0 0 6px; font-size: 14px; font-weight: bold; color: #0e3b30;">Need Immediate Assistance or Airport Pickup?</p>
            <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">
              Our front desk operates 24 hours a day, 7 days a week:<br />
              📞 <strong>Hotline:</strong> <a href="tel:+8801400334422" style="color: #0e3b30;">+880 1400-334422</a> / <a href="tel:+880298888777" style="color: #0e3b30;">+880 2-98888777</a><br />
              📧 <strong>Email:</strong> <a href="mailto:info@hotelshuktara.com" style="color: #0e3b30;">info@hotelshuktara.com</a><br />
              📍 <strong>Location:</strong> HH 20/A, Indira Road, Sher-E-Bangla Nagar, Dhaka-1215
            </p>
          </div>
        </div>

        <div style="background-color: #061813; color: #94a3b8; padding: 16px 24px; text-align: center; font-size: 12px;">
          Warm regards,<br />
          <strong>Front Desk & Reservations Team</strong><br />
          Hotel Shuktara (Pvt.) Ltd. Dhaka
        </div>
      </div>
    `;

    // ── 3. Email Delivery Strategy ─────────────────────────────────
    let deliveryMethod = 'none';

    // A) Resend API (if RESEND_API_KEY is configured in Vercel)
    if (process.env.RESEND_API_KEY) {
      try {
        const fromAddress = process.env.RESEND_FROM || 'Hotel Shuktara <onboarding@resend.dev>';

        // Send to Hotel Staff
        const resStaff = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: fromAddress,
            to: recipientEmails,
            reply_to: email,
            subject: staffSubject,
            html: staffHtml
          })
        });

        // Send to Guest
        const resGuest = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            reply_to: hotelNotificationEmail,
            subject: guestSubject,
            html: guestHtml
          })
        });

        if (resStaff.ok || resGuest.ok) {
          deliveryMethod = 'resend';
          console.log('✓ Reservation emails dispatched via Resend to:', { staff: recipientEmails, guest: email });
        }
      } catch (resendErr) {
        console.warn('Resend reservation delivery error:', resendErr);
      }
    }

    // B) Nodemailer SMTP (if SMTP host and user are configured in Vercel)
    if (deliveryMethod === 'none' && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
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

        // Send to staff
        await transporter.sendMail({
          from: `"Hotel Shuktara Reservations" <${process.env.SMTP_USER}>`,
          to: recipientEmails.join(', '),
          replyTo: email,
          subject: staffSubject,
          html: staffHtml
        });

        // Send to guest
        await transporter.sendMail({
          from: `"Hotel Shuktara Reservations" <${process.env.SMTP_USER}>`,
          to: email,
          replyTo: hotelNotificationEmail,
          subject: guestSubject,
          html: guestHtml
        });

        deliveryMethod = 'smtp';
        console.log('✓ Reservation emails dispatched via SMTP to:', { staff: recipientEmails, guest: email });
      } catch (smtpErr) {
        console.warn('SMTP reservation delivery error:', smtpErr);
      }
    }

    if (deliveryMethod === 'none') {
      console.log('ℹ️ Reservation received (logged locally, no live email credentials active):', {
        bookingId,
        fullName,
        email,
        phone,
        roomPreference,
        numGuests,
        checkIn,
        checkOut
      });
    }

    return res.status(200).json({
      success: true,
      bookingId,
      message: 'Reservation request successfully received! Confirmation has been sent to your email.'
    });

  } catch (err) {
    console.error('Reservation API error:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred while processing your reservation. Please contact us directly.'
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
