//import lib ที่ใช้
const path = require("path");

//import schema ที่อยู่ใน models
const Wallet = require("../models/wallet");

//Service
exports.balance = async (req, res, next) => {
    const phoneNumber = req.query.phoneNumber;

    if (!/^\d+$/.test(phoneNumber)) {  // ตรวจสอบว่าหมายเลขโทรศัพท์มีเฉพาะตัวเลข
        return res.status(400).json({ message: "Invalid phone number format." });
    }

    try {
        const wallet = await Wallet.findOne({ phoneNumber: phoneNumber });
        if (wallet) {
            const totalBalance = wallet.totalBalance;
            return res.status(200).json({
                message: "Phone number exists.",
                phoneNumber: phoneNumber,
                totalBalance: totalBalance
            });
        } else {
            return res.status(404).json({
                message: "Phone number not found."
            });
        }
    } catch (err) {
        const error = new Error('Server Error');
        error.statusCode = 500;
        next(error);
    }
};
