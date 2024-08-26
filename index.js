const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

// Set port to 3001
const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mailchimp secrets
const mailchimpAPIKey = '7a942dd9dbffb981aa7f0fe0bae7cbaa';
const audienceID = '712c2aeb4e';
const serverPrefix = 'us21';

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
        email,
        firstName,
        lastName
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
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
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

// Up n Listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// ====== Written By Hanny, L.E.26/08/2024 ====== //
