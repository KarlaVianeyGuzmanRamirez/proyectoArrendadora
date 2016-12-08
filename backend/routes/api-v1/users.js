const express = require('express');
const UserCRUD = require('../../models/database/db-interface').UserCRUD;
const router = express.Router();
const multer = require('multer'); // v1.0.5
const upload = multer();
const uploadProfilePhoto = multer({
    dest: './public/images/profile-photos/'
    , limits: {
        fileSize: 1000000
        , files: 1
    }
, });
router
//
    .get('/', function (req, res, next) {
        UserCRUD.findAll(function (error, docs) {
            res.status(200).json(docs);
        });
    })
    //
    .get('/:id', function (req, res, next) {
        UserCRUD.findById(req.params.id, function (error, docs) {
            if (error) {
                console.log(error);
                return;
            }
            res.status(200).json(docs[0]);
        });
    })
    //
    .post('/', uploadProfilePhoto.single('profile-photo'), function (req, res) {
        if (req.file) 
            req.body.profilePhoto = '/' + req.file.path;
        
        console.log(req.body);
        UserCRUD.insert(req.body, (error) => {
            if (error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    })
    //
    .put('/:id', uploadProfilePhoto.single('profile-photo'), (req, res) => {
        console.log("Id of the object to update: " + req.params.id);
        if (req.file) 
            req.body.profilePhoto = '/' + req.file.path;

        UserCRUD.update(req.params.id, req.body, (error, doc) => {
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
        UserCRUD.delete(req.params.id, (error) => {
            if (error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.status(200).end();
        });
    });
module.exports = router;