const sender_DO = require('../../config/transporter').transporter_send_do;
const axios = require('axios');

// Mailchimp secrets
const mailchimpAPIKey = process.env.MC_API_KEY;
const audienceID = process.env.MC_AUDIENCE_ID;
const serverPrefix = 'us21';

async function quick_subscription(req, res){
  const { email, source } = req.body;

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
    res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    console.log("[subscribe/quick-subscription] Errored Subscription.");
    res.status(500).json({ error: error.response.data.title });
  }
}

module.exports = { quick_subscription };
