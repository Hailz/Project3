var express = require('express');
var Favorites = require('../models/favorites');
var router = express.Router();

router.route('/')
  .get(function(req, res){
    Favorites.find(function(err, favorites) {
      if (err) return res.status(500).send(err);

      return res.send(favorites);
    });
  })
  .post(function(req, res) {
    Favorites.create(req.body, function(err, favorite){
      if (err) return res.status(500).send(err);
      return res.send(favorite)
    });
  })
  .delete(function(req, res){
    console.log("HeyOOO " + req.body[0])
  // Favorites.findOneAndRemove({ excuseId: req.body[0] }, function(err){ 
  //   if (err) return res.status(500).send(err);
  //   return res.send({message: 'Favorite Deleted'})
  // })
})

module.exports = router;