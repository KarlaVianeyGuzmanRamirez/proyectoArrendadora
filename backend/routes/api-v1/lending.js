const express = require('express');
const LendingCRUD = require('../../models/database/db-interface').LendingCRUD;
const router = express.Router();
const multer = require('multer'); // v1.0.5
const upload = multer();
router
//
    .get('/', function (req, res, next) {

        if (req.query.readerId) {
            LendingCRUD.findByReader(req.query.readerId, (error, docs) => {
                if(error){
                    console.log(error);
                    res.status(500).end();
                    return;
                }
                if (docs) {
                    res.status(200).json(docs);
                }
                else {
                    res.status(500).end();
                }
            });
        }
        else {
            LendingCRUD.find(function (error, docs) {
                res.status(200).json(docs);
            });
        }
    })
    //
    .post('/', upload.none(), (req, res) => {
        LendingCRUD.insert(req.body, (error) => {
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
        LendingCRUD.update(req.params.id, req.body, (error, doc) => {
            if (error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.status(200).json(doc);
        });
    })
    //

    .delete('/', (req, res) => {
         if (req.query.copyId) {
            console.log('Parámetro encontrado.');
            LendingCRUD.deleteByCopy(req.query.copyId, (error, docs) => {
                if(error){
                    console.log(error);
                    res.status(500).end();
                    return;
                }
                res.status(200).end();
                return;
            });
        }else{
            console.log('Parámetro no encontrado.');
            res.status(404).end();
        }
    })

    .delete('/:id', (req, res) => {
        LendingCRUD.delete(req.params.id, (error) => {
            if (error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    });
module.exports = router;