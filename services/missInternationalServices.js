const sender_DO = require('../config/transporter').transporter_send_do;

const manager_email = process.env.MANAGER_EMAIL;

async function mi_register_confirmation(req, res){
  const {
    name,
    email
  } = req.body;

  // Email Contents for new register
  const mailOptions = {
    from: 'Miss International Melbourne <melbourne@do360.com>',
    to: email,
    subject: 'Registeration Conformation: 环球小姐墨尔本2024',
    html: `<p><b>${name}</b> 小姐 您好：</p>
          <p>Hello, Miss <b>${name}</b>：</p>
          <br />
          <p>感谢您报名参加 第73届环球小姐中国大赛区澳洲分赛区- 墨尔本2024 ，我们已收到您的报名。我们的负责人Amy将会联系您，或者您也可通过下图中的联系方式主动联系Amy。</p>
          <p>Thank you for registering for the 73rd Miss Universe China Pageant Australia - Melbourne 2024, we have received your application. You will be contacted by our manager Amy, or you can contact Amy via the contact form below.</p>
          <br />
          <p>感谢您的配合！</p>
          <p>Thanks for your cooperation！</p>
          <br />
          <img src="cid:info@missinternational.world" alt="Amy Zhu: info@missinternational.world" />
          <br />
          <p>Best regards,</p>
          <p>John Du | CEO</p>
          <br><p style="font-size: 12px; color: #888888; text-align: center;">*This is an auto-send email, please do not reply.</p>
          `,
    attachments: [
      {
        filename: 'AmyZhu.jpg',
        path: './src/AmyZhu.jpg',
        cid: 'info@missinternational.world',
      },
    ]
  };

  // Email content for manager
  const mailOptions_manager = {
    from: 'Miss International Melbourne <melbourne@do360.com>',
    to: manager_email,
    subject: 'New Candidate Registered! 新佳丽报名了！',
    html: `<p>Good'ay, 有位新佳丽 <b>${name}</b> 报名了, 请即时查看哦!</p>`
  };

  // Send them!
  sender_DO.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('[missinternational/register-confirmation] 邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('[missinternational/register-confirmation] 邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });

  sender_DO.sendMail(mailOptions_manager, (error, info) => {
    if (error) {
      console.log('[missinternational/register-confirmation] 邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('[missinternational/register-confirmation] 邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });
}

module.exports = { mi_register_confirmation };
