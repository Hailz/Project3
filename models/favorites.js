var mongoose = require('mongoose');

var FavoritesSchema = new mongoose.Schema({
  userId: String,
  excuseId: String
});

module.exports = mongoose.model('Favorites', FavoritesSchema);