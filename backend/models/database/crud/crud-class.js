"use strict";

const mongoose = require('mongoose');
module.exports = class CRUD {
    
        constructor(modelName, schema) {
            this.model = mongoose.model(modelName, schema);
        }
    
        findAll(callback) {
            this.model.find({}, (error, docs) => {
                callback(error, docs);
            });
        }
        findById(id, callback) {
            this.model.find({ _id: id }, (error, doc) => {
                callback(error, doc);
            });
        }
        insert(doc, callback) {
            new this.model(doc).save(callback);
        }
        update(id, doc, callback) {
            this.model.update({ _id: id }, doc, callback);
        }
        delete(id, callback) {
            this.model.remove({ _id: id }, callback);
        }
    }
