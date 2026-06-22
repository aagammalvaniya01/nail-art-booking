import nodemailer from 'nodemailer';

// Helper to create nodemailer transporter
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465, // true for port 465, false for other ports (like 587)
    auth: {
      user,
      pass,
    },
  });
};

// HTML Email Layout Wrapper
const getHtmlLayout = (title, contentHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Playfair Display', 'Didot', 'Georgia', serif;
      background-color: #0b0b0c;
      color: #f5f5f0;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0b0c;
      padding: 30px 10px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #121214;
      border: 1px solid #d4af37;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
    }
    .header {
      background-color: #0B0B0C;
      padding: 35px 20px;
      text-align: center;
      border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    }
    .header h1 {
      color: #d4af37;
      margin: 0;
      font-size: 26px;
      letter-spacing: 3px;
      font-weight: 300;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.7;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 20px;
      color: #e5e5e0;
    }
    .details-card {
      margin: 30px 0;
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(212, 175, 55, 0.15);
      border-radius: 6px;
      padding: 20px;
    }
    .details-row {
      display: flex;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 10px;
    }
    .details-row:last-child {
      margin-bottom: 0;
      border-bottom: none;
      padding-bottom: 0;
    }
    .label {
      color: #d4af37;
      font-weight: bold;
      width: 100px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      flex-shrink: 0;
    }
    .value {
      color: #ffffff;
      word-break: break-word;
    }
    .footer {
      background-color: #0b0b0c;
      padding: 25px 20px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11px;
      color: rgba(245, 245, 240, 0.4);
      border-top: 1px solid rgba(212, 175, 55, 0.25);
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
    }
    .btn {
      display: inline-block;
      background-color: #d4af37;
      color: #0b0b0c !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>AURA NAILS</h1>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Aura Nails Beverly Hills. All rights reserved.</p>
        <p>122 Luxury Plaza, Suite 4B, Beverly Hills, CA 90210 | <a href="mailto:hello@auranails.com">hello@auranails.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Main export to send contact notification email
export const sendContactEmails = async (contact) => {
  const adminEmail = 'aagammalvaniya28@gmail.com';
  
  // 1. Admin Email Template Content
  const adminHtml = getHtmlLayout(
    'New Contact Inquiry - Aura Nails',
    `
    <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #d4af37; font-size: 20px; margin-top: 0; font-weight: normal;">New Inquiry Received</h2>
    <p>A new message has been submitted from the Aura Nails contact form. Details are provided below:</p>
    
    <div class="details-card">
      <div class="details-row">
        <div class="label">Name</div>
        <div class="value">${contact.name}</div>
      </div>
      <div class="details-row">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${contact.email}" style="color: #d4af37; text-decoration: none;">${contact.email}</a></div>
      </div>
      <div class="details-row">
        <div class="label">Phone</div>
        <div class="value">${contact.phone || 'Not Provided'}</div>
      </div>
      <div class="details-row">
        <div class="label">Subject</div>
        <div class="value">${contact.subject}</div>
      </div>
      <div class="details-row">
        <div class="label">Message</div>
        <div class="value" style="white-space: pre-wrap;">${contact.message}</div>
      </div>
    </div>
    <p>You can reply directly to this inquiry by emailing the client at <a href="mailto:${contact.email}" style="color: #d4af37;">${contact.email}</a>.</p>
    `
  );

  // 2. User Thank-You Email Template Content
  const userHtml = getHtmlLayout(
    'Thank you for contacting Aura Nails',
    `
    <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #d4af37; font-size: 20px; margin-top: 0; font-weight: normal;">Thank You for Reaching Out</h2>
    <p>Dear ${contact.name},</p>
    <p>Thank you for contacting Aura Nails Beverly Hills! We have received your inquiry regarding <strong>"${contact.subject}"</strong>.</p>
    <p>Our team is currently reviewing your message and will get back to you shortly (typically within 24 hours). For your records, here is a summary of the message you submitted:</p>
    
    <div class="details-card">
      <div class="details-row">
        <div class="label">Subject</div>
        <div class="value">${contact.subject}</div>
      </div>
      <div class="details-row">
        <div class="label">Message</div>
        <div class="value" style="white-space: pre-wrap;">${contact.message}</div>
      </div>
    </div>
    
    <p>If you need urgent assistance or would like to schedule a session immediately, feel free to give us a call at <strong style="color: #d4af37;">+1 (555) 879-2458</strong>.</p>
    <p>Warm regards,<br><em style="color: #d4af37;">The Aura Nails Team</em></p>
    `
  );

  const transporter = getTransporter();

  if (!transporter) {
    console.log(`\n\x1b[33m%s\x1b[0m`, `[Email Warning] SMTP credentials not fully configured in .env.`);
    console.log(`\x1b[36m%s\x1b[0m`, `[Fallback Log] Printing email contents that would be sent:`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`[ADMIN NOTIFICATION]`);
    console.log(`To: ${adminEmail}`);
    console.log(`Subject: [Aura Nails] New Contact Inquiry: ${contact.subject}`);
    console.log(`Content:\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || 'N/A'}\nSubject: ${contact.subject}\nMessage: ${contact.message}`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`[USER CONFIRMATION]`);
    console.log(`To: ${contact.email}`);
    console.log(`Subject: Thank you for contacting Aura Nails!`);
    console.log(`Content:\nDear ${contact.name},\nThank you for reaching out regarding "${contact.subject}". We will contact you shortly.`);
    console.log(`--------------------------------------------------------------------------------\n`);
    return { success: true, mocked: true };
  }

  try {
    // Send to Admin
    const adminMailOptions = {
      from: `"Aura Nails Studio" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `[Aura Nails] New Contact Inquiry: ${contact.subject}`,
      html: adminHtml,
      replyTo: contact.email,
    };

    // Send to User
    const userMailOptions = {
      from: `"Aura Nails Studio" <${process.env.SMTP_USER}>`,
      to: contact.email,
      subject: `Thank you for contacting Aura Nails!`,
      html: userHtml,
    };

    // Run concurrently
    const [adminResult, userResult] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    console.log(`[Email Service] Emails successfully sent (Admin: ${adminResult.messageId}, User: ${userResult.messageId})`);
    return { success: true, mocked: false };
  } catch (error) {
    console.error('[Email Service Error]', error);
    // Return success: true so the DB save still succeeds even if email sending fails due to network/SMTP issues
    return { success: false, error: error.message };
  }
};

// Main export to send custom quote request notifications
export const sendQuoteEmails = async (quote) => {
  const adminEmail = 'aagammalvaniya28@gmail.com';

  // 1. Admin Email Template Content
  const adminHtml = getHtmlLayout(
    'New Custom Quote Request - Aura Nails',
    `
    <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #d4af37; font-size: 20px; margin-top: 0; font-weight: normal;">New Custom Quote Request</h2>
    <p>A new custom styling quote request has been submitted. Details are provided below:</p>
    
    <div class="details-card">
      <div class="details-row">
        <div class="label">Name</div>
        <div class="value">${quote.name}</div>
      </div>
      <div class="details-row">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${quote.email}" style="color: #d4af37; text-decoration: none;">${quote.email}</a></div>
      </div>
      <div class="details-row">
        <div class="label">Phone</div>
        <div class="value">${quote.phone}</div>
      </div>
      <div class="details-row">
        <div class="label">Category</div>
        <div class="value">${quote.serviceType}</div>
      </div>
      <div class="details-row">
        <div class="label">Budget</div>
        <div class="value">${quote.budget}</div>
      </div>
      <div class="details-row">
        <div class="label">Design Details</div>
        <div class="value" style="white-space: pre-wrap;">${quote.description}</div>
      </div>
    </div>
    <p>Please reply directly to this request by emailing the client at <a href="mailto:${quote.email}" style="color: #d4af37;">${quote.email}</a> with their quote details.</p>
    `
  );

  // 2. User Thank-You Email Template Content
  const userHtml = getHtmlLayout(
    'Custom Quote Request Received - Aura Nails',
    `
    <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #d4af37; font-size: 20px; margin-top: 0; font-weight: normal;">Custom Quote Request Received</h2>
    <p>Dear ${quote.name},</p>
    <p>Thank you for submitting your custom nail styling request to Aura Nails Beverly Hills! We are thrilled to help you design your dream nail art set.</p>
    <p>Our professional artists are currently reviewing your design ideas. We will reply to this email with a customized price quote and options within 24 hours.</p>
    
    <div class="details-card">
      <div class="details-row">
        <div class="label">Category</div>
        <div class="value">${quote.serviceType}</div>
      </div>
      <div class="details-row">
        <div class="label">Target Budget</div>
        <div class="value">${quote.budget}</div>
      </div>
      <div class="details-row">
        <div class="label">Your Request</div>
        <div class="value" style="white-space: pre-wrap;">${quote.description}</div>
      </div>
    </div>
    
    <p>If you have any image references or mockups you'd like to share in the meantime, feel free to reply directly to this email with your attachments.</p>
    <p>Warm regards,<br><em style="color: #d4af37;">The Aura Nails Team</em></p>
    `
  );

  const transporter = getTransporter();

  if (!transporter) {
    console.log(`\n\x1b[33m%s\x1b[0m`, `[Email Warning] SMTP credentials not fully configured in .env.`);
    console.log(`\x1b[36m%s\x1b[0m`, `[Fallback Log] Printing email contents that would be sent:`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`[ADMIN QUOTE REQUEST]`);
    console.log(`To: ${adminEmail}`);
    console.log(`Subject: [Aura Nails] New Custom Quote Request: ${quote.serviceType}`);
    console.log(`Content:\nName: ${quote.name}\nEmail: ${quote.email}\nPhone: ${quote.phone}\nCategory: ${quote.serviceType}\nBudget: ${quote.budget}\nDetails: ${quote.description}`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`[USER QUOTE CONFIRMATION]`);
    console.log(`To: ${quote.email}`);
    console.log(`Subject: Custom Quote Request Received - Aura Nails`);
    console.log(`Content:\nDear ${quote.name},\nThank you for submitting your custom nail styling request. We will review it and reply within 24 hours.`);
    console.log(`--------------------------------------------------------------------------------\n`);
    return { success: true, mocked: true };
  }

  try {
    // Send to Admin
    const adminMailOptions = {
      from: `"Aura Nails Studio" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `[Aura Nails] New Custom Quote Request: ${quote.serviceType}`,
      html: adminHtml,
      replyTo: quote.email,
    };

    // Send to User
    const userMailOptions = {
      from: `"Aura Nails Studio" <${process.env.SMTP_USER}>`,
      to: quote.email,
      subject: `Custom Quote Request Received - Aura Nails`,
      html: userHtml,
    };

    // Run concurrently
    const [adminResult, userResult] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    console.log(`[Email Service] Quote request emails successfully sent (Admin: ${adminResult.messageId}, User: ${userResult.messageId})`);
    return { success: true, mocked: false };
  } catch (error) {
    console.error('[Email Service Error]', error);
    return { success: false, error: error.message };
  }
};

// Main export to send booking request notifications
export const sendBookingEmails = async (booking) => {
  const adminEmail = 'aagammalvaniya28@gmail.com';

  // 1. Admin Email Template Content
  const adminHtml = getHtmlLayout(
    'New Appointment Request - Aura Nails',
    `
    <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #d4af37; font-size: 20px; margin-top: 0; font-weight: normal;">New Appointment Booking Request</h2>
    <p>A new appointment has been scheduled. Details are provided below:</p>
    
    <div class="details-card">
      <div class="details-row">
        <div class="label">Client Name</div>
        <div class="value">${booking.name}</div>
      </div>
      <div class="details-row">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${booking.email}" style="color: #d4af37; text-decoration: none;">${booking.email}</a></div>
      </div>
      <div class="details-row">
        <div class="label">Phone</div>
        <div class="value">${booking.phone}</div>
      </div>
      <div class="details-row">
        <div class="label">Service</div>
        <div class="value">${booking.service}</div>
      </div>
      <div class="details-row">
        <div class="label">Date & Time</div>
        <div class="value">${booking.date} at ${booking.slot}</div>
      </div>
      <div class="details-row">
        <div class="label">Status</div>
        <div class="value" style="color: #e5c158; font-weight: bold;">${booking.status || 'Pending'}</div>
      </div>
      ${booking.message ? `
      <div class="details-row">
        <div class="label">Notes</div>
        <div class="value" style="white-space: pre-wrap;">${booking.message}</div>
      </div>
      ` : ''}
    </div>
    <p>You can manage this appointment and update its status from the Aura Nails admin dashboard.</p>
    `
  );

  // 2. User Thank-You Email Template Content
  const userHtml = getHtmlLayout(
    'Appointment Booking Request - Aura Nails',
    `
    <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #d4af37; font-size: 20px; margin-top: 0; font-weight: normal;">Appointment Booking Request</h2>
    <p>Dear ${booking.name},</p>
    <p>Thank you for choosing Aura Nails Beverly Hills! We have received your appointment request. Your booking is currently <strong>Pending</strong> review, and our team will confirm your slot shortly.</p>
    <p>Here are your booking details:</p>
    
    <div class="details-card">
      <div class="details-row">
        <div class="label">Service</div>
        <div class="value">${booking.service}</div>
      </div>
      <div class="details-row">
        <div class="label">Date</div>
        <div class="value">${booking.date}</div>
      </div>
      <div class="details-row">
        <div class="label">Time Slot</div>
        <div class="value">${booking.slot}</div>
      </div>
      <div class="details-row">
        <div class="label">Status</div>
        <div class="value" style="color: #e5c158; font-weight: bold;">Pending Review</div>
      </div>
    </div>
    
    <p>If you need to reschedule or have any special requests, please reply to this email or call us directly at <strong style="color: #d4af37;">+1 (555) 879-2458</strong>.</p>
    <p>We look forward to styling your nails!</p>
    <p>Warm regards,<br><em style="color: #d4af37;">The Aura Nails Team</em></p>
    `
  );

  const transporter = getTransporter();

  if (!transporter) {
    console.log(`\n\x1b[33m%s\x1b[0m`, `[Email Warning] SMTP credentials not fully configured in .env.`);
    console.log(`\x1b[36m%s\x1b[0m`, `[Fallback Log] Printing email contents that would be sent:`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`[ADMIN BOOKING NOTIFICATION]`);
    console.log(`To: ${adminEmail}`);
    console.log(`Subject: [Aura Nails] New Appointment Booking: ${booking.service} on ${booking.date}`);
    console.log(`Content:\nName: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone}\nService: ${booking.service}\nDate: ${booking.date} at ${booking.slot}\nStatus: ${booking.status || 'Pending'}`);
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`[USER BOOKING CONFIRMATION]`);
    console.log(`To: ${booking.email}`);
    console.log(`Subject: Appointment Booking Request - Aura Nails`);
    console.log(`Content:\nDear ${booking.name},\nThank you for booking with Aura Nails. Your request for "${booking.service}" on ${booking.date} at ${booking.slot} is pending confirmation.`);
    console.log(`--------------------------------------------------------------------------------\n`);
    return { success: true, mocked: true };
  }

  try {
    // Send to Admin
    const adminMailOptions = {
      from: `"Aura Nails Studio" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `[Aura Nails] New Appointment Request: ${booking.service} on ${booking.date}`,
      html: adminHtml,
      replyTo: booking.email,
    };

    // Send to User
    const userMailOptions = {
      from: `"Aura Nails Studio" <${process.env.SMTP_USER}>`,
      to: booking.email,
      subject: `Appointment Booking Request - Aura Nails`,
      html: userHtml,
    };

    // Run concurrently
    const [adminResult, userResult] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    console.log(`[Email Service] Booking request emails successfully sent (Admin: ${adminResult.messageId}, User: ${userResult.messageId})`);
    return { success: true, mocked: false };
  } catch (error) {
    console.error('[Email Service Error]', error);
    return { success: false, error: error.message };
  }
};


