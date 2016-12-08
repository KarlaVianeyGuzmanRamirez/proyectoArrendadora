const express = require('express');
const CRUD = require('../../models/database/db-interface').BookCRUD;
const CRUDcopies = require('../../models/database/db-interface').CopyCRUD;
const multer = require('multer');
const fs     = require('fs');

const router = express.Router();
const upload = multer();
var uploading = multer({
    dest: './public/images/covers/'
    , limits: {
        fileSize: 1000000
        , files: 1
    }
, });

/*
function removeImage(bookId){

    CRUD.model
        .findOne( {_id : bookId} )
        .select('cover_photo')
        .exec((error, book) => {
            fs.unlink(book.cover_photo, function(err) {
               if (err) {
                  return console.error(err);
               }
               console.log("File deleted successfully!");
            });
        });
}*/

router
//
    .get('/', function (req, res, next) {
        CRUD.findAll(function (error, docs) {
            if (error) {
                console.log(error);
                return;
            }
            res.status(200).json(docs);
        });
    })
    //
    .get('/:id', function (req, res, next) {
        CRUD.findById(req.params.id, function (error, docs) {
            if (error) {
                console.log(error);
                return;
            }
            res.status(200).json(docs[0]);
        });
    })
    //
    .post('/', uploading.single('cover'), function (req, res) {
        if (req.file) 
            req.body.cover_photo = '/' + req.file.path;
    
        CRUD.insert(req.body, (error) => {
            if (error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    })
    //
    .put('/:id', uploading.single('cover'), (req, res) => {
        if (req.file) 
            req.body.cover_photo = '/' + req.file.path;
        
        CRUD.update(req.params.id, req.body, (error, doc) => {
            if (error) {
                console.log(error);
                res.status(500).end();
                return;
            }

            res.status(200).json(doc);
        });
    })
    //
    .delete('/:id', (req, res) => {
        
        CRUD.delete(req.params.id, (error) => {
            if (error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    })
.get('/:id/copies', function (req, res, next) {
CRUDcopies.findByBook(req.params.id, function (error, docs) {
if (error) {
console.log(error);
return;
}
res.status(200).json(docs);
});
});
module.exports = router;