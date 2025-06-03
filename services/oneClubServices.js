const sender_DO = require('../config/transporter').transporter_send_do;

const oneClub_cs = process.env.COSTOMER_SERVICE_1CLUB;

async function oneclub_enquiry(req, res){
  const { Name, PhoneNumber, Email, Subject, Question } = req.body;

  // Check for required fields
  if (!Name || !Email || !Subject || !Question) {
    return res.status(400).json({ error: 'Name, Email, Subject, and Question are required fields.' });
  }

  // Define email content
  const mailOptions = {
    from: '1# Club Website <melbourne@do360.com>',
    to: oneClub_cs,
    subject: `${Name}的关于'${Subject}'的咨询`,
    text: `您好,

1号俱乐部网站里有新的咨询消息，请尽快查看回复：
${Question}

来自: ${Name}
电子邮箱: ${Email}
电话: ${PhoneNumber || '未提供'}`
  };

  // Structure User Email
  const userMailOptions = {
    from: '1# Club Team <melbourne@do360.com>',
    to: Email,
    subject: '感谢您对一号俱乐部的兴趣',
    html: `<p><strong>${Name}</strong> 您好,</p>
    <p>感谢您对<strong>1号俱乐部</strong>表达兴趣。 我们很高兴能收到您的咨询，并会尽快通过邮件为您解答！</p> <br/>
    <strong>1号俱乐部</strong></p>
    <p style="font-size: 12px; color: #888888; text-align: center;">*此邮件为自动发送，请勿回复</p>
    `,
  };

  // Send User Notification Email
  sender_DO.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error('[1club/enquiry] Error sending email:', error);
      return res.status(500).json({ error: "Failed to send user's email." });
    }
    console.log('[1club/enquiry] Client Email sent successfully:', info.response);
  });

  // Send Costomer Service Email
  sender_DO.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('[1club/enquiry] Error sending email:', error);
      return res.status(500).json({ error: "Failed to send service's email." });
    }
    console.log('[1club/enquiry] Management Email sent successfully:', info.response);
  });

  // if no problem encountered:
  res.status(200).json({ message: 'Enquiry sent successfully!' });
}

async function oneclub_membership_notify(req, res){
  const { Name, Email } = req.body;

  // Check for required fields
  if (!Name || !Email) {
    return res.status(400).json({ error: 'Name and Email are required fields.' });
  }

  // Define email content
  const mailOptions = {
    from: '1# Club Website <melbourne@do360.com>',
    to: oneClub_cs,
    subject: `来自${Name}的一号俱乐部会员申请`,
    html: `<p>您好,</p><br/>
    <p>请点击查看:</p>
    <p style="text-align: start;">
        <a href="https://api.do360.com/admin/content-manager/collection-types/api::one-club-membership.one-club-membership?page=1&pageSize=10&sort=Name:ASC&filters[$and][0][CurrentStatus][$eq]=Applied" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 4px;">申请人列表</a>
    </p>
    <p>有一位新的客户申请了俱乐部会员。</p>
    <br/>
    <p>来自: ${Name}<p>
    <p>电子邮件: ${Email}<p>`
  };

  // Structure User Email
  const userMailOptions = {
    from: '1# Club <melbourne@do360.com>',
    to: Email,
    subject: '感谢您申请1号俱乐部会员',
    html: `<p><strong>${Name}</strong> 您好,</p>
    <p>感谢您的耐心，我们已经收到您的俱乐部会员申请。</p> <br/>
    <p>我们将会即刻开始处理您的申请，请等待2-5个工作日。我们将会在审核后通过电邮/短信与您跟进。</p> <br/>
    <p style="margin-top: 20px;">敬祝安康,<br>
    <strong>1号俱乐部团队</strong></p>
    <p style="font-size: 12px; color: #888888; text-align: center;">*此邮件为自动发送，请勿回复</p>
    `,
  };

  // Send User Notification Email
  sender_DO.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error('[1club/membership-notify] Error sending email:', error);
      return res.status(500).json({ error: "Failed to send user's email." });
    }
    console.log('[1club/membership-notify] Client Email sent successfully:', info.response);
  });

  // Send Costomer Service Email
  sender_DO.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('[1club/membership-notify] Error sending email:', error);
      return res.status(500).json({ error: "Failed to send service's email." });
    }
    console.log('[1club/membership-notify] Management Email sent successfully:', info.response);
  });

  // if no problem encountered:
  res.status(200).json({ message: 'Notification sent successfully!' });
}

async function oneclub_coupon_distribute(req, res){
  const { name, email, data, title } = req.body; 

  if (!name || !data || !email || !title) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    QRCode.toDataURL(data, (err, qrCodeDataUrl) => {
      if (err) {
        console.error('[1club/coupon_distribute] Error generating QR code:', err);
        return res.status(500).json({ error: 'Failed to generate QR code.' });
      }

      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, 'base64');

      const userMailOptions = {
        from: '1# Club <melbourne@do360.com>',
        to: email,
        subject: '这是您的兑换券，请查收 / Your coupon from 1 Club',
        html: `
          <p><strong>${name}</strong> 您好,</p>
          <p>感谢您使用一号俱乐部的会员商城, 这是您的兑换券：</p> 
          <p>Thank you for using the Member's Market, here is your coupon: </p> 
          <br/>
          <div style="text-align:center;">
            <h2>${title}</h2>
            <img src="cid:qrcode" alt="Coupon QR Code" style="max-width: 250px; margin-top: 10px;"/>
          </div>
          <p>请至提供商处出示此码并告知来自1Club，他们会帮助您进行核销。如果有任何问题，欢迎随时联系我们！</p>
          <p>Please head to the Service Provider and show them this QR code. If you have any questions, please no not hesitate to contact us!</p>
          <br/>
          <p style="margin-top: 20px;">敬祝安康,<br>
          <strong>1号俱乐部团队</strong></p>
          <p style="font-size: 12px; color: #888888; text-align: center;">*此邮件为自动发送，请勿回复</p>
        `,
        attachments: [
          {
            filename: 'coupon.png',
            content: imgBuffer,
            encoding: 'base64',
            cid: 'qrcode',
          },
        ],
      };

      sender_DO.sendMail(userMailOptions, (error, info) => {
        if (error) {
          console.error('[1club/coupon_distribute] Error sending email:', error);
          return res.status(500).json({ error: "Failed to send user's email." });
        }
        console.log('[1club/coupon_distribute] Client Email sent successfully:', info.response);
      });

      res.status(200).json({ message: 'Notification sent successfully!' });
    });

  } catch (error) {
    console.error('[1club/coupon_distribute] Unexpected Error:', error);
    res.status(500).json({ error: 'Unexpected server error.' });
  }
}

module.exports = { oneclub_enquiry, oneclub_membership_notify, oneclub_coupon_distribute };
