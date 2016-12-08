const express = require('express');
const CopyCRUD = require('../../models/database/db-interface').CopyCRUD;
const router = express.Router();
const multer = require('multer'); // v1.0.5


const upload = multer();
var uploading = multer({
    dest: './public/images/autos/'
    , limits: {
        fileSize: 1000000
        , files: 1
    }
, });

router
//

    .get('/', function (req, res, next) {
        if (req.query.bookId) {
            CopyCRUD.findByBook(req.query.bookId, (error, docs) => {
                if(error){
                    console.log(error.errors);
                    res.status(500).end();
                    return;
                }
                res.status(200).json(docs);
                
            });
        }
        else {
			 if (req.query.state) {
            CopyCRUD.findByState(req.query.state, (error, docs) => {
                if(error){
                    console.log(error.errors);
                    res.status(500).end();
                    return;
                }
                res.status(200).json(docs);
                
            });
        }else 
		
		{
			CopyCRUD.findAll(function (error, docs) {
                if(error){
                    console.log(error);
                    res.status(500).end();
                    return;
                }
                res.status(200).json(docs);
            });
		}
        }
    })
    //
    .get('/:id', function (req, res, next) {
        CopyCRUD.findById(req.params.id, function (error, docs) {
            if (error) {
                console.log(error);
                res.status(404).end();
                return;
            }
            res.status(200).json(docs[0]);
        });
    })
    //

    .post('/', uploading.single('cover2'), function (req, res) {
        if (req.file) 
            req.body.cover_photo2 = '/' + req.file.path;
    
        CopyCRUD.insert(req.body, (error) => {
            if (error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    })
    
    //

    .put('/:id', upload.none(), (req, res) => {
        console.log("Id of the object to update: " + req.params.id);
        CopyCRUD.update(req.params.id, req.body, (error, doc) => {
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
        CopyCRUD.delete(req.params.id, (error) => {
            if (error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    });
module.exports = router;