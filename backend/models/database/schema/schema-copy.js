var mongoose = require('mongoose');
var languages = 'Rojo Blanco Plata Dorado Gris Negro Azul Verde Amarillo Naranja'.split(' ');
var states = 'Disponible'.split(' ');

var copySchema = {
    pages: { type: String},
        
    edition: {
        type: String,
          required: true
        },
   language: {
        type: String,
          enum: languages,
          required: true
    },
    cover_photo2: {type: String, default: '/public/images/autos/default.jpg'},
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Book'
    }
};

module.exports = new mongoose.Schema(copySchema);
module.exports.copySchema = copySchema;
