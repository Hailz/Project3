var express = require('express');
var excuses = require('./models/excuses');
var router = express.Router();

router.route('/')
<<<<<<< HEAD
  .get(function(req, res){
    Excuses.find(function(err, excuses){
      if (err) return res.statuss(500).send(err);
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
=======






>>>>>>> 6f186813334973b571c3f4f001b8cdbd68dffa87
