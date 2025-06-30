const sender_DO = require('../../config/transporter').transporter_send_do;

async function mail_code_verify(req, res){
  const { email, from, verify_code } = req.body;

  // Check if required data is provided
  if (!email || !from || !verify_code) {
    return res.status(400).json({ error: 'Sender, email and verification code is required' });
  }

  // Email Options for the verification
  const mailOptions = {
    from: `${from} <melbourne@do360.com>`,
    to: email,
    subject: 'Your Registration Verification Code',
    html: `<p>Dear new register: </p>
          <br />
          <p>Your unique verification code is <b>${verify_code}</b>. Please don't share with others. </p>
          <br />
          <p>Thank you for register!</p>
          <br />
          <p>Best regards,</p>
          <p>${from}</p>
          <br><p style="font-size: 12px; color: #888888; text-align: center;">*This is an auto-send email, please do not reply.</p>
          `,
  };

  // Send NOW
  sender_DO.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('[do-mail-code-verify] Verification Code failed to send:', error);
      return res.status(500).json({ error: '[do-mail-code-verify] Verification Code failed to send.' });
    }
    console.log('[do-mail-code-verify] Verification Code sent:', info.response);
    res.status(200).json({ message: 'Verification Code sent.' });
  });
}

module.exports = { mail_code_verify };
