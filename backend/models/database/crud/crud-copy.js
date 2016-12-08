const schema = require('../schema/schema-copy');
const LendingCRUD = require('./crud-lending');
const CRUD = require('./crud-class');
class CopyCRUD extends CRUD {
    constructor() {
        super('Copy', schema);
    }
    findAll(callback) {
        this.model.find({}).populate('book').exec((error, docs) => {
            callback(error, docs);
        });
    }
    
    findByBook(bookId, callback) {
        this.model.find({book: bookId}, callback);
    }
	
	findByState(state, callback) {
        this.model.find({state: state}, callback);
    }


    findById(id, callback) {
        this.model.find({_id: id}, callback).populate('book');
    }

    delete(id, callback) {
        LendingCRUD.model.remove({copy: id}, (error, docsRemoved) => {
            if(callback){
                this.model.remove({_id: id}, callback);
            }else{
                this.model.remove({_id: id}).exec();
            }
        });
    }


}
module.exports = new CopyCRUD();