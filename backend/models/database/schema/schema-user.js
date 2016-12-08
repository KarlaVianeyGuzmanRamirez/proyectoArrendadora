var mongoose = require('mongoose');

var userSchema = {
    name: { 
        type: String, 
        required: true 
    }, 
    lastname: {
        type: String,
        required: true
    },
    
    phone: {
        type: String,
        required: true
    },
   
    address: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    profilePhoto: {
        type: String,
        default: '/public/images/profile-photos/default.png'
    },
    
};

module.exports = new mongoose.Schema(userSchema);
module.exports.bookSchema = userSchema;