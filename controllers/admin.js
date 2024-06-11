// Import lib ที่ใช้
const Wallet = require("../models/wallet");

// Service
exports.admin = async (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const topupAmount = parseInt(req.body.topupAmount); //parseInt ใช้ในการแปลงค่าสตริงให้เป็นตัวเลข
    if (topupAmount < 100 || topupAmount > 1000) { //กำหนดช่วงระหว่าง 100-1000
        return res.status(400).json({
            message: "Value must be between 100 and 1000."
        });
    }

    try {
        const wallet = await Wallet.findOne({ phoneNumber: phoneNumber });
        if (wallet) {
            wallet.totalBalance += topupAmount;
            await wallet.save();

            return res.status(200).json({
                message: "Phone number exists.",
                phoneNumber: phoneNumber,
                totalBalance: wallet.totalBalance
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
