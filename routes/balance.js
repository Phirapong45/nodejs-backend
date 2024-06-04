//import lib ที่ใช้
const express = require('express');

//นำเข้าโมดูลที่อยู่ในไฟล์ต่าง ๆ ในโปรเจค
const balanceController = require('../controllers/balance'); // เปลี่ยนเส้นทางไป contrroller

const router = express.Router();

//กำหนดเส้นทางไปยัง '/balance' method GET 
router.get('/', balanceController.balance);

module.exports = router;
