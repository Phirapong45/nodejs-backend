//import lib ที่ใช้
const path = require("path");

//import schema ที่อยู่ใน models
const Wallet = require("../models/wallet");

//Service
exports.checkPhoneNumber = async (req, res) => {
    const phoneNumber = req.query.phoneNumber;
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
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        return res.status(err.statusCode).json({ message: err.message });
    }
};
