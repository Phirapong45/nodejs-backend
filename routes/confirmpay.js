//import lib ที่ใช้
const express = require('express');

//นำเข้าโมดูลที่อยู่ในไฟล์ต่าง ๆ ในโปรเจค
const confirmpayController = require('../controllers/confirmpay');

const router = express.Router();

//กำหนดเส้นทางไปยัง '/confirmpay' method POST
router.post('/', confirmpayController.confirmpay);

module.exports = router;
