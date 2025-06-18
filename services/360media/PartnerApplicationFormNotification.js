const path = require('path');
const fs = require('fs');
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

  // ✅ 品牌名 → logo 文件映射
  const logoMap = {
    '1club 1号俱乐部': '1club.jpg',
    '360创新孵化园': '360InovationPark.jpg',
    'AI美甲': 'nailTrain.png',
    'Decode 保护收益基金': 'decode.png',
    'Studyfin': 'studyfin.png',
    '世贸中心全场租赁套餐（讲堂+宴会厅+饮食等）': 'wco.png',
    '罗塞尼斯半岛度假村': 'roseneath.png',
  };

  const xiaohongshuMap = {
  'Studyfin': 'https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09',
  'AI美甲': 'https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09',
  '罗塞尼斯半岛度假村': 'https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09',
  // ... 可继续添加其他品牌
  };

  // fallback 默认链接（如有需要你可以自定义）
  const xiaohongshuUrl = xiaohongshuMap[productName] || 'https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09';

  const bilibiliMap = {
  'Studyfin': 'https://space.bilibili.com/3546717257468817',
  'AI美甲': 'https://space.bilibili.com/3546717257468817',
  '罗塞尼斯半岛度假村': 'https://space.bilibili.com/3546717257468817',
  // ... 可继续添加更多品牌
  };

  const bilibiliUrl = bilibiliMap[productName] || 'https://space.bilibili.com/3546717257468817';

  // ✅ 找到 logo 文件名
  const logoFileName = logoMap[productName] || '360media.png'; // fallback 用占位图
  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3002';
  const logoUrl = `${baseUrl}/public/360media/${logoFileName}`;

  // ✅ 加载并替换 HTML 模板
  const htmlTemplatePath = path.join(__dirname, 'PartnerApplicationFormNotification.html');
  let htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

  const todayDate = new Date().toLocaleDateString('zh-CN');

  htmlTemplate = htmlTemplate
    .replace(/{{bilibiliUrl}}/g, bilibiliUrl)
    .replace(/{{xiaohongshuUrl}}/g, xiaohongshuUrl)
    .replace(/{{companyName}}/g, companyName)
    .replace(/{{brandName}}/g, productName)
    .replace(/{{Email}}/g, Email)
    .replace(/{{sendDate}}/g, todayDate)
    .replace(/{{logoUrl}}/g, logoUrl);

  // ✅ 发给用户的邮件
  const mailOptions_user = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: Email,
    subject: '合作伙伴申请已收到',
    html: htmlTemplate,
  };

  // ✅ 发给管理员的邮件（可保持不变或自定义）
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

  // ✅ 邮件发送
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
