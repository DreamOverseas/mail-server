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
    productName,
  } = req.body;

  if (!Email || !productName || !companyName) {
    return res.status(400).json({ error: '必填项未填写 (email, 产品名, 公司名)' });
  }

  // ✅ 品牌名 → logo 文件映射
  const logoMap = {
    '1club 1号俱乐部': '1club.jpg',
    '360创新孵化园': '360InovationPark.jpg',
    'AI美甲': 'nailTrain.jpg',
    'Decode 保护收益基金': 'decode.jpg',
    'Studyfin': 'studyfin.jpg',
    '世贸中心全场租赁套餐（讲堂+宴会厅+饮食等）': 'wco.jpg',
    '罗塞尼斯半岛度假村': 'roseneath.jpg',
  };

  const xiaohongshuMap = {
    'Studyfin': 'https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09',
    'AI美甲': 'https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09',
    '罗塞尼斯半岛度假村': 'https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09',
  };

  const bilibiliMap = {
    'Studyfin': 'https://space.bilibili.com/3546717257468817',
    'AI美甲': 'https://space.bilibili.com/3546717257468817',
    '罗塞尼斯半岛度假村': 'https://space.bilibili.com/3546717257468817',
  };

  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3002';
  const logoFileName = logoMap[productName] || '360media.jpg';
  const logoUrl = `${baseUrl}/public/360media/${logoFileName}`;
  const bilibiliUrl = bilibiliMap[productName] || 'https://space.bilibili.com/3546717257468817';
  const xiaohongshuUrl = xiaohongshuMap[productName] || 'https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09';

  const bilibiliIcon = `${baseUrl}/public/icons/bilibili.png`;
  const xiaohongshuIcon = `${baseUrl}/public/icons/red_note.png`;

  const htmlTemplatePath = path.join(__dirname, 'PartnerApplicationFormNotification.html');
  let htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

  const todayDate = new Date().toLocaleDateString('zh-CN');

  // ✅ 模板变量替换函数（与 Customer 版本统一）
  function replaceTemplateVars(template, vars) {
    return Object.entries(vars).reduce((acc, [key, value]) => {
      const safeValue = typeof value === 'string' ? value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
      return acc.replace(new RegExp(`{{${key}}}`, 'g'), safeValue);
    }, template);
  }

  const htmlContent = replaceTemplateVars(htmlTemplate, {
    logoUrl,
    bilibiliUrl,
    xiaohongshuUrl,
    bilibiliIcon,
    xiaohongshuIcon,
    companyName,
    brandName: productName || '合作品牌',
    Email,
    sendDate: todayDate,
  });

  const mailOptions_user = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: Email,
    subject: '合作伙伴申请已收到',
    html: htmlContent,
  };

  const mailOptions_manager = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: manager_email,
    subject: '【新合作伙伴申请】',
    html: `
      <p>新合作伙伴申请！</p>
      <p>产品: ${productName}</p>
      <p>公司名称: ${companyName}</p>
      <p>ABN: ${abnNumber || '未填写'}</p>
      <p>电话: ${Phone || '未填写'}</p>
      <p>备注: ${Notes || '无备注'}</p>
      <br>
      <p>请尽快审核处理。</p>
      <p style="font-size: 12px; color: #888888; text-align: center;">*此邮件为自动发送，请勿直接回复。</p>
    `,
  };

  sender_DO.sendMail(mailOptions_user, (error, info) => {
    if (error) {
      console.log('[partnerApply/notify] 用户邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }

    sender_DO.sendMail(mailOptions_manager, (err, info2) => {
      if (err) {
        console.log('[partnerApply/notify] 管理员邮件发送失败:', err);
        return res.status(500).json({ error: '管理员邮件发送失败' });
      }

      res.status(200).json({ message: '两封邮件发送成功' });
    });
  });
}

module.exports = { Partner_Application_Form_Notification };
