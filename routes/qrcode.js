//import lib ที่ใช้
const express = require('express');

//นำเข้าโมดูลที่อยู่ในไฟล์ต่าง ๆ ในโปรเจค
const qrcodeController = require('../controllers/qrcode'); // เปลี่ยนเส้นทางไป contrroller

const router = express.Router();

//กำหนดเส้นทางไปยัง '/qrcode' method POST
router.post('/', qrcodeController.qrcode);

module.exports = router;
