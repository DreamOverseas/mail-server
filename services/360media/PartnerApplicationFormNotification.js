// services/partnerNotifyServices.js

const sender_DO = require('../../config/transporter').transporter_send_do;
const manager_email = process.env.MANAGER_EMAIL;

// 1. 合作伙伴申请邮件通知
async function Partner_Application_Form_Notification(req, res) {
  const {
    companyName,
    Phone,
    Email,
    Notes,
    abnNumber,
    companyUrlLink,
    productName
  } = req.body;

  if (!Email || !productName || !companyName) {
    return res.status(400).json({ error: '必填项未填写 (email, 产品名, 公司名)' });
  }

  // 发给用户的内容（保持你原本的内容）
  const mailOptions_user = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: Email,
    subject: '合作伙伴申请已收到',
    html: `
      <p>尊敬的 <b>${companyName}</b>代表，</p>
      <p>感谢贵公司申请成为 <b>${productName}</b> 的合作伙伴（公司：${companyName}）。</p>
      <p>我们已收到您的申请，会尽快与您联系。</p>
      <br />
      <p>Thank you for applying as a partner for <b>${productName}</b> (Company: ${companyName}).</p>
      <p>We have received your application and will get back to you soon.</p>
      <br>
      <p>Best regards,<br>360 Media 团队</p>
      <br><p style="font-size: 12px; color: #888888; text-align: center;">*此邮件为自动发送，请勿直接回复。</p>
    `
  };

  // 发给管理员的内容（保持你原本的内容）
  const mailOptions_manager = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: manager_email,
    subject: '【新合作伙伴申请】',
    html: `
      <p>新合作伙伴申请！</p>
      产品: ${productName}<br>
      公司: ${companyName}</p>
      <br>
      <p>请尽快审核处理。</p>
      <br><p style="font-size: 12px; color: #888888; text-align: center;">*此邮件为自动发送，请勿直接回复。</p>
    `
  };

  // 先发用户，再发管理员
  sender_DO.sendMail(mailOptions_user, (error, info) => {
    if (error) {
      console.log('[partnerApply/notify] 用户邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('[partnerApply/notify] 用户邮件发送成功:', info.response);

    sender_DO.sendMail(mailOptions_manager, (err, info2) => {
      if (err) {
        console.log('[partnerApply/notify] 管理员邮件发送失败:', err);
        return res.status(500).json({ error: '管理员邮件发送失败' });
      }
      console.log('[partnerApply/notify] 管理员邮件发送成功:', info2.response);
      res.status(200).json({ message: '两封邮件发送成功' });
    });
  });
}

module.exports = { Partner_Application_Form_Notification };
