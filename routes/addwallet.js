//import lib ที่ใช้
const express = require('express');

//นำเข้าโมดูลที่อยู่ในไฟล์ต่าง ๆ ในโปรเจค
const addwalletController = require('../controllers/addwallet');

const router = express.Router();

//กำหนดเส้นทางไปยัง '/addwallet' method POST
router.post('/', addwalletController.addwallet);

module.exports = router;
