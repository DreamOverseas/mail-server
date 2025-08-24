const sender_DO = require('../../config/transporter').transporter_send_do;
const manager_email = process.env.MANAGER_EMAIL;
const path = require('path');
const fs = require('fs');

async function Customer_Application_Form_Notification(req, res) {


  console.log('收到数据：', req.body);

  
  const {
    surname,
    firstname,
    Email,
    isInAustralia,
    partnerID,
    productName,
    documentId,
    companyName,
    address,
    intakeTime,
    needAccommodation,
    needVisaAssist,
    otherNeeds,
    partnerType,
    advisorFirstName,
    advisorLastName,
  } = req.body;

  const Name = `${surname || ''}${firstname || ''}`;

  if (!Email || !Name) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  try {
    // ✅ logo、链接映射表
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
    const logoFileName = logoMap[productName] || '360media.png';
    const logoUrl = `${baseUrl}/public/360media/${logoFileName}`;
    const bilibiliIcon = `${baseUrl}/public/icons/bilibili.png`;
    const xiaohongshuIcon = `${baseUrl}/public/icons/red_note.png`;

    const bilibiliUrl = bilibiliMap[productName] || 'https://space.bilibili.com/3546717257468817';
    const xiaohongshuUrl = xiaohongshuMap[productName] || 'https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09';
    const todayDate = new Date().toLocaleDateString('zh-CN');

    // ✅ 模板变量替换函数
    function replaceTemplateVars(template, vars) {
      return Object.entries(vars).reduce((acc, [key, value]) => {
        const safeValue = typeof value === 'string' ? value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
        return acc.replace(new RegExp(`{{${key}}}`, 'g'), safeValue);
      }, template);
    }

    // ✅ 加载并渲染 HTML 模板
    const htmlTemplatePath = path.join(__dirname, 'CustomerApplicationFormNotification.html');
    let htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

    const htmlContent = replaceTemplateVars(htmlTemplate, {
      Name,
      logoUrl,
      bilibiliUrl,
      xiaohongshuUrl,
      bilibiliIcon,
      xiaohongshuIcon,
      brandName: productName || '合作品牌',
      companyName: companyName || '',
      sendDate: todayDate,
      address,
      intakeTime,
      needAccommodation: needAccommodation ? '是' : '否',
      needVisaAssist: needVisaAssist ? '是' : '否',
      otherNeeds,
    });

    // ✅ 发给客户
    const mailOptions_user = {
      from: '360 Media - 360传媒 <melbourne@do360.com>',
      to: Email,
      subject: '已收到您的申请资料',
      html: htmlContent,
    };

    // ✅ 发给管理员（精简 HTML）
    const mailOptions_manager = {
      from: '360 Media - 360传媒 <melbourne@do360.com>',
      to: manager_email,
      subject: '有新客户申请',
      html: `
        <div style="font-family:Arial, sans-serif; font-size:15px; color:#333;">
          <p><strong>新客户申请信息：</strong></p>
          <p>产品：${productName}</p>
          <p>公司名称：${companyName || ''}</p>
          <p>PartnerID: ${partnerID}</p>
          <p>客户姓名: ${Name} (${Email})</p>
          <p style="margin-top:20px; font-size:12px; color:#aaa;">此邮件为系统自动发送</p>
        </div>
      `,
    };

    // ✅ 发送两封邮件
    sender_DO.sendMail(mailOptions_user, (error, info) => {
      if (error) {
        console.error('[用户邮件发送失败]', error);
        return res.status(500).json({ error: '邮件发送失败' });
      }

      sender_DO.sendMail(mailOptions_manager, (err) => {
        if (err) {
          console.error('[管理员邮件发送失败]', err);
          return res.status(500).json({ error: '管理员邮件发送失败' });
        }

        res.status(200).json({ message: '邮件发送成功' });
      });
    });
  } catch (err) {
    console.error('[系统异常]', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

module.exports = { Customer_Application_Form_Notification };
