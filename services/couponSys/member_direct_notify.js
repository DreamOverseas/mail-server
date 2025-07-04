const sender_DO = require('../../config/transporter').transporter_send_do;

async function member_direct_notify(req, res) {
    const { name, account, email, point, discount, info } = req.body;

    if (!name || !account || !email || !point || !discount) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        const userMailOptions = {
            from: `${account} Team <melbourne@do360.com>`,
            to: email,
            subject: `${account} Membership-Direct 会员点数消费通知`,
            html: `
            <p><strong>${name}</strong> 您好：</p>
            <br/>
            <p>You just at ${account} consumed ${point} points through Member-Direct (Scan Membership QR), ${discount} of the points are discounted with your Discount Point.</p> 
            <p>您刚才于${account}处通过会员码扫描识别消费了${point}会员点，其中${discount}通过折扣点数抵扣。</p> 
            ${info &&
                `<strong><br/>${info}</strong>`
                }
            <br/>
            <br/>
            <p>For any questions, fell free to contact us! 如果有任何问题，欢迎随时联系我们！</p>
            <br/>
            <p style="margin-top: 20px;">敬祝安康,<br>
            <strong>${account} Team</strong></p>
            <p style="font-size: 12px; color: #888888; text-align: center;">*此邮件为自动发送，请勿回复</p>
        `,
        };

        sender_DO.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('[member_direct_notify] Error sending email:', error);
                return res.status(500).json({ error: "Failed to send user's email." });
            }
            console.log('[member_direct_notify] Client Email sent successfully:', info.response);
        });

        res.status(200).json({ message: 'Notification sent successfully!' });

    } catch (error) {
        console.error('[member_direct_notify] Unexpected Error:', error);
        res.status(500).json({ error: 'Unexpected server error.' });
    }
}

module.exports = { member_direct_notify };
