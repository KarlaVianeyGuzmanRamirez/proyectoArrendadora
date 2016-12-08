const express = require('express');
const CategoryCRUD = require('../../models/database/db-interface').CategoryCRUD;
const router = express.Router();
const multer = require('multer'); // v1.0.5
const upload = multer();
router
//
    .get('/', function (req, res, next) {
        CategoryCRUD.findAll(function (error, docs) {
            res.status(200).json(docs);
        });
    })

    .get('/:id', function (req, res, next) {

        CategoryCRUD.findById(req.params.id, function (error, docs) {
            if (error) {
                console.log(error);
                return;
            }
            res.status(200).json(docs[0]);
        });
    })
    //
    .post('/', upload.none(), (req, res) => {
        CategoryCRUD.insert(req.body, (error) => {
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
        CategoryCRUD.update(req.params.id, req.body, (error, doc) => {
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
        CategoryCRUD.delete(req.params.id, (error) => {
            if (error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    });
module.exports = router;