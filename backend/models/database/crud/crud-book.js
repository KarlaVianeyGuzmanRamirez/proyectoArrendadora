"use strict";

const schema = require('../schema/schema-book');
const CopyCRUD = require('./crud-copy');
const LendingCRUD = require('./crud-lending');
const CRUDClass = require('./crud-class');

class BookCRUD extends CRUDClass {
    constructor() {
        super('Book', schema);
    }
    findAll(callback) {
        this.model.find({}).populate('categories').exec((error, docs) => {
            callback(error, docs);
        });
    };
    
    findById(bookId, callback){
        this.model.find({_id: bookId}).populate('categories').exec((error, docs) =>{
           callback(error, docs); 
        });
    }

    delete(id, callback) {
        var bookModel = this.model;
        CopyCRUD.model.find({book: id}, (error, docs) => {
            docs.forEach((doc) => {
                CopyCRUD.delete(doc._id);
            });
            bookModel.remove({_id: id}, callback);
        });
    }
}

module.exports = new BookCRUD();
    /*
    const CRUD      = require('./crud-prototype');
    const BookCRUD = new CRUD('Book', schema);

    BookCRUD.find = function (callback) {
        this.Model.find({}).populate('categories').exec( (error, docs) =>{
            callback(error, docs);
        });
    };

    module.exports = BookCRUD;

    */