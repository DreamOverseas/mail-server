const { ISO2Date } = require('../../src/util');
const QRCode = require('qrcode');

const sender_DO = require('../../config/transporter').transporter_send_do;

async function wco_coupon_distribute(req, res) {
  const { name, email, data, title, date } = req.body;

  if (!name || !data || !email || !title) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    QRCode.toDataURL(data, (err, qrCodeDataUrl) => {
      if (err) {
        console.error('[wco/coupon_distribute] Error generating QR code:', err);
        return res.status(500).json({ error: 'Failed to generate QR code.' });
      }

      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, 'base64');

      const userMailOptions = {
        from: 'WTC Elite Club x WCO <melbourne@do360.com>',
        to: email,
        subject: '这是您的兑换券，请查收 / Your coupon from WTC & WCO',
        html: `
          <p><strong>${name}</strong> 您好,</p>
          <p>感谢您的预约, 这是您的兑换券：</p> 
          <br/>
          <div style="text-align:center;">
            <h2>${title}</h2>
            ${(date != undefined && date != '') && `<h5>Date of event: ${ISO2Date(date)}</h5>`}
            <img src="cid:qrcode" alt="Coupon QR Code" style="max-width: 250px; margin-top: 10px;"/>
          </div>
          <p>请您于预约时间至世贸中心地点，我们会帮助您进行兑换券核销。如果有任何问题，欢迎随时联系我们！</p>
          <br/>
          <p style="margin-top: 20px;">敬祝安康,<br>
          <strong>WTC Elite Club x WCO Team</strong></p>
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
          console.error('[wco/coupon_distribute] Error sending email:', error);
          return res.status(500).json({ error: "Failed to send user's email." });
        }
        console.log('[wco/coupon_distribute] Client Email sent successfully:', info.response);
      });

      res.status(200).json({ message: 'Notification sent successfully!' });
    });

  } catch (error) {
    console.error('[wco/coupon_distribute] Unexpected Error:', error);
    res.status(500).json({ error: 'Unexpected server error.' });
  }
}

module.exports = { wco_coupon_distribute };
