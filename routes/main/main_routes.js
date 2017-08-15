/*
 default module
*/
const express = require('express');
const router = express.Router();

// Main
const main = require('./main');
router.use('/', main);

// navigation
const nav = require('./navigation');
router.use('/nav', nav);

// tmp Upload
const upload = require('./upload');
router.use('/upload', upload);


module.exports = router;
