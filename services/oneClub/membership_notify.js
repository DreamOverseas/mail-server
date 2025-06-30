const sender_DO = require('../../config/transporter').transporter_send_do;

const oneClub_cs = process.env.COSTOMER_SERVICE_1CLUB;

async function oneclub_membership_notify(req, res){
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
}

module.exports = { oneclub_membership_notify };
