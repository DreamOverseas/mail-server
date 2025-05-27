const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const QRCode = require('qrcode');
const { formatName } = require('./src/util');
require('dotenv').config();
const loadServices = require('./controllers/ServicesController');

const allowedOrigins = [
  'http://localhost:3000', // TODO: Del
  'http://localhost:3001', // TODO: Del
  'http://localhost:3053', // TODO: Del
  'http://localhost:3003', // TODO: Del
  'http://localhost:5173', // TODO: Del
  'https://do360.com',
  'https://1club.world',
  'https://roseneathholidaypark.au',
  'https://coupon.do360.com',
  'https://server.coupon.do360.com',
  'https://missinternational.world',
  'https://world-cooperation.org',
];

// Set port to 3002
const app = express();
const port = 3002;

// Middleware
const corsOptions = {
  origin: function(origin, callback) {
    // 如果请求中没有 origin（如同域请求或非浏览器环境下的请求），直接允许
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

const servs = loadServices('services');

// Mailchimp secrets
const mailchimpAPIKey = process.env.MC_API_KEY;
const audienceID = process.env.MC_AUDIENCE_ID;
const serverPrefix = 'us21';

// Config imports
const sender_DO = require('./config/transporter').transporter_send_do;
//const sender_1club = require('./config/transporter').transporter_send_1club;

const manager_email = process.env.MANAGER_EMAIL;
const roseneath_cs = process.env.COSTOMER_SERVICE_ROSENEATH;
const oneClub_cs = process.env.COSTOMER_SERVICE_1CLUB;


/**
 * API handling email code verification for registration
 * to start, run ``` node index.js ``` from root
 */
app.post('/do-mail-code-verify', async (req, res) => {
  const { email, from, verify_code } = req.body;

  // Check if required data is provided
  if (!email || !from || !verify_code) {
    return res.status(400).json({ error: 'Sender, email and verification code is required' });
  }

  // Email Options for the verification
  const mailOptions = {
    from: `${from} <melbourne@do360.com>`,
    to: email,
    subject: 'Your Registration Verification Code',
    html: `<p>Dear new register: </p>
          <br />
          <p>Your unique verrification code is <b>${verify_code}</b>. Please don't share with others. </p>
          <br />
          <p>Thank you for register!</p>
          <br />
          <p>Best regards,</p>
          <p>${from}</p>
          <br><p style="font-size: 12px; color: #888888; text-align: center;">*This is an auto-send email, please do not reply.</p>
          `,
  };

  // Send NOW
  sender_DO.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('[do-mail-code-verify] 邮件发送失败:', error);
      return res.status(500).json({ error: '[do-mail-code-verify] 邮件发送失败' });
    }
    console.log('[do-mail-code-verify] 邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });
})


/**
 * API handling subscription for 360 Media website fron contact page
 * to start, run ``` node index.js ``` from root
 */
app.post('/360media/merchant-upload-notify', async (req, res) => {
  const { email, firstName, lastName } = req.body;

  // Check if required data is provided
  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: 'Name and email is required' });
  }

  const mFullName = formatName(firstName, lastName);

  // Email Contents for new register
  const mailOptions = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: email,
    subject: 'Merchant Upload Received - 商家信息已收到',
    html: `<p>Dear <b>${mFullName}</b>：</p>
          <br />
          <p>感谢提交商家信息！我们已经收到您的提交内容并在全力审核中。请您耐心等待，如有问题请联系john.du@do360.com。</p>
          <p>Thank you for uploading your merchant details! We've received it and verifying it ASAP. Please wait paitiently we'll get back to you. For any further enquiries please contact us at john.du@do360.com.</p>
          <br />
          <p>感谢您的配合！</p>
          <p>Thanks for your cooperation！</p>
          <br />
          <p>Best regards,</p>
          <p>John Du | CEO</p>
          <br><p style="font-size: 12px; color: #888888; text-align: center;">*This is an auto-send email, please do not reply.</p>
          `,
  };

  // Email content for manager
  const mailOptions_manager = {
    from: '360 Media - 360传媒 <melbourne@do360.com>',
    to: manager_email,
    subject: 'New Merchant Submission 新商家提交表单了！',
    html: `<p>Good'ay, 有位新商家 <b>${mFullName}</b> 提交信息了, 请及时查看!</p>
    <br />
    <p>36OMedia Website</p>
    <br><p style="font-size: 12px; color: #888888; text-align: center;">*This is an auto-send email, please do not reply.</p>`
  };

  // Send NOW
  sender_DO.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('[360media/merchant-upload-notify] 邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('[360media/merchant-upload-notify] 邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });

  sender_DO.sendMail(mailOptions_manager, (error, info) => {
    if (error) {
      console.log('[360media/merchant-upload-notify] 邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('[360media/merchant-upload-notify] 邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });
})


/**
 * API handling subscription for 360 Media website fron contact page
 * to start, run ``` node index.js ``` from root
 */
app.post('/subscribe/360media-contact', async (req, res) => {
  const { email, firstName, lastName, message } = req.body;

  // Check if required data is provided
  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: 'Name and email is required' });
  }

  try {
    // Mailchimp API URL
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceID}/members`;

    // Payload for Mailchimp
    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        MESSAGE: message,
      },
    };

    // Send POST request to Mailchimp API
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `apikey ${mailchimpAPIKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if the response was successful
    if (response.status === 200) {
      console.log("[subscribe/360media-contact] New Subscription.");
      res.status(200).json({ message: 'Successfully subscribed' });
    } else {
      console.log("[subscribe/360media-contact] Subscription Failure.");
      res.status(response.status).json({ error: 'Failed to subscribe' });
    }
  } catch (error) {
    // Handle any errors that occur during the request
    console.log("[subscribe/360media-contact] Subscription Error.");
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});


/**
 * API handling quick subscriptions form different sources like 360 Media / 1club website subscriptions
 * to start, run ``` node index.js ``` from root
 */
app.post('/subscribe/quick-subscription', async (req, res) => {
  const {
    email, source
  } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!source) {
    return res.status(400).json({ error: 'Please specify the source this subscription is came from' });
  }

  try {
    const response = await axios.post(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceID}/members`,
      {
        email_address: email,
        status: 'subscribed',
        tags: [source]
      },
      {
        headers: {
          Authorization: `apikey ${mailchimpAPIKey}`,
        },
      }
    );
    console.log("[subscribe/quick-subscription] New Subscription.");
    res.status(200).json({ message: 'Successfully subscribed' });
  } catch (error) {
    console.log("[subscribe/quick-subscription] Errored Subscription.");
    res.status(500).json({ error: error.response.data.title });
  }
});


/**
 * API handling notification emails on Miss-Registering form submit
 * it will alkso send an email to notify the manager that new miss registered.
 */
app.post('/missinternational/register-confirmation', (req, res) => {
  const {
    name,
    email
  } = req.body;

  // Email Contents for new register
  const mailOptions = {
    from: 'Miss International Melbourne <melbourne@do360.com>',
    to: email,
    subject: 'Registeration Conformation: 环球小姐墨尔本2024',
    html: `<p><b>${name}</b> 小姐 您好：</p>
          <p>Hello, Miss <b>${name}</b>：</p>
          <br />
          <p>感谢您报名参加 第73届环球小姐中国大赛区澳洲分赛区- 墨尔本2024 ，我们已收到您的报名。我们的负责人Amy将会联系您，或者您也可通过下图中的联系方式主动联系Amy。</p>
          <p>Thank you for registering for the 73rd Miss Universe China Pageant Australia - Melbourne 2024, we have received your application. You will be contacted by our manager Amy, or you can contact Amy via the contact form below.</p>
          <br />
          <p>感谢您的配合！</p>
          <p>Thanks for your cooperation！</p>
          <br />
          <img src="cid:info@missinternational.world" alt="Amy Zhu: info@missinternational.world" />
          <br />
          <p>Best regards,</p>
          <p>John Du | CEO</p>
          <br><p style="font-size: 12px; color: #888888; text-align: center;">*This is an auto-send email, please do not reply.</p>
          `,
    attachments: [
      {
        filename: 'AmyZhu.jpg',
        path: './src/AmyZhu.jpg',
        cid: 'info@missinternational.world',
      },
    ]
  };

  // Email content for manager
  const mailOptions_manager = {
    from: 'Miss International Melbourne <melbourne@do360.com>',
    to: manager_email,
    subject: 'New Candidate Registered! 新佳丽报名了！',
    html: `<p>Good'ay, 有位新佳丽 <b>${name}</b> 报名了, 请即时查看哦!</p>`
  };

  // Send them!
  sender_DO.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('[missinternational/register-confirmation] 邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('[missinternational/register-confirmation] 邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });

  sender_DO.sendMail(mailOptions_manager, (error, info) => {
    if (error) {
      console.log('[missinternational/register-confirmation] 邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('[missinternational/register-confirmation] 邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });
});

/**
 * API handling Contact enquiries from roseneath park website
*/
app.post('/roseneathpark/contact', (req, res) => {
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
});

/**
 * API handling Sending Coupon QR to the Client [RHP]
*/
app.post('/roseneathpark/coupon_distribute', async (req, res) => {
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
});


/**
 * API handling Contact enquiries from 1 club website
*/
app.post('/1club/enquiry', (req, res) => {
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
});


/**
 * API handling Contact enquiries from 1 club website
*/
app.post('/1club/membership-notify', (req, res) => {
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
});

/**
 * API handling Sending Coupon QR to the Client [1Club]
*/
app.post('/1club/coupon_distribute', async (req, res) => {
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
});

/**
 * API handling Sending Coupon QR to the Client, with date of event specified [WCO]
*/
app.post('/wco/coupon_distribute', servs.wco_coupon_distribute);

/**
 * API handling sending Event-entry QR code to the given email, with date of event, contact, map img.. as needed [WCO]
*/
app.post('/wco/event_distribute', servs.wco_event_distribute);

/**
 * API handling Sending NotificaTION FOR POINT DEDUCTION THRU Member-Direct  [Membership]
*/
app.post('/member-direct-notify', servs.member_direct_notify);


// Up n Listen
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ====== Written By Hanny, L.E.23/05/2025 ====== //
// ==== Securely handling auto-mailing servers for more than 300 days ==== //
