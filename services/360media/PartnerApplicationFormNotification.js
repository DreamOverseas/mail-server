const fs = require('fs');
const path = require('path');
const sender_DO = require('../../config/transporter').transporter_send_do;
const manager_email = process.env.MANAGER_EMAIL;

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

  // ===== [1] 读取并替换模板内容 =====
  const templatePath = path.join(__dirname, '../../services/360media/360media-general-template.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  // 替换模板中变量 {{companyName}} 和 {{brandName}}（brandName = productName）
  htmlTemplate = htmlTemplate
    .replace(/{{companyName}}/g, companyName)
    .replace(/{{brandName}}/g, productName);

  // ===== [2] 用户邮件内容（使用模板） =====
  const mailOptions_user = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: Email,
    subject: `感谢申请加入 ${productName} 合作伙伴计划`,
    html: htmlTemplate
  };

  // ===== [3] 管理员通知邮件内容（保持原样） =====
  const mailOptions_manager = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: manager_email,
    subject: '【新合作伙伴申请】',
    html: `
      <p>新合作伙伴申请！</p>
      <p>
        产品: ${productName}<br>
        公司: ${companyName}<br>
        电话: ${Phone || '未填写'}<br>
        邮箱: ${Email}<br>
        ABN: ${abnNumber || '无'}<br>
        公司链接: ${companyUrlLink || '无'}<br>
        备注: ${Notes || '无'}
      </p>
      <br>
      <p>请尽快审核处理。</p>
      <br><p style="font-size: 12px; color: #888888; text-align: center;">*此邮件为自动发送，请勿直接回复。</p>
    `
  };

  // ===== [4] 顺序发送：先用户，后管理员 =====
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
