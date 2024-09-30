const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cors = require('cors');

// Set port to 3001
const app = express();
const port = 3002;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mailchimp secrets
const mailchimpAPIKey = '7a942dd9dbffb981aa7f0fe0bae7cbaa';
const audienceID = '712c2aeb4e';
const serverPrefix = 'us21';

// Tencent Email SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com', // SMTP server endpoint
  port: 465, // SMTP Port #（465 ? 587）
  auth: {
    user: 'melbourne@do360.com',
    pass: 'Qjcc4J73yEBrRfuS',
  },
});
const manager_email = "xing142857@gmail.com";


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
 * API handling subscription for 360 Media website subscriptions
 * to start, run ``` node index.js ``` from root
 */
app.post('/subscribe/360media-quick', async (req, res) => {
    const {
        email
    } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const response = await axios.post(
            `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceID}/members`,
            {
                email_address: email,
                status: 'subscribed',
                tags: ["360media"]
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
  // const mailOptions = {
  //   from: 'Miss International Melbourne <melbourne@do360.com>',
  //   to: email,
  //   subject: '报名提交确认 Comfirmation on Register',
  //   text: `你好 ${name}, 我们收到了你的报名申请，感谢你提交表单！我们会火速处理各项信息，期待在比赛中赛见到你的身影！Any questions please email info@missinternational.world`,
  //   html: `<p>你好 <b>${name}</b>, 我们收到了你的报名申请，感谢你提交表单！我们会火速处理各项信息，期待在比赛中赛见到你的身影！</p>
  //         <p>Any questions please email info@missinternational.world</p>`,
  // };

  // Email content for manager
  const mailOptions_manager = {
    from: 'Miss International Melbourne <melbourne@do360.com>',
    to: manager_email,
    subject: 'New Candidate Registered! 新佳丽报名了！',
    text: "Good'ay, 有位新佳丽报名了, 请查看!",
    html: `<p>Good'ay, 有位新佳丽报名了, 请即时查看哦!</p>`,
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

// Up n Listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// ====== Written By Hanny, L.E.30/09/2024 ====== //
