const sender_DO = require('../../config/transporter').transporter_send_do;
const QRCode = require('qrcode');

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
        console.log('[1club/member_distribute] Client Email sent successfully:', info.response);
      });

      res.status(200).json({ message: 'Notification sent successfully!' });
    });

  } catch (error) {
    console.error('[1club/member_distribute] Unexpected Error:', error);
    res.status(500).json({ error: 'Unexpected server error.' });
  }
}

module.exports = { oneclub_coupon_distribute };
