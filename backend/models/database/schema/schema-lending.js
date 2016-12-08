var mongoose = require('mongoose');

var lendingSchema = {
    copy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Copy', 
        required: true 
    }, 
    reader: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    lentAt: {
    type: Date,
        required: true,
        default: Date.now
    },
    returnAt: {
        type: Date,
        required: true,
        default: Date.now
    }
};

module.exports = new mongoose.Schema(lendingSchema);
module.exports.bookSchema = lendingSchema;
