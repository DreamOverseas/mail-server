Sure, here's a brief documentation in Markdown format for your Mailchimp subscription service.

# Mailchimp Subscription Service

## Introduction
This Mailchimp Subscription Service allows users to subscribe to your mailing list by entering their email addresses and other mail-related operations. The service uses a Node.js/Express backend to securely communicate with the Mailchimp API, ensuring that API keys and other sensitive information are not exposed on the client side.

## Setup and Deployment

### Prerequisites
- Node.js and npm installed on your server
- A Mailchimp account with an API key, audience ID, and server prefix
- A Linux cloud server with Nginx installed

### Usage / API List

#### 1. Submitting an Email to subscription
Users can submit their email through the form on the frontend. The email will be sent to the backend, which processes the subscription request with Mailchimp.
**Example HTTP Request**:
```bash
POST http://localhost:3001/subscribe -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```
**Response**:
- Success: `{"message":"Successfully subscribed"}`
- Error: `{"error":"Some error message"}`

#### 2. Coming Soon...


### Testing the API
You can test the API endpoint using tools like Postman or cURL.

**Example cURL Request**:
```bash
curl -X POST http://localhost:3001/subscribe -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

## Reference
Author: Hanny Zhang \
Last Edit: 14:59-AEST 18/07/2024
