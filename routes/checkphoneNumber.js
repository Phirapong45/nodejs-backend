//import lib ที่ใช้
const express = require('express');

//นำเข้าโมดูลที่อยู่ในไฟล์ต่าง ๆ ในโปรเจค
const phoneNumberController = require('../controllers/checkphoneNumber'); // เปลี่ยนเส้นทางไป contrroller

const router = express.Router();

//กำหนดเส้นทางไปยัง '/checkPhoneNumber' method GET 
router.get('/', phoneNumberController.checkPhoneNumber);

module.exports = router;
