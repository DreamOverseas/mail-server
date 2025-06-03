const sender_DO = require('../config/transporter').transporter_send_do;
const QRCode = require('qrcode');

const roseneath_cs = process.env.COSTOMER_SERVICE_ROSENEATH;

async function rhp_contact(req, res){
  const { Name, PhoneNumber, Email, Company, Subject, Question } = req.body;

  // Check for required fields
  if (!Name || !Email || !Subject || !Question) {
    return res.status(400).json({ error: 'Name, Email, Subject, and Question are required fields.' });
  }

  // Define email content
  const mailOptions = {
    from: 'Roseneath Park Website <melbourne@do360.com>',
    to: roseneath_cs,
    subject: `Question on '${Subject}' from ${Name}`,
    text: `Hi there,

You got a new enquiry from Roseneath Park Website:
${Question}

From: ${Name}
Email: ${Email}
Phone Number: ${PhoneNumber || 'Not provided'}
Company: ${Company || 'Not provided'}`,
  };

  // Structure User Email
  const userMailOptions = {
    from: 'Roseneath Holiday Park <melbourne@do360.com>',
    to: Email,
    subject: 'Thank You for Your Interest in Roseneath Holiday Park',
    html: `<p>Dear <strong>${Name}</strong>,</p>
    <p>Thank you for your inquiry about <strong>Roseneath Holiday Park</strong>. We are delighted to share that there are many exciting developments happening here, and we can't wait for you to experience them.</p>
    <p>To proceed with your booking and payment, please click the link below:</p>
    <p style="text-align: start;">
        <a href="https://book-directonline.com/properties/roseneathholidaypark-1" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 4px;">Book Now!</a>
    </p>
    <p>Our management team is looking forward to welcoming you soon.</p> <br>
    <p style="margin-top: 20px;">Warm regards,<br>
    <strong>The RHP Management Team</strong></p>
    <br><p style="font-size: 12px; color: #888888; text-align: center;">*This is an auto-send email, please do not reply.</p>
    `,
  };

  // Send User Notification Email
  sender_DO.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error('[roseneathpark/contact] Error sending email:', error);
      return res.status(500).json({ error: "Failed to send user's email." });
    }
    console.log('[roseneathpark/contact] User Email sent successfully:', info.response);
  });

  // Send Costomer Service Email
  sender_DO.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: "Failed to send service's email." });
    }
    console.log('[roseneathpark/contact] CS Email sent successfully:', info.response);
  });

  // if no problem encountered:
  res.status(200).json({ message: 'Enquiry sent successfully!' });
}

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
          <p>G'Day <strong>${name}</strong>,</p>
          <p>Thank you for using the Member's Market at Roseneath Holiday Park, here is your coupon: </p> 
          <p>感谢您使用罗塞尼斯营地半岛的会员商城, 这是您的兑换券：</p> 
          <br/>
          <div style="text-align:center;">
            <h2>${title}</h2>
            <img src="cid:qrcode" alt="Coupon QR Code" style="max-width: 250px; margin-top: 10px;"/>
          </div>
          <p>Please head to the Site and show our site manager this QR code. If you have any questions, please no not hesitate to contact us!</p>
          <p>请至营地管理人员处出示此码并告知会员身份，他们会帮助您进行核销。如果有任何问题，欢迎随时联系我们！</p>
          <br/>
          <p style="margin-top: 20px;">Warm Regards,<br>
          <strong>Roseneath Holiday Park</strong></p>
          <p style="font-size: 12px; color: #888888; text-align: center;">*This email is send automatically, please do not reply.</p>
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

module.exports = { rhp_contact, rhp_coupon_distribute };
