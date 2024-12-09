const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

// Set port to 3002
const app = express();
const port = 3002;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mailchimp secrets
const mailchimpAPIKey = process.env.MC_API_KEY;
const audienceID = process.env.MC_AUDIENCE_ID;
const serverPrefix = 'us21';

// Tencent Email SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com', // SMTP server endpoint
  port: 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const manager_email = process.env.MISS_REG_MANAGER_EMAIL;
const roseneath_cs = process.env.COSTOMER_SERVICE_ROSENEATH;
const oneClub_cs = process.env.COSTOMER_SERVICE_1CLUB;

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
      res.status(200).json({ message: 'Successfully subscribed' });
    } else {
      res.status(response.status).json({ error: 'Failed to subscribe' });
    }
  } catch (error) {
    // Handle any errors that occur during the request
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

    res.status(200).json({ message: 'Successfully subscribed' });
  } catch (error) {
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
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('邮件发送成功:', info.response);
    res.status(200).json({ message: '邮件发送成功' });
  });

  transporter.sendMail(mailOptions_manager, (error, info) => {
    if (error) {
      console.log('邮件发送失败:', error);
      return res.status(500).json({ error: '邮件发送失败' });
    }
    console.log('邮件发送成功:', info.response);
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
  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: "Failed to send user's email." });
    }
    console.log('User Email sent successfully:', info.response);
  });

  // Send Costomer Service Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: "Failed to send service's email." });
    }
    console.log('CS Email sent successfully:', info.response);
  });

  // if no problem encountered:
  res.status(200).json({ message: 'Enquiry sent successfully!' });
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
  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: "Failed to send user's email." });
    }
    console.log('Client Email sent successfully:', info.response);
  });

  // Send Costomer Service Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: "Failed to send service's email." });
    }
    console.log('Management Email sent successfully:', info.response);
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
    text: `您好,

    请查看 api.do360.com/admin，有一位新的客户申请了俱乐部会员。

来自: ${Name}
电子邮件: ${Email}`
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
  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: "Failed to send user's email." });
    }
    console.log('Client Email sent successfully:', info.response);
  });

  // Send Costomer Service Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: "Failed to send service's email." });
    }
    console.log('Management Email sent successfully:', info.response);
  });

  // if no problem encountered:
  res.status(200).json({ message: 'Notification sent successfully!' });
});


// Up n Listen
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ====== Written By Hanny, L.E.09/12/2024 ====== //
