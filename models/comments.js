var mongoose = require('mongoose');

var CommentsSchema = new mongoose.Schema({
  excuseId: mongoose.Schema.Types.ObjectId,
  comment: String,
  userId: String,
  commentAuthor: String
});

module.exports = mongoose.model('Comments', CommentsSchema);

