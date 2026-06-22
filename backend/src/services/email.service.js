const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

function getTransporter() {
  if (!config.mail.user || !config.mail.pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.port === 465,
      auth: { user: config.mail.user, pass: config.mail.pass },
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, html, text }) {
  if (!config.mail.enabled) return { sent: false, reason: 'mail disabled' };
  const transport = getTransporter();
  if (!transport) return { sent: false, reason: 'mail not configured' };

  try {
    await transport.sendMail({
      from: `"${config.mail.fromName}" <${config.mail.from || config.mail.user}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ''),
    });
    return { sent: true };
  } catch (err) {
    console.error('[Email]', err.message);
    return { sent: false, reason: err.message };
  }
}

async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,
    subject: `Welcome to ${config.appName}`,
    html: `<h2>Welcome, ${user.first_name}!</h2>
      <p>Your ${user.role} account has been created on ${config.appName}.</p>
      <p>Connecting Intelligence to Better Healthcare.</p>`,
  });
}

async function sendAccountCreatedEmail(user, tempPassword) {
  return sendEmail({
    to: user.email,
    subject: `Your ${config.appName} account`,
    html: `<h2>Hello ${user.first_name},</h2>
      <p>An administrator created your <strong>${user.role}</strong> account.</p>
      <p>Login: ${user.email}</p>
      ${tempPassword ? `<p>Please change your password after first login.</p>` : ''}`,
  });
}

module.exports = { sendEmail, sendWelcomeEmail, sendAccountCreatedEmail };
