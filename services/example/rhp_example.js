const sender_DO = require('../../config/transporter').transporter_send_do;
const { formatName } = require('../../src/util');
const axios = require('axios');

const manager_email = process.env.MANAGER_EMAIL;

// Mailchimp secrets
const mailchimpAPIKey = process.env.MC_API_KEY;
const audienceID = process.env.MC_AUDIENCE_ID;
const serverPrefix = 'us21';

async function example_email_template(req, res) {
	const { email, name } = req.body;

	// Check if required data is provided
	if (!email || !name) {
		return res.status(400).json({ error: 'Name and email is required' });
	}

	// Email content for manager
	const mailOptions = {
		from: '360 Media - 360传媒 <melbourne@do360.com>',
		to: manager_email,
		subject: 'New Merchant Submission 新商家提交表单了！',
		html: `<div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
  <div style="text-align: center;">
	<img src="cid:rhp-logo" alt="Roseneath Logo" style="max-height: 120px;" />
	<h1 style="color: #A9744F; margin-top: 10px;">Roseneath Holiday Park</h1>
  </div>

  <hr style="border: none; border-top: 5px solid rgb(219, 162, 76); margin: 30px 0;" />

  <div style="text-align: center; max-width: 640px; margin: 0 auto; font-size: 14px;">
	<p>Hi ${name}</p>
	<p>We're excited to introduce you to Roseneath Holiday Park – your perfect coastal escape nestled in the heart of the beautiful East Gippsland region. 
	Check the following <a href="https://www.bilibili.com/video/BV1anR1YbErX" target="_blank">video</a> that shows how our Park looks like!</p>

	<div style="text-align: center; margin: 20px 0;">
	  <a href="https://www.bilibili.com/video/BV1anR1YbErX" target="_blank">
		<img src="cid:rhp-intro" alt="Park Introduction" style="width: 60%; height: auto; border-radius: 10px;" />
	  </a>
	</div>

	<p>Whether you're seeking family fun, investment opportunities, or a relaxing getaway, Roseneath offers scenic waterfront views, modern amenities, and a welcoming community for all ages.</p>

	<div style="margin-top: 30px;">
	<b>- Quick Links -</b>
	  <p><a href="https://roseneathholidaypark.au/" target="_blank" style="text-decoration: none; font-weight: bold; color: inherit;">🏠 Official Website ➡️</a></p>
	  <p><a href="https://roseneathholidaypark.au/gallery" target="_blank" style="text-decoration: none; font-weight: bold; color: inherit;">🖼️ View Gallery ➡️</a></p>
	  <p><a href="https://roseneathholidaypark.au/investment" target="_blank" style="text-decoration: none; font-weight: bold; color: inherit;">📈 Investment ➡️</a></p>
	  <p><a href="https://roseneathholidaypark.au/contact-us" target="_blank" style="text-decoration: none; font-weight: bold; color: inherit;">📩 Send us Enquiry ➡️</a></p>
	</div>

	<div style="text-align: center; margin-top: 30px;">
	  <a href="https://book-directonline.com/properties/roseneathholidaypark-1" target="_blank" 
		  style="background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px;">
		Book your journey from here
	  </a>
	</div>
	
	<br/>
	<hr style="width: 400px; border: none; border-top: 3px solid #ccc;" />

	<p><b>For the most recent updates, please follow us in our platforms!</b></p>
	<div style="text-align: center; margin: 20px 0 20px 0;">
	  <a href="https://space.bilibili.com/3546717257468817" target="_blank" style="display: inline-block; margin: 0 10px;">
		<img src="cid:bilibili" alt="Bilibili" style="width: 32px; height: 32px;" />
	  </a>
	  <a href="https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09" target="_blank" style="display: inline-block; margin: 0 10px;">
		<img src="cid:rednote" alt="Red Notes" style="width: 32px; height: 32px;" />
	  </a>
	  <a href="http://weixin.qq.com/r/mp/pBFRSX-EDCJzrTsq90S2" target="_blank" style="display: inline-block; margin: 0 10px;">
		<img src="cid:wechat" alt="Wechat" style="width: 32px; height: 32px;" />
	  </a>
	</div>
	
	<hr style="width: 400px; border: none; border-top: 3px solid #ccc;" />
  </div>

  <div style="margin-top: 40px; font-size: 14px;">
	<b>Our Address</b>
	<p>📍 422 Woodpile Rd, Meerlieu VIC 3862, Australia</p>
	<b>General Enquiries</b>
	<p>📞 +61 413 168 533</p>
	<p>✉️ info@roseneathholidaypark.au</p>
	<b>Investments</b>
	<p>📞 +61 413 168 533</p>
	<p>✉️ corp@roseneathholidaypark.au</p>
  </div>

  <p style="margin-top: 30px;">Best regards,<br/><strong>Roseneath Holiday Park Team</strong></p>

  <p style="font-size: 12px; color: #888888; text-align: center;">*This is an automated message. Please do not reply directly.</p>
</div>
`,
	attachments: [
		{
		filename: 'logo.png',
		path: './public/rhp/rhp-logo.png',
		cid: 'rhp-logo',
		},
		{
		filename: 'video_capture.jpg',
		path: './public/rhp/rhp-intro.jpg',
		cid: 'rhp-intro',
		},
		{
		filename: 'bilibili.png',
		path: './public/icons/bilibili_appicon.png',
		cid: 'bilibili',
		},
		{
		filename: 'rednote.png',
		path: './public/icons/red_note.png',
		cid: 'rednote',
		},
		{
		filename: 'wechat.png',
		path: './public/icons/wechat_appicon.png',
		cid: 'wechat',
		},
	],
	};

	// Send NOW
	sender_DO.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log('[example_email_template] Email sent failed.', error);
			return res.status(500).json({ error: 'Email sent failed.' });
		}
		console.log('[example_email_template] Email sent.', info.response);
		res.status(200).json({ message: 'Email sent.' });
	});
}

module.exports = { example_email_template };
