const sender_DO = require('../../config/transporter').transporter_send_do;
const manager_email = process.env.MANAGER_EMAIL;
const path = require('path');
const fs = require('fs');


async function Customer_Application_Form_Notification(req, res) {
  const {
    Name, Email, isInAustralia, partnerID, productName, documentId, companyName,
    // 可以加更多字段
  } = req.body;

  if (!Email || !Name) {
    return res.status(400).json({ error: '缺少必要字段' });
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
  const logoUrl = `http://localhost:3002/public/360media/${logoFileName}`;

  // ✅ 加载并替换 HTML 模板
  const htmlTemplatePath = path.join(__dirname, 'CustomerApplicationFormNotification.html');
  let htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

  const todayDate = new Date().toLocaleDateString('zh-CN');


  // 替换变量
  htmlTemplate = htmlTemplate
    .replace(/{{bilibiliUrl}}/g, bilibiliUrl)
    .replace(/{{xiaohongshuUrl}}/g, xiaohongshuUrl)
    .replace(/{{logoUrl}}/g, logoUrl)
    .replace(/{{Name}}/g, Name)
    .replace(/{{brandName}}/g, productName || '合作品牌')
    .replace(/{{companyName}}/g, companyName || '')
    .replace(/{{sendDate}}/g, todayDate);


  // 这里内容没动，只补充 companyName 展示
  const mailOptions_user = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: Email,
    subject: '已收到您的申请资料',
    html: htmlTemplate,
  };

  const mailOptions_manager = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: manager_email,
    subject: '有新客户申请',
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

module.exports = { Customer_Application_Form_Notification };
