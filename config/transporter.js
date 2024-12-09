const nodemailer = require('nodemailer');

// Tencent Email SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = transporter;
