const sender_DO = require('../../config/transporter').transporter_send_do;

const oneClub_cs = process.env.COSTOMER_SERVICE_1CLUB;

async function oneclub_enquiry(req, res){
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
}

module.exports = { oneclub_enquiry };
