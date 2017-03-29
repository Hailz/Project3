require("dotenv").config();
var express = require('express');
var router = express.Router(); 
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var User = require('../models/user');
var Excuses = require('../models/excuses');

var client = require('twilio')(accountSid, authToken);

router.route('/')

.post(function(req, res){
  console.log(req.body)
    client.messages.create({
      to: req.body[1],
      from: process.env.TWILIO_NUMBER,
      body: req.body[0]
    }, function(err, message) {
      console.log('message', message);
      if (err) return res.send(500).send(err);
      return res.send(message);
    });
});


//Export 
module.exports = router; 
