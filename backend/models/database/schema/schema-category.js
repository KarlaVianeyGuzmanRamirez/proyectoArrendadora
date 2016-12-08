var mongoose = require('mongoose');

var categorySchema = {
    name: { type: String, required: true },
    description: {type: String, default: "No description."}
    /*,relatedBooks: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref:'Book'
        }]
    */
};

module.exports = new mongoose.Schema(categorySchema);
module.exports.categorySchema = categorySchema;