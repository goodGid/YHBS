
// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//main page 관련
const main_page = require('./main/main_routes');
router.use('/', main_page);

module.exports = router;
