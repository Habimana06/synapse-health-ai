const config = require('../config');

let twilioClient = null;

function getTwilio() {
  if (!config.sms.accountSid || !config.sms.authToken) return null;
  if (!twilioClient) {
    // eslint-disable-next-line global-require
    const twilio = require('twilio');
    twilioClient = twilio(config.sms.accountSid, config.sms.authToken);
  }
  return twilioClient;
}

async function sendSms(to, body) {
  if (!config.sms.enabled) return { sent: false, reason: 'sms disabled' };
  const client = getTwilio();
  if (!client || !config.sms.fromNumber) return { sent: false, reason: 'sms not configured' };

  try {
    let phone = to.replace(/\s/g, '');
    if (phone.startsWith('0')) phone = `+250${phone.slice(1)}`;
    if (!phone.startsWith('+')) phone = `+${phone}`;

    await client.messages.create({
      body,
      from: config.sms.fromNumber,
      to: phone,
    });
    return { sent: true };
  } catch (err) {
    console.error('[SMS]', err.message);
    return { sent: false, reason: err.message };
  }
}

async function sendWelcomeSms(user) {
  if (!user.phone) return { sent: false, reason: 'no phone' };
  return sendSms(user.phone, `Welcome to ${config.appName}, ${user.first_name}! Your ${user.role} account is ready.`);
}

async function sendAccountCreatedSms(user) {
  if (!user.phone) return { sent: false, reason: 'no phone' };
  return sendSms(user.phone, `${config.appName}: Your ${user.role} account was created. Login with ${user.email}`);
}

module.exports = { sendSms, sendWelcomeSms, sendAccountCreatedSms };
