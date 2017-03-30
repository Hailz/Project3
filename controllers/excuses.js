var express = require('express');
var Excuses = require('../models/excuses');
var router = express.Router();

router.route('/')
  .get(function(req, res){
    Excuses.find(function(err, excuses){
      if (err) return res.status(500).send(err);
      return res.send(excuses);
    });
  })

router.route('/:id')
  .get(function(req, res){
    Excuses.findById(req.params.id, function(err, excuse){
      if (err)return res.status(500).send(err);
      return res.send(excuse);
    })
  })
  
module.exports = router;