var express = require('express');
var Comments = require('../models/comments');
var router = express.Router();

router.route('/')
	.get(function(req, res){
		Comments.find(function(err, comments){
		 if (err) return res.status(500).send(err);
		 return res.send(comments);
		});
	})
	.post(function(req, res){
		console.log(req.body);
		Comments.create(req.body, function(err, comment){
		if (err) return res.status(500).send(err);
		return res.send(comment);
		});
	})

router.route('/:id')
	.delete(function(req, res){
		Comments.findByIdAndRemove(req.params.id, req.body, function(err, comments){
		if (err) return res.status(500).send(err);
		return res.send({ message: 'success'})
		});
	})
	.put(function(req, res){
		Comments.findByIdAndUpdate(req.params.id, req.body, function(err, comments){
		if (err) return res.status(500).send(err);
		return res.send({message: 'success'});
		});
	})

module.exports = router;






