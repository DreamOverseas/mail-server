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

#### 1. Submitting an Email to subscription [MailChimp]
Users can submit their email through the form on the frontend. The email, name and message(optional) to backend, then subscribe user to the audience.
**Example HTTP Request**:
```bash
POST http://localhost:3002/subscribe/360media-contact 
-H "Content-Type: application/json"
-d '{
  "email": "test@example.com",
  "firstName": "Hanny",
  "lastName": "Sama",
  "message": "Looking forward to working with you!"
}'
```
**Response**:
- Success: `{"message":"Successfully subscribed"}`
- Error: `{"error":"Some error message"}`

#### 2. Submitting an Email to subscription [MailChimp]
Users can submit their email through the form on the frontend. The email will be sent to the backend, which processes the subscription request with Mailchimp.
**Example HTTP Request**:
```bash
POST http://localhost:3002/subscribe/360media-quick -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```
**Response**:
- Success: `{"message":"Successfully subscribed"}`
- Error: `{"error":"Some error message"}`

#### 3. Comfirmation Email [Tencent_SMTP]
After Submitting the register form and call this API, an email will be send to the miss and also a notifying email to manager.
**Example HTTP Request**:
```bash
POST http://localhost:3002/missinternational/register-confirmation 
  -H "Content-Type: application/json" -d '{
      "name" : "Banana McTester",
      "email": "test@example.com"
}'
```
**Response**:
- Success: `{"message":"邮件发送成功"}`
- Error: `{"error":"邮件发送失败"}`

#### 4. Coming Soon...

### Testing the API
You can test the API endpoint using tools like Postman or cURL.

**Example cURL Request**:
```bash
curl -X POST http://localhost:3002/subscribe -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

## Reference
Author: Hanny Zhang \
Last Edit: 19:20-AEST 30/09/2024
