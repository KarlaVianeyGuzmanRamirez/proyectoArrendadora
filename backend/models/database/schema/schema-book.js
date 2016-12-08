var mongoose = require('mongoose');

var bookSchema = {
    title: {type: String, required: true},
    description: {type: String},
    cover_photo: {type: String, default: '/public/images/covers/generic-book-cover.jpg'},
    
};

module.exports = new mongoose.Schema(bookSchema);
module.exports.bookSchema = bookSchema;
