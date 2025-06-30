const sender_DO = require('../../config/transporter').transporter_send_do;
const QRCode = require('qrcode');

async function one_club_member_notification(req, res) {
  const { name, email, pass_link } = req.body;

  if (!name || !pass_link || !email) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    QRCode.toDataURL(pass_link, (err, qrCodeDataUrl) => {
      if (err) {
        console.error('[1club/coupon_distribute] Error generating QR code:', err);
        return res.status(500).json({ error: 'Failed to generate QR code.' });
      }

      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, 'base64');

      const userMailOptions = {
        from: '1# Club · 1号俱乐部 <melbourne@do360.com>',
        to: email,
        subject: '您的1号俱乐部联合会员电子卡 / Your digital membership card from 1#Club',
        html: `
<div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p style="font-size: 16px; margin-bottom: 16px;">
    尊敬的会员 <strong>${name}</strong> 您好，<br>
    Dear Member <strong>${name}</strong>,
  </p>

  <p style="font-size: 16px; margin-bottom: 12px;">
    我们已经为您准备好了您的专属电子会员卡。请点击下面的按钮，即刻将会员卡装进您的电子钱包。<br>
    We have prepared your exclusive digital membership card. Please click the button below to add the membership card to your digital wallet immediately.
  </p>

  <p style="text-align: center; margin: 20px 0;">
    <a
      href="${pass_link}"
      style="
        background-color: #87CEEB;
        color: #ffffff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 4px;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      添加至电子钱包 / Add to Wallet
    </a>
  </p>

  <p style="font-size: 16px; margin-top: 24px; margin-bottom: 12px;">
    或者手机相机扫描二维码（暂不支持微信扫描）：<br>
    Or scan the QR code with your phone camera (WeChat scanning not supported):
  </p>
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="margin: 0; font-size: 20px; color: #555555;">1# Club 会员</h2>
    <img
      src="cid:qrcode"
      alt="Membership QR Code"
      style="max-width: 250px; margin-top: 12px; border: 1px solid #dddddd; padding: 8px; background-color: #fafafa;"
    />
  </div>

  <p style="font-size: 16px; margin-top: 24px; margin-bottom: 8px;">
    敬祝安康，<br>
    <strong>1号俱乐部</strong><br><br>
    Best regards, <br>
    <strong>1# Club</strong>
  </p>
</div>
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
          console.error('[1club/member_distribute] Error sending email:', error);
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

module.exports = { one_club_member_notification };
