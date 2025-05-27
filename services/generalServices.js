const sender_DO = require('../config/transporter').transporter_send_do;

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
          <p>Your unique verrification code is <b>${verify_code}</b>. Please don't share with others. </p>
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
      console.log('[do-mail-code-verify] 邮件发送失败:', error);
      return res.status(500).json({ error: '[do-mail-code-verify] 邮件发送失败' });
    }
    console.log('[do-mail-code-verify] 邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });
}

async function member_direct_notify(req, res) {
  const { name, account, email, point, discount, info } = req.body; 

  if (!name || !account || !email || !point || !discount) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
      const userMailOptions = {
        from: `${account} Team <melbourne@do360.com>`,
        to: email,
        subject: `${account} Membership-Direct 会员点数消费通知`,
        html: `
          <p><strong>${name}</strong> 您好：</p>
          <br/>
          <p>您刚才于${account}处通过会员码扫描识别消费了${point}会员点，其中${discount}通过折扣点数抵扣。</p> 
          ${info &&
          `<strong><br/>${info}</strong>`
        }
          <br/>
          <p>如果有任何问题，欢迎随时联系我们！</p>
          <br/>
          <p style="margin-top: 20px;">敬祝安康,<br>
          <strong>${account} Team</strong></p>
          <p style="font-size: 12px; color: #888888; text-align: center;">*此邮件为自动发送，请勿回复</p>
        `,
      };

      sender_DO.sendMail(userMailOptions, (error, info) => {
        if (error) {
          console.error('[member_direct_notify] Error sending email:', error);
          return res.status(500).json({ error: "Failed to send user's email." });
        }
        console.log('[member_direct_notify] Client Email sent successfully:', info.response);
      });

      res.status(200).json({ message: 'Notification sent successfully!' });

  } catch (error) {
    console.error('[member_direct_notify] Unexpected Error:', error);
    res.status(500).json({ error: 'Unexpected server error.' });
  }
}

module.exports = { mail_code_verify, member_direct_notify };
