const sender_DO = require('../../config/transporter').transporter_send_do;

const roseneath_cs = process.env.COSTOMER_SERVICE_ROSENEATH;

async function rhp_contact(req, res) {
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
        html: `Hi there,<br><br>

You got a new enquiry from Roseneath Park Website:<br><br>

<b>${Question}</b><br><br>

<p>To reply to this enquiry, please click the button below: </p><br/>
<a href="mailto:${Email}?subject=${encodeURIComponent('Re: Your Enquiry About ' + Subject)}&body=${encodeURIComponent(
`Hi, ${Name}:

Thank you for your interest in Roseneath Holiday Park.



We look forward to hearing from you.

Kind regards,
Roseneath Holiday Park Management`
)}" 
style="display:inline-block; padding:10px 20px; margin-top:10px; background-color:#007BFF; color:#fff; text-decoration:none; border-radius:6px; font-family:Arial, sans-serif;">
Reply to ${Name}
</a><br><br>

From: ${Name}<br>
Email: ${Email}<br>
Phone Number: ${PhoneNumber || 'Not provided'}<br>
Company: ${Company || 'Not provided'}
`,};

    // Structure User Email
    const userMailOptions = {
        from: 'Roseneath Holiday Park <melbourne@do360.com>',
        to: Email,
        subject: 'Thank You for Your Interest in Roseneath Holiday Park',
        html: `<p>Dear <strong>${Name}</strong>,</p>
    <p>Thank you for your inquiry about <strong>Roseneath Holiday Park</strong>. </p> <br />
    <p>We are delighted to share that there are many exciting developments happening here, and we can't wait for you to experience them.</p>
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

module.exports = { rhp_contact };
