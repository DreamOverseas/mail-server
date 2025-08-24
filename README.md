# Mail Service APIs for Projects under S+/DOG

## Introduction
This Service API Collection allows users to achieve a series of email-related operations. The service uses a Node.js/Express backend to securely communicate with the Mailchimp API and Tencent Enterprise Email's SMTP service, ensuring that API keys and other sensitive information are not exposed on the client side.

## Prerequisites
- Node.js and npm installed on your server
- A Mailchimp account with an API key, audience ID, and server prefix
- A Linux cloud server with Nginx installed

## Usage / API List

### 1. Submitting an Email to subscription - `/subscribe/360media-contact`
Users can submit their email through the form on the frontend. The email, name and message(optional) to backend, then subscribe user to the audience. \
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/subscribe/360media-contact 
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

### 2. Quickly Submitting an Email to subscription - `/subscribe/quick-subscription`
Users can submit their email through the form on the frontend. The email will be sent to the backend, which processes the subscription request with Mailchimp. You will also need to specify the source where it comes from, forexample, if it's from 36O Media, then the "source" fdield should be something like "36O Media". \
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/subscribe/quick-subscription 
-H "Content-Type: application/json" 
-d '{"email":"test@example.com", "source":"Sample.org"}'
```
**Response**:
- Success: `{"message":"Successfully subscribed"}`
- Error: `{"error":"Some error message"}`
> ~~Note: These will mightly be merged if more platforms are coming up~~ Merged Nov 27 2024

### 3. Comfirmation Email - `/missinternational/register-confirmation`
After Submitting the register form and call this API, an email will be send to the miss and also a notifying email to manager. \
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/missinternational/register-confirmation 
  -H "Content-Type: application/json" -d '{
      "name" : "Banana McTester",
      "email": "test@example.com"
}'
```
**Response**:
- Success: `{"message":"邮件发送成功"}`
- Error: `{"error":"邮件发送失败"}`

### 4. Roseneath Park Enquiry Email Services - `/roseneathpark/contact/`
After Submitting the contact us form and call this API, an email will be send to the Costomer Service email address in .env with questions;
And send notification Email to the enquiree. \
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/roseneathpark/contact/
  -H "Content-Type: application/json" -d '{
  "Name": "Banana McTester",
  "PhoneNumber": "+61 123 456 789",
  "Email": "bananas@example.com",
  "Company": "Roseneath Park",
  "Subject": "Booking Inquiry",
  "Question": "I'd like to inquire about availability and rates."
}'
```
**Response**:
As usual, 200 for OK and meh otherwise...

### 5. 1# Club Enquiry Email Services - `/1club/enquiry/`
After Submitting the contact us form and call this API, an email will be send to the Costomer Service email address in .env with questions;
And send notification Email to the enquiree. \
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/1club/enquiry/
  -H "Content-Type: application/json" -d '{
  "Name": "Banana McTester",
  "PhoneNumber": "+61 123 456 789",
  "Email": "bananas@example.com",
  "Subject": "General Inquiry",
  "Question": "I'd like to inquire about Membership events."
}'
```
**Response**:
As usual, 200 for OK and meh otherwise...

### 6. 1# Club Membership Application Email Services - `/1club/membership-notify`
After Submitting the membership application form and call this API, an email will be send to the Costomer Service email address in .env for notification;
And send notification Email to the applicant. \
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/1club/membership-notify
  -H "Content-Type: application/json" -d '{
  "Name": "Banana McTester",
  "Email": "bananas@example.com"
}'
```
**Response**:
As usual, 200 for OK and meh otherwise...

### 7. 360Media mechant uploading received notification - `/360media/merchant-upload-notify`
After mechants submitting the form from 360Media, call this API. This will send a notification to the mechant's submitted email, as well as the manager's email. \
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/360media/merchant-upload-notify
  -H "Content-Type: application/json" -d '{
  "firstName": "Banana",
  "lastName": "McTester",
  "email": "bananas@example.com"
}'
```
**Response**:
As usual, 200 for OK and MEHHHH otherwise...

### 8. All-platform registration email verification code sending - `/do-mail-code-verify`
Could be called when new user registered for our platform. This will send the verification code with everything specified. Note that comparason should be done in the frontend.\
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/do-mail-code-verify
  -H "Content-Type: application/json" -d '{
  "from": "Media 360",
  "verify_code": "123456",
  "email": "bananas@example.com"
}'
```
**Response**:
As usual, 200 for OK and MEHHHH otherwise...

### 9. Coupon distribution API set - `/<business>/coupon_distribute`
Receives coupon code, and generate QR code then send as attatchment to the user's email given in request. Currently supported 1# Club, RHP and WCOxWTC. \
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/roseneathpark/coupon_distribute
  -H "Content-Type: application/json" -d '{
  "name": "Banana McTester",
  "email": "bananas@example.com",
  "data": "1a2b3c4d5f6e7788g",
  "title": "This is a Coupon's Title"
}'
```
```bash
POST https://mail-service.do360.com/1club/coupon_distribute
  -H "Content-Type: application/json" -d '{
  "name": "Banana McTester",
  "email": "bananas@example.com",
  "data": "1a2b3c4d5f6e7788g",
  "title": "This is a Coupon's Title"
}'
```
```bash
POST https://mail-service.do360.com/wco/coupon_distribute
  -H "Content-Type: application/json" -d '{
  "name": "Banana McTester",
  "email": "bananas@example.com",
  "data": "1a2b3c4d5f6e7788g",
  "date": <some ISO formatted datetime string>,
  "title": "This is a Coupon's Title"
}'
```
**Note**:
WCO's distribution API got a optional field "date" for booking event.
**Response**:
As usual, 200 for OK and MEHHHH otherwise...

### 10. WCO Event QR distribution + additional info - `/wco/event_distribute`
API handling sending notification and QR code for event puchased by client \
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/wco/event_distribute
  -H "Content-Type: application/json" -d '{
  "name": "Banana McTester",
  "email": "bananas@example.com",
  "data": "1a2b3c4d5f6e7788g",
  "date": <some ISO formatted datetime string>,
  "title": "This is a Event's Title"
}'
```
**Response**:
As usual, 200 for OK and MEHHHH otherwise...

### 11. Coupon Sys - MemberDirect point deduction notification - `/member-direct-notify`
API handling Sending Notification FOR POINT DEDUCTION THRU Member-Direct \
**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/member-direct-notify
  -H "Content-Type: application/json" -d '{
  "name": "Banana McTester",
  "email": "bananas@example.com",
  "account": "WCO",
  "point": 255,
  "discount": 240,
  "info": "One day rental of Tiny House"
}'
```
**Response**:
As usual, 200 for OK and MEHHHH otherwise...

### 12. 网红大赛选手商家注册通知邮件API - `/whds-notify/< biz | inf >`
> /whds-notify/biz is for business or merchant reg, /whds-notify/inf is for the influencer candidates

**Example HTTP Request**:
```bash
POST https://mail-service.do360.com/whds-notify/biz
  -H "Content-Type: application/json" -d '{
  "name": "Banana McTester",         // Name for business / influencer
  "email": "bananas@example.com"     // the email addr email is sending to
}'
```
**Response**:
As usual, 200 for OK and MEHHHH otherwise...

### 13. Coming Soon...

## Testing the API
You can test the API endpoint using tools like Postman or cURL.

**Example cURL Request**:
```bash
curl -X POST https://mail-service.do360.com/subscribe -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

## Reference
Author: Hanny Zhang \
Last Edit: 16:11 AEDT, 24/08/2025
