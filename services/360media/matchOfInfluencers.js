const sender_DO = require('../../config/transporter').transporter_send_do;

// const manager_email = process.env.MANAGER_EMAIL;

async function whds_biz_notify(req, res){
  const { email, name } = req.body;

  // Check if required data is provided
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email is required' });
  }

  const htmlBody = `
    <p>Dear <b>${name}</b>：</p>

    <div style="font-family: Arial, Helvetica, sans-serif; color: #222; line-height: 1.6; max-width: 680px;">

      <p style="margin:0 0 12px 0;">
        Thank you for registering with <b>360 Media</b>. We have received your merchant registration details.
        Our team is currently reviewing your submission, and we will get back to you as soon as possible once the processing is complete.
      </p>
      <p style="margin:0 0 12px 0;">
        If you require further assistance, please contact us at
        <a href="mailto:john.du@do360.com" style="color:#0b5ed7; text-decoration:none;">john.du@do360.com</a> or call at +61 413 168 533.
      </p>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;" />

      <p style="margin:0 0 12px 0;">
        感谢您注册 <b>360传媒（360 Media）</b>。我们已收到您的商家注册信息，
        正在进行审核与处理。待处理完成后，我们会尽快与您取得联系。
      </p>
      <p style="margin:0 0 12px 0;">
        如有其他事宜，请发送邮件至
        <a href="mailto:john.du@do360.com" style="color:#0b5ed7; text-decoration:none;">john.du@do360.com</a> 或致电 +61 413 168 533。
      </p>

      <p style="margin:24px 0 0 0;">Best regards,</p>
      <p style="margin:0;"><b>John Du</b> | CEO</p>
      <p style="margin:0;">360 Media</p>
      
      <img src="cid:logo_360media" alt="360 Media" style="display:block; width:140px; height:auto; margin:12px 0 20px 0;" />

      <p style="font-size:12px; color:#888888; text-align:center; margin-top:24px;">
        * This is an automated email; please do not reply. / 此邮件为系统自动发送，请勿直接回复。
      </p>
    </div>
  `;

  // Email Contents for new register
  const mailOptions = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: email,
    subject: 'Merchant Registration Received - 商家注册已收到',
    html: htmlBody,
    attachments: [
      {
        filename: '360media.png',
        path: 'public/360media/360media.png',
        cid: 'logo_360media'
      }
    ]
  };

  // Send NOW
  sender_DO.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('[whds-notify/biz] 邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('[whds-notify/biz] 邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });
}

async function whds_inf_notify(req, res){
  const { email, name } = req.body;

  // Check if required data is provided
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email is required' });
  }

  const htmlBody = `
    <p>Dear <b>${name}</b>：</p>

    <div style="font-family: Arial, Helvetica, sans-serif; color: #222; line-height: 1.6; max-width: 680px;">

      <p style="margin:0 0 12px 0;">
        Thank you for registering with <b>360 Media</b>. We have received your Influencer registration details.
        Our team is currently reviewing your submission, and we will get back to you as soon as possible once the processing is complete.
      </p>
      <p style="margin:0 0 12px 0;">
        If you require further assistance, please contact us at
        <a href="mailto:john.du@do360.com" style="color:#0b5ed7; text-decoration:none;">john.du@do360.com</a> or call at +61 413 168 533.
      </p>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;" />

      <p style="margin:0 0 12px 0;">
        感谢您注册 <b>360传媒（360 Media）</b>。我们已收到您的选手注册信息，
        正在进行审核与处理。待处理完成后，我们会尽快与您取得联系。
      </p>
      <p style="margin:0 0 12px 0;">
        如有其他事宜，请发送邮件至
        <a href="mailto:john.du@do360.com" style="color:#0b5ed7; text-decoration:none;">john.du@do360.com</a> 或致电 +61 413 168 533。
      </p>

      <p style="margin:24px 0 0 0;">Best regards,</p>
      <p style="margin:0;"><b>John Du</b> | CEO</p>
      <p style="margin:0;">360 Media</p>
      
      <img src="cid:logo_360media" alt="360 Media" style="display:block; width:140px; height:auto; margin:12px 0 20px 0;" />

      <p style="font-size:12px; color:#888888; text-align:center; margin-top:24px;">
        * This is an automated email; please do not reply. / 此邮件为系统自动发送，请勿直接回复。
      </p>
    </div>
  `;

  // Email Contents for new register
  const mailOptions = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: email,
    subject: 'Influencer Registration Received - 选手注册已收到',
    html: htmlBody,
    attachments: [
      {
        filename: '360media.png',
        path: 'public/360media/360media.png',
        cid: 'logo_360media'
      }
    ]
  };

  // Send NOW
  sender_DO.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('[whds-notify/inf] 邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('[whds-notify/inf] 邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });
}

module.exports = { whds_biz_notify, whds_inf_notify };
