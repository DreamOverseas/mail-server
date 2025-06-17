const sender_DO = require('../../config/transporter').transporter_send_do;
const { formatName } = require('../../src/util');
const axios = require('axios');

const manager_email = process.env.MANAGER_EMAIL;

// Mailchimp secrets
const mailchimpAPIKey = process.env.MC_API_KEY;
const audienceID = process.env.MC_AUDIENCE_ID;
const serverPrefix = 'us21';

async function merchant_upload_notify(req, res){
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
}

async function media360_contact(req, res){
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
}

module.exports = { merchant_upload_notify, media360_contact };
