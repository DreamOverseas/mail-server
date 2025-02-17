const nodemailer = require('nodemailer');

// Tencent Email SMTP settings - Sender - Dream Overseas Group
const transporter_send_do = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Tencent Email SMTP settings - Receiver - Dream Overseas Group
const transporter_receive_do = nodemailer.createTransport({
  host: 'imap.exmail.qq.com',
  port: 993,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Tencent Email SMTP settings - Sender - 1 Club
const transporter_send_1club = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  auth: {
    user: process.env.SMTP_USER_1CLUB,
    pass: process.env.SMTP_PASS_1CLUB,
  },
});

// Tencent Email SMTP settings - Receiver - 1 Club
const transporter_receive_1club = nodemailer.createTransport({
  host: 'imap.exmail.qq.com',
  port: 993,
  auth: {
    user: process.env.SMTP_USER_1CLUB,
    pass: process.env.SMTP_PASS_1CLUB,
  },
});

module.exports = {transporter_send_do, transporter_receive_do, transporter_send_1club, transporter_receive_1club};
