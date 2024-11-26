# Mail Service APIs for Projects under S+/DOG

## Introduction
This Service API Collection allows users to achieve a series of email-related operations. The service uses a Node.js/Express backend to securely communicate with the Mailchimp API and Tencent Enterprise Email's SMTP service, ensuring that API keys and other sensitive information are not exposed on the client side.

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

#### 2/3. Quickly Submitting an Email to subscription [MailChimp]
Users can submit their email through the form on the frontend. The email will be sent to the backend, which processes the subscription request with Mailchimp.
**Example HTTP Request**:
```bash
POST http://localhost:3002/subscribe/360media-quick -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
POST http://localhost:3002/subscribe/chateau-le-marais-quick -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```
**Response**:
- Success: `{"message":"Successfully subscribed"}`
- Error: `{"error":"Some error message"}`
> Note: These will mightly be merged if more platforms are coming up

#### 4. Comfirmation Email [Tencent_SMTP]
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

#### 5. Roseneath Park Enquiry Email [Tencent_SMTP]
After Submitting the contact us form and call this API, an email will be send to the Costomer service email address in .env with questions
**Example HTTP Request**:
```bash
POST http://localhost:3002/roseneathpark/contact/
  -H "Content-Type: application/json" -d '{
  "Name": "John",
  "PhoneNumber": "+61 123 456 789",
  "Email": "john@example.com",
  "Company": "Roseneath Park",
  "Subject": "Booking Inquiry",
  "Question": "I'd like to inquire about availability and rates."
}'
```
**Response**:
As usual, 200 for OK and meh otherwise...

#### 6. Coming Soon...

### Testing the API
You can test the API endpoint using tools like Postman or cURL.

**Example cURL Request**:
```bash
curl -X POST http://localhost:3002/subscribe -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

## Reference
Author: Hanny Zhang \
Last Edit: 15:28-AEDT 29/10/2024
