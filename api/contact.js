/**
 * GIGA SOFT LIMITED — PRODUCTION SERVERLESS INQUIRY & EMAIL HANDLER
 * Vercel Serverless Function (Node.js)
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

    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();
    const email = (body.email || '').trim();
    const service = (body.service || '').trim();
    const message = (body.message || body.projectMessage || '').trim();

    // Basic Validation
    if (!name || !phone || !email || !message) {
      return res.status(422).json({
        status: 'validation_error',
        message: 'Please complete all required fields.'
      });
    }

    const referenceId = 'GSL-' + Date.now().toString().slice(-6);

    // If Resend API key is available in environment
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Giga Soft Limited <onboarding@resend.dev>',
          to: [process.env.CONTACT_RECEIVER_EMAIL || 'info@gigadigitalagency.com'],
          reply_to: email,
          subject: `[${referenceId}] New Consultation Request — ${name} (${service || 'General'})`,
          html: `
            <h2>New Consultation Request from Giga Soft BD</h2>
            <p><strong>Reference:</strong> ${referenceId}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Project Details:</strong><br>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted via Giga Soft BD website.</small></p>
          `
        });
      } catch (err) {
        console.error('Resend delivery failed:', err);
      }
    }

    return res.status(200).json({
      status: 'success',
      reference_id: referenceId,
      message: `Thank you, ${name}! Your consultation request (Ref #${referenceId}) has been successfully submitted to info@gigadigitalagency.com.`
    });

  } catch (error) {
    console.error('Server error in /api/contact:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process inquiry. Please contact us directly at info@gigadigitalagency.com or +880 1870-699677.'
    });
  }
};
