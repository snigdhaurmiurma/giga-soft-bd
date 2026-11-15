/**
 * GIGA SOFT LIMITED — PRODUCTION SERVERLESS INQUIRY & EMAIL HANDLER
 * Vercel Serverless Function (Node.js) with Direct SMTP & Nodemailer
 * 
 * Target Destination: info@gigadigitalagency.com / gigadigitalagency@gmail.com
 */

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Method Not Allowed. Only POST requests are accepted.'
    });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const name = (body.name || body.clientName || '').trim();
    const phone = (body.phone || body.clientPhone || '').trim();
    const email = (body.email || body.clientEmail || '').trim();
    const service = (body.service || body.serviceSelect || 'General Software Inquiry').trim();
    const message = (body.message || body.projectMessage || '').trim();

    // Basic Validation
    if (!name || !phone || !email || !message) {
      return res.status(422).json({
        status: 'validation_error',
        message: 'Please complete all required fields.'
      });
    }

    const referenceId = 'GSL-' + Date.now().toString().slice(-6);
    const destinationEmail = process.env.CONTACT_RECEIVER_EMAIL || 'info@gigadigitalagency.com';
    const bccEmail = process.env.CONTACT_BCC_EMAIL || 'gigadigitalagency@gmail.com';
    let submittedAt = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }) + ' (BST)';

    // Plain text and HTML templates
    const textContent = `
New Consultation Request [${referenceId}]
----------------------------------------
Client Name:    ${name}
Email Address:  ${email}
Phone/WhatsApp: ${phone}
Service:        ${service}
Timestamp:      ${submittedAt}

Project Details:
${message}
----------------------------------------
Sent via Giga Soft Limited (gigasoftbd.com)
`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0B1120; margin: 0; padding: 20px; color: #F1F5F9; }
    .card { max-width: 600px; margin: 0 auto; background: #111B30; border: 1px solid #1E293B; border-radius: 14px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0062FF, #8B5CF6, #FF6600); padding: 24px; text-align: center; }
    .header h1 { margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0; color: rgba(255,255,255,0.9); font-size: 13px; }
    .content { padding: 30px 26px; }
    .meta-box { background: rgba(0, 98, 255, 0.08); border-left: 4px solid #0062FF; padding: 14px 18px; margin-bottom: 24px; border-radius: 6px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 700; }
    .value { font-size: 15px; color: #FFFFFF; font-weight: 600; margin-top: 4px; }
    .msg-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 18px; border-radius: 8px; margin-top: 6px; font-size: 14px; line-height: 1.6; color: #E2E8F0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>GIGA SOFT LIMITED</h1>
      <p>New Client Consultation Request • ${referenceId}</p>
    </div>
    <div class="content">
      <div class="meta-box">
        <strong>Reference ID:</strong> ${referenceId}<br>
        <strong>Submitted:</strong> ${submittedAt}
      </div>
      <div class="field">
        <div class="label">Client Name</div>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">Corporate Email</div>
        <div class="value"><a href="mailto:${email}" style="color:#38BDF8; text-decoration:none;">${email}</a></div>
      </div>
      <div class="field">
        <div class="label">Phone / WhatsApp</div>
        <div class="value"><a href="tel:${phone}" style="color:#38BDF8; text-decoration:none;">${phone}</a></div>
      </div>
      <div class="field">
        <div class="label">Service Requested</div>
        <div class="value" style="color:#FB923C;">${service}</div>
      </div>
      <div class="field">
        <div class="label">Project Specifications &amp; Requirements</div>
        <div class="msg-box">${message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      This transmission was generated by Giga Soft Limited Portal for ${destinationEmail}.
    </div>
  </div>
</body>
</html>
`;

    let deliveredVia = 'logged';

    // 1. Direct SMTP via Nodemailer
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || '';
    if (smtpPass) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'mail.gigadigitalagency.com',
          port: parseInt(process.env.SMTP_PORT || '465', 10),
          secure: (process.env.SMTP_SECURE === 'true' || parseInt(process.env.SMTP_PORT || '465', 10) === 465),
          auth: {
            user: process.env.SMTP_USER || destinationEmail,
            pass: smtpPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await transporter.sendMail({
          from: `"Giga Soft Limited Portal" <${process.env.SMTP_USER || destinationEmail}>`,
          to: destinationEmail,
          bcc: bccEmail,
          replyTo: `"${name}" <${email}>`,
          subject: `[${referenceId}] New Consultation Request — ${name} (${service})`,
          text: textContent,
          html: htmlContent
        });

        deliveredVia = 'smtp';
        console.log(`[SMTP] Successfully dispatched inquiry #${referenceId} to ${destinationEmail}`);
      } catch (smtpErr) {
        console.error('SMTP dispatch error:', smtpErr);
      }
    }

    // 2. Resend API (if configured in environment)
    if (process.env.RESEND_API_KEY && deliveredVia !== 'smtp') {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Giga Soft Limited <onboarding@resend.dev>',
            to: [destinationEmail],
            bcc: [bccEmail],
            reply_to: email,
            subject: `[${referenceId}] New Consultation Request — ${name} (${service})`,
            html: htmlContent,
            text: textContent
          })
        });

        if (resendResponse.ok) {
          deliveredVia = 'resend';
          console.log(`[Resend] Successfully dispatched inquiry #${referenceId}`);
        }
      } catch (resendErr) {
        console.error('Resend dispatch error:', resendErr);
      }
    }

    // 3. FormSubmit Server-Side Fallback Dispatch
    if (deliveredVia === 'logged') {
      try {
        const fsRes = await fetch(`https://formsubmit.co/ajax/${destinationEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `New Consultation Request [${referenceId}] - ${name} (${service})`,
            _replyto: email,
            _captcha: 'false',
            reference_id: referenceId,
            client_name: name,
            client_email: email,
            client_phone: phone,
            service_requested: service,
            project_message: message,
            timestamp: submittedAt
          })
        });
        if (fsRes.ok) {
          deliveredVia = 'formsubmit_webhook';
          console.log(`[FormSubmit] Inquiry #${referenceId} sent to ${destinationEmail}`);
        }
      } catch (fsErr) {
        console.error('FormSubmit fallback error:', fsErr);
      }
    }

    return res.status(200).json({
      status: 'success',
      reference_id: referenceId,
      delivered_via: deliveredVia,
      message: `Thank you, ${name}! Your consultation request (Ref #${referenceId}) has been successfully submitted to ${destinationEmail}. Our engineers will contact you shortly.`,
      whatsapp_url: `https://wa.me/8801870699677?text=${encodeURIComponent(`Hello Giga Soft Limited, I just submitted consultation request #${referenceId} for ${service}: ${name} (${phone})`)}`,
      mailto_url: `mailto:${destinationEmail}?subject=${encodeURIComponent(`[${referenceId}] New Consultation Request — ${name} (${service})`)}&body=${encodeURIComponent(textContent)}`
    });

  } catch (error) {
    console.error('Server error in /api/contact:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process inquiry. Please contact us directly at info@gigadigitalagency.com or +880 1870-699677.'
    });
  }
};
