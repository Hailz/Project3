var mongoose = require('mongoose');

var CommentsSchema = new mongoose.Schema({
  excuseId: Number,
  comment: String,
  userId: Number,
  commentAuthor: String
});

module.exports = mongoose.model('Comments', CommentsSchema);