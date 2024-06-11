//import lib ที่ใช้
const express = require('express');

// //นำเข้าโมดูลที่อยู่ในไฟล์ต่าง ๆ ในโปรเจค
const adminController = require('../controllers/admin');

const router = express.Router();

//กำหนดเส้นทางไปยัง '/admin' method PATCH
router.patch('/', adminController.admin);

module.exports = router;
