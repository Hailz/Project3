require("dotenv").config();
var express = require('express');
var router = express.Router(); 
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var User = require('../models/user');
var Excuses = require('../models/excuses');

var client = require('twilio')(accountSid, authToken);

router.route('/')

.post(function(req,res){ 
    client.messages.create({
      to: '+14252238606',
      from: process.env.TWILIO_NUMBER,
      body: 'This is a test. Zuchini!'
    }, function(err, message) {
      if (err) return res.status(500).send(err);
      return res.send(message);
    });
});





//Export 
module.exports = router; 









// var config = require('./config');
// var client = require('twilio')(config.accountSid, config.authToken);

// module.exports.sendSms = function(to, message) {
//   client.messages.create({
//     body: 'OMG GET OUT',
//     to: +12063840852,
//     from: config.sendingNumber
//     // mediaUrl: 'http://www.yourserver.com/someimage.png'
//   }, function(err, message) {
//     if (err) {
//       console.error(message.sid);
//     } else {
//       console.log('Excuse sent!');
//     }
//   });
// };