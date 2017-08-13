// 각종 라우팅을 연결하는 코드
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
