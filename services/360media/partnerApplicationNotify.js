const sender_DO = require('../../config/transporter').transporter_send_do;
const manager_email = process.env.MANAGER_EMAIL;

async function partner_apply_notifyyy(req, res) {
  const {
    Name, Email, isInAustralia, partnerID, productName, documentId, companyName,
    // 可以加更多字段
  } = req.body;

  if (!Email || !Name) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  // 这里内容没动，只补充 companyName 展示
  const mailOptions_user = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: Email,
    subject: '已收到您的申请资料',
    html: `
      <p>亲爱的 ${Name}，我们已收到您的申请信息...</p>
      <p>公司名称：${companyName ? companyName : ''}</p>
    `
  };

  const mailOptions_manager = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: manager_email,
    subject: '有新客户申请到xxx中',
    html: `
      <p>产品：${productName}<br>
      公司名称：${companyName ? companyName : ''}<br>
      PartnerID: ${partnerID}<br>
      客户姓名: ${Name} (${Email})<br>
      是否澳洲：${isInAustralia}
      </p>
    `
  };

  sender_DO.sendMail(mailOptions_user, (error, info) => {
    if (error) return res.status(500).json({ error: '邮件发送失败' });
    sender_DO.sendMail(mailOptions_manager, (err) => {
      if (err) return res.status(500).json({ error: '管理员邮件发送失败' });
      res.status(200).json({ message: '邮件发送成功' });
    });
  });
}

module.exports = { partner_apply_notifyyy };
