

const schema = require('../schema/schema-category');
const CRUD = require('./crud-class');
class CategoryCRUD extends CRUD {
    constructor() {
        super('Category', schema);
    }
    findAll(callback) {
        this.model.find().sort({name: 'ascending'}).exec((error, docs) => {
            callback(error, docs);
        });
    }
}
module.exports = new CategoryCRUD();