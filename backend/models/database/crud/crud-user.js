"use strict";

const schema    = require('../schema/schema-user');
const CRUDClass = require('./crud-class');

class UserCRUD extends CRUDClass{
    constructor(){
        super('User', schema);
    }
}
//const UserCRUD  = new CRUD('User', schema);

module.exports = new UserCRUD();