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

router.put('/:id', function(req, res){
  Excuses.findByIdAndUpdate(req.params.id, req.body, function(err){
    if (err) return res.status(500).send(err);
    return res.send({message: 'success'});
  });
})


module.exports = router;