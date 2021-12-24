const { Schema, model } = require('mongoose');

const schema = new Schema({
   title: String,
   author: String, 
});

module.exports = model('Post', schema);
