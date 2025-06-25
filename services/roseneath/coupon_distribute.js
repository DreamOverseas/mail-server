const sender_DO = require('../../config/transporter').transporter_send_do;
const QRCode = require('qrcode');

async function rhp_coupon_distribute(req, res) {
  const { name, email, data, title } = req.body;

  if (!name || !data || !email || !title) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    QRCode.toDataURL(data, (err, qrCodeDataUrl) => {
      if (err) {
        console.error('[roseneathpark/coupon_distribute] Error generating QR code:', err);
        return res.status(500).json({ error: 'Failed to generate QR code.' });
      }

      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, 'base64');

      const userMailOptions = {
        from: 'Roseneath Holiday Park <melbourne@do360.com>',
        to: email,
        subject: 'Your coupon from Roseneath Holiday Park / 您兑换的核销券',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 720px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
    <div style="text-align: center;">
      <img src="cid:rhp-logo" alt="Roseneath Logo" style="max-height: 100px;" />
      <h1 style="color: #A9744F; margin-top: 0;">Roseneath Holiday Park</h1>
    </div>
    <hr style="border: none; border-top: 3px solid rgb(219, 162, 76); margin: 20px 0;" />
  
  <p>G'Day <strong>${name}</strong>,</p>
  <p>Thank you for using the Member's Market at Roseneath Holiday Park. Here is your exclusive coupon:</p>
  <p>感谢您使用罗塞尼斯营地半岛的会员商城，这是您的专属兑换券：</p>

  <div style="text-align: center; margin: 30px 0;">
    <h2 style="margin-bottom: 10px;">${title}</h2>
    <img src="cid:qrcode" alt="Coupon QR Code" style="max-width: 250px; border: 1px solid #ccc; padding: 5px; border-radius: 4px;"/>
  </div>

  <p>
    To redeem this coupon, please first contact us via the member hotline to make an appointment. On your scheduled date, visit our park and show the QR code to our site manager for redemption.
  </p>
  <p>
    请您先通过会员热线与我们预约兑换时间，并于预约日期亲临营地，向工作人员出示此二维码进行核销。
  </p>

  Member Hotline / 会员热线: <a href="tel:+61413168533">+61 (0) 413 168 533</a><br/>
  Roseneath Holiday Park Address / 营地地址：<a href="https://www.google.com/maps/place/Roseneath+Holiday+Park/@-38.0614514,147.4151558,15.5z/data=!4m18!1m8!3m7!1s0x6b2f12feefeca191:0xa1cd4ceb08044ad5!2sRoseneath+Park,+422+Woodpile+Rd,+Meerlieu+VIC+3862!3b1!8m2!3d-38.0616653!4d147.4217212!16s%2Fg%2F11cjgch_g_!3m8!1s0x6b2f12fa55ba106b:0x97796bb5b7b2aa37!5m2!4m1!1i2!8m2!3d-38.0620727!4d147.4187927!16s%2Fg%2F1vxcwl8x?entry=ttu&g_ep=EgoyMDI1MDYxNi4wIKXMDSoASAFQAw%3D%3D" target="_blank" style="color: #007BFF;">Roseneath Park, 422 Woodpile Rd, Meerlieu VIC 3862</a>

  <p>If you have any questions, please do not hesitate to contact us!</p>
  <p>如有任何问题，欢迎随时联系我们！</p>

  <hr style="width: 400px; border: none; border-top: 3px solid #ccc;" />
	<div style="text-align: center; padding: 0;">
	<p><b>For the most recent updates, please follow us in our platforms!</b></p>
    <a href="https://space.bilibili.com/3546823025232653" target="_blank" style="display: inline-block; margin: 0 10px;">
    <img src="cid:bilibili" alt="Bilibili" style="width: 32px; height: 32px;" />
    </a>
    <a href="https://www.youtube.com/channel/UC3GSuPpt3tClvoFp0l_nkCg" target="_blank" style="display: inline-block; margin: 0 10px;">
    <img src="cid:youtube" alt="Youtube" style="width: 32px; height: 32px;" />
    </a>
    <a href="http://weixin.qq.com/r/mp/pBFRSX-EDCJzrTsq90S2" target="_blank" style="display: inline-block; margin: 0 10px;">
    <img src="cid:wechat" alt="Wechat" style="width: 32px; height: 32px;" />
    </a>
    <a href="https://www.douyin.com/user/478539588" target="_blank" style="display: inline-block; margin: 0 10px;">
    <img src="cid:tiktok" alt="Tik Tok" style="width: 32px; height: 32px;" />
    </a>
	<p><b>关注我们的社媒以获得最新消息!</b></p>
	</div>
	<hr style="width: 400px; border: none; border-top: 3px solid #ccc;" />

  <br/>
  <p style="margin-top: 20px;">Warm Regards,<br>
    <strong>Roseneath Holiday Park</strong>
  </p>

  <p style="font-size: 12px; color: #888888; text-align: center; margin-top: 30px;">
    *This email was sent automatically. Please do not reply.
  </p>
</div>
        `,
        attachments: [
          {
            filename: 'logo.png',
            path: './public/rhp/rhp-logo.png',
            cid: 'rhp-logo',
          },
          {
            filename: 'coupon.png',
            content: imgBuffer,
            encoding: 'base64',
            cid: 'qrcode',
          },
          {
          filename: 'bilibili.png',
          path: './public/icons/bilibili_appicon.png',
          cid: 'bilibili',
          },
          {
          filename: 'youtube.png',
          path: './public/icons/youtube.png',
          cid: 'youtube',
          },
          {
          filename: 'wechat.png',
          path: './public/icons/wechat_appicon.png',
          cid: 'wechat',
          },
          {
          filename: 'tiktok.png',
          path: './public/icons/tiktok.png',
          cid: 'tiktok',
          },
        ],
      };

      sender_DO.sendMail(userMailOptions, (error, info) => {
        if (error) {
          console.error('[roseneathpark/coupon_distribute] Error sending email:', error);
          return res.status(500).json({ error: "Failed to send user's email." });
        }
        console.log('[roseneathpark/coupon_distribute] Client Email sent successfully:', info.response);
      });

      res.status(200).json({ message: 'Notification sent successfully!' });
    });

  } catch (error) {
    console.error('[roseneathpark/coupon_distribute] Unexpected Error:', error);
    res.status(500).json({ error: 'Unexpected server error.' });
  }
}

module.exports = { rhp_coupon_distribute };
