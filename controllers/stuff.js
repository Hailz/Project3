var express = require('express');
var Notes = require('../models/notes');
var router = express.Router();

router.route('/')
 .get(function(req, res) {
   Notes.find(function(err, notes) {
     if (err) return res.status(500).send(err);

     return res.send(notes);
   });
 })
 .post(function(req, res) {
     Notes.create(req.body, function(err, note) {
       if (err) return res.status(500).send(err);
       return res.send(note);
     });
   });

router.delete('/:id', function(req, res){
 console.log("router.delete/:id")
   Notes.findByIdAndRemove(req.params.id, function(err) {
     if (err) return res.status(500).send(err);
     return res.send({ message: 'success' });
   });
})
router.put('/:id', function(req, res) {
     Notes.findByIdAndUpdate(req.params.id, req.body, function(err) {
       if (err) return res.status(500).send(err);
       return res.send({ message: 'success' });
     });
})

router.route('/:id')
   .get(function(req, res) {
     Notes.findById(req.params.id, function(err, note) {
       if (err) return res.status(500).send(err);
       return res.send(note);
   })
});

   /comments/editComments/{{c._id}}