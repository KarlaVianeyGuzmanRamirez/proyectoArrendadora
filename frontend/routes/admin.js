const express = require('express');
const router = express.Router();

const viewsRoot = {'root' : 'views/admin/'};

/* GET users listing. */
router.

get('/', (req, res, next) => {
	res.sendFile('app.html', viewsRoot);
}).



get('/category-list', (req, res, next) => {
    res.sendFile('category/category-list-view.html', viewsRoot);
}).
get('/category-create', (req, res, next) => {
    res.sendFile('category/category-create-view.html', viewsRoot);
}).
get('/category-update', (req, res, next) => {
    res.sendFile('category/category-update-view.html', viewsRoot);
}).



get('/user-list', (req, res, next) => {
    res.sendFile('user/user-list-view.html', viewsRoot);
}).
get('/user-info', (req, res, next) => {
    res.sendFile('user/user-info-view.html', viewsRoot);
}).
get('/user-create', (req, res, next) => {
    res.sendFile('user/user-create-view.html', viewsRoot);
}).
get('/user-update', (req, res, next) => {
    res.sendFile('user/user-update-view.html', viewsRoot);
}).



get('/book-list', (req, res, next) => {
    res.sendFile('book/book-list-view.html', viewsRoot);
}).
get('/book-info', (req, res, next) => {
    res.sendFile('book/book-info-view.html', viewsRoot);
}).
get('/book-create', (req, res, next) => {
    res.sendFile('book/book-create-view.html', viewsRoot);
}).
get('/book-update', (req, res, next) => {
    res.sendFile('book/book-update-view.html', viewsRoot);
}).
get('/book-copy', (req, res, next) => {
    res.sendFile('book/book-copy-create-view.html', viewsRoot);
}).
get('/book-lend', (req, res, next) => {
    res.sendFile('lending/book-lend-view.html', viewsRoot);
}).

get('/lendings-list', (req, res, next) => {
    res.sendFile('lending/lendings-list-view.html', viewsRoot);
}).

get('/response-dialog-view', (req, res, next) => {
    res.sendFile('response-dialog-view.html', viewsRoot);
}).

get('/delete-dialog-view', (req, res, next) => {
    res.sendFile('delete-dialog-view.html', viewsRoot);
})

.get('/dialog-component', (req, res, next) => {
    res.sendFile('dialog-component.html', viewsRoot);  
});


module.exports = router;