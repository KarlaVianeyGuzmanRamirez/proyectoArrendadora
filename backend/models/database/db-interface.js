var mongoose        = require('mongoose');

/*var copySchema      = require('./schema-copy');
var userSchema      = require('./schema-user');
var lendingSchema      = require('./schema-lending');
*/

mongoose.connect('mongodb://127.0.0.1:27017/library');

exports.initDB = function(){
    //Removing all documents in the collections
    Book.remove({},function(error){
        if(error)
            console.log('Error erasing the book documents');
        books.books.forEach(function(b,error){
            new Book(b).save(function(error){
                if(error)
                    console.log('Error inserting a book document');
            });
        });
    
    });
    Category.remove({},function(error){
        if(error)
            console.log('Error erasing the category documents');
        //Inserting the documents in the JSON files
        categories.categories.forEach(function(c,error){
            new Category(c).save(function(error){
                if(error)
                console.log('Error inserting a category document');
            });
        });
    });
    
    console.log('Database initialized');
};

module.exports.CategoryCRUD = require('./crud/crud-category');
module.exports.BookCRUD     = require('./crud/crud-book');
module.exports.CopyCRUD     = require('./crud/crud-copy');
module.exports.UserCRUD     = require('./crud/crud-user');
module.exports.LendingCRUD  = require('./crud/crud-lending');