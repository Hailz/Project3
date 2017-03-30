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
  });


// router.get('/:id', function(req, res) {
//   Favorites.findById(req.params.id, function(err, favorite) {
//     if (err) return res.status(500).send(err);

//     return res.send(favorite);
//   });
// });

router.put('/:id', function(req, res){
    Favorites.findByIdAndUpdate(req.params.id, req.body, function(req, res){
      if (err) return res.status(500).send(err);
      return res.send({message: 'Updated favorites!'});
  });
});
router.delete('/:id', function(req, res){
  console.log('router.delete/:id')
  // Favorites.findByIdAndRemove(req.params.id, function(err){
  //   if (err) return res.status(500).send(err);
  //   return res.send({message: 'Favorite Deleted'})
  })
// })

module.exports = router;