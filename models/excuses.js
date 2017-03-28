var mongoose = require('mongoose');

var ExcusesSchema = new mongoose.Schema({
  excuse: String,
  excuseMsg: String,
  rating: Number
});

module.exports = mongoose.model('Excuses', ExcusesSchema);