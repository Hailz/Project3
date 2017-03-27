var mongoose = require('mongoose');

var FavoritesSchema = new mongoose.Schema({
  userId: Number,
  excuseId: Number
});

module.exports = mongoose.model('Favorites', FavoritesSchema);