//import lib ที่ใช้
const express = require('express');

const router = express.Router();

//กำหนดเส้นทางไปยัง '/balance' method GET 
router.get('/', async (req, res, next) => {
    res.json({ status: "success" });
});

module.exports = router;
