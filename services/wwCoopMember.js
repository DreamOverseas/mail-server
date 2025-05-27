const { ISO2Date } = require('../src/util');
const QRCode = require('qrcode');

const sender_DO = require('../config/transporter').transporter_send_do;

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
            ${(date!=undefined && date!='') && `<h5>Date of event: ${ISO2Date(date)}</h5>`}
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

async function wco_event_distribute(req, res) {
  const { name, email, data, title, date } = req.body; 

  if (!name || !data || !email || !title) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    QRCode.toDataURL(data, (err, qrCodeDataUrl) => {
      if (err) {
        console.error('[wco/event_distribute] Error generating QR code:', err);
        return res.status(500).json({ error: 'Failed to generate QR code.' });
      }

      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, 'base64');

      const userMailOptions = {
        from: 'WTC Elite Club x WCO <melbourne@do360.com>',
        to: email,
        subject: '这是您的入场券，请查收 / Your Admission Ticket from WTC & WCO',
        html: `
          <p><strong>${name}</strong> 您好,</p>
          <p>感谢您对本次活动的支持与确认, 请凭此二维码参加活动及入场：</p> 
          <br/>
          <div style="text-align:center;">
            <h2>${title}</h2>
            <img src="cid:qrcode" alt="Admission QR Code" style="max-width: 250px; margin-top: 10px;" />
          </div>
          <br/>
          <p>📍 <b>活动地址 / Event Address：</b></p>
          <p style="margin-left: 1em;">
            墨尔本世贸中心 4 号楼 10 层 菁英汇俱乐部<br />
            Level 10, Tower 3, World Trade Centre,<br />
            18/38 Siddeley Street, Docklands VIC 3008
          </p>
          ${(date != undefined && date != '') ? `<p>⌚ <b>活动日期 / Date of Event:</b> ${ISO2Date(date)}</p>` : ''}
          <br/>
          <p>请您于预约时间至世贸中心(见地址与下方地图)，我们会帮助您进行入场检券。如有任何问题，欢迎随时联系我们！</p>
          <br/>
          <p style="margin-top: 20px;">敬祝安康,<br>
          <strong>WTC Elite Club x WCO Team</strong></p>
          <p style="margin-left: 1em;">
            朱联人- Ph: 0419 168 811<br/>
            Thomas - Ph: 0402 898 260
          </p>
          <p style="font-size: 12px; color: #888888; text-align: center;">*此邮件为自动发送，请勿回复</p>
          <div style="text-align:center; margin-top: 30px;">
            <img src="cid:gmap" alt="WTC Location Map" style="max-width: 100%; height: auto;" />
          </div>
        `,
        attachments: [
          {
            filename: 'admission_qr.png',
            content: imgBuffer,
            encoding: 'base64',
            cid: 'qrcode',
          },
          {
            filename: 'WTC_GMap.png',
            path: './public/WTC_GMap.png',
            cid: 'gmap',
          },
        ],
      };

      sender_DO.sendMail(userMailOptions, (error, info) => {
        if (error) {
          console.error('[wco/event_distribute] Error sending email:', error);
          return res.status(500).json({ error: "Failed to send user's email." });
        }
        console.log('[wco/event_distribute] Client Email sent successfully:', info.response);
      });

      res.status(200).json({ message: 'Notification sent successfully!' });
    });

  } catch (error) {
    console.error('[wco/event_distribute] Unexpected Error:', error);
    res.status(500).json({ error: 'Unexpected server error.' });
  }
}


module.exports = { wco_coupon_distribute, wco_event_distribute };
