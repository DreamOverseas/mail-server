const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const loadServices = require('./controllers/ServicesController');
const path = require('path');
require('dotenv').config();

const allowedOrigins = [
  'http://localhost:3000', // TODO: Del
  'http://localhost:3001', // TODO: Del
  'http://localhost:3002',
  'http://localhost:3053', // TODO: Del
  'http://localhost:3003', // TODO: Del
  'http://localhost:5173', // TODO: Del
  'https://do360.com',
  'https://1club.world',
  'https://roseneathholidaypark.au',
  'https://coupon.do360.com',
  'https://server.coupon.do360.com',
  'https://missinternational.world',
  'https://world-cooperation.org',
];

// Set port to 3002
const app = express();
const port = 3002;

// Middleware
const corsOptions = {
  origin: function(origin, callback) {
    // 如果请求中没有 origin（如同域请求或非浏览器环境下的请求），直接允许
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

const servs = loadServices('services');

// Config imports
const sender_DO = require('./config/transporter').transporter_send_do;
//const sender_1club = require('./config/transporter').transporter_send_1club;


// ================== All entries are registered here =====================

/**
 * API handling email code verification for registration
 * to start, run ``` node index.js ``` from root
 */
app.post('/do-mail-code-verify', servs.mail_code_verify);

/**
 * API handling subscription for 360 Media website fron contact page
 * to start, run ``` node index.js ``` from root
 */
app.post('/360media/merchant-upload-notify', servs.merchant_upload_notify);

/**
 * API handling subscription for 360 Media website fron contact page
 * to start, run ``` node index.js ``` from root
 */
app.post('/subscribe/360media-contact', servs.media360_contact);

/**
 * API handling subscription for 360 Media website from PartnerApplicationForm page
 * to start, run ``` node index.js ``` from root
 */
app.post('/360media/Partner_Application_Form_Notification', servs.Partner_Application_Form_Notification);


/**
 * API handling subscription for 360 Media website from partner-application-form page
 * to start, run ``` node index.js ``` from root
 */
app.post('/360media/Customer_Application_Form_Notification', servs.Customer_Application_Form_Notification);


/**
 * API handling quick subscriptions form different sources like 360 Media / 1club website subscriptions
 * to start, run ``` node index.js ``` from root
 */
app.post('/subscribe/quick-subscription', servs.quick_subscription);

/**
 * API handling notification emails on Miss-Registering form submit
 * it will alkso send an email to notify the manager that new miss registered.
 */
app.post('/missinternational/register-confirmation', servs.mi_register_confirmation);

/**
 * API handling Contact enquiries from roseneath park website
*/
app.post('/roseneathpark/contact', servs.rhp_contact);

/**
 * API handling Sending Coupon QR to the Client [RHP]
*/
app.post('/roseneathpark/coupon_distribute', servs.rhp_coupon_distribute);

/**
 * API handling Contact enquiries from 1 club website
*/
app.post('/1club/enquiry', servs.oneclub_enquiry);

/**
 * API handling Contact enquiries from 1 club website
*/
app.post('/1club/membership-notify', servs.oneclub_membership_notify);

/**
 * API handling Sending Coupon QR to the Client [1Club]
*/
app.post('/1club/coupon_distribute', servs.oneclub_coupon_distribute);

/**
 * API handling Sending Coupon QR to the Client, with date of event specified [WCO]
*/
app.post('/wco/coupon_distribute', servs.wco_coupon_distribute);

/**
 * API handling sending Event-entry QR code to the given email, with date of event, contact, map img.. as needed [WCO]
*/
app.post('/wco/event_distribute', servs.wco_event_distribute);

/**
 * API handling Sending NotificaTION FOR POINT DEDUCTION THRU Member-Direct  [Membership]
*/
app.post('/member-direct-notify', servs.member_direct_notify);

/**
 * API handling Sending Notification for new activated WW member [Membership]
*/
app.post('/wco/member-notification', servs.wco_member_notification);

/**
 * API handling Sending Notification for new activated 1Club member [Membership]
*/
app.post('/1club/member-notification', servs.one_club_member_notification);

/**
 * API that sent an email template to destination email.
*/
app.post('/example/email-template', servs.example_email_template);

// Up n Listen
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ====== Written By Hanny, L.E.20/06/2025 ====== //
// ==== Effectively handling auto-mailing services for more than 300 days ==== //
