"use strict";

const schema = require('../schema/schema-lending');
const CRUD = require('./crud-class');

class LendingCRUD extends CRUD{
    constructor() {
        super('Lending', schema);
    }
    find(callback) {
        this.model.find({}).populate({path: 'copy reader', populate: {path: 'book'}}).exec(callback);
    }

    findByReader(_reader, callback){
    	this.model
    	.find({ reader: _reader })
    	.populate({
    		path: 'copy',
    		populate: { path: 'book' }
 		}).exec(callback);
    }

    deleteByCopy(_copy, callback) {
        this.model.remove({copy: _copy}, callback);
    }
}

module.exports = new LendingCRUD();