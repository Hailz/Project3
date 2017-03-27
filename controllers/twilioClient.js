require("dotenv").config();
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var client = require('twilio')(accountSid, authToken);

client.messages.create({
  to: '+12063840852',
  from: process.env.TWILIO_NUMBER,
  body: 'whatever the fuck'
}, function(err, message) {
  if(err) {
    console.log(err);
  } else {
    console.log(message.body);
  }
});









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