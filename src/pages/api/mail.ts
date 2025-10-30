import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message, phone } = req.body;

  if (!name || !email || !message || !phone) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GODADDY_EMAIL,
        pass: process.env.GODADDY_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GODADDY_EMAIL,
      to: process.env.GODADDY_EMAIL,
      subject: `❗ New Enquiry from ${name}`,
      priority: 'high',
      headers: {
        'X-Priority': '1',
        Importance: 'High',
        Priority: 'Urgent',
      },
      text: `
Name: ${name}
Email: ${email}
Contact: ${phone}

    ${message}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to send email' });
  }
}
