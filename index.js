const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mailchimp configurations
const mailchimpAPIKey = '7a942dd9dbffb981aa7f0fe0bae7cbaa';
const audienceID = '712c2aeb4e';
const serverPrefix = 'us21';

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const response = await axios.post(
            `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceID}/members`,
            {
                email_address: email,
                status: 'subscribed',
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

app.listen(port, () => {
    console.log(`Server is now up and running on port ${port}`);
});
