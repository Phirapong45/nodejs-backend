//import
const path = require("path");

//import service
const balanceService = require("../services/balance");

exports.balance = async (req, res, next) => {
    const phoneNumber = req.query.phoneNumber;

    try {
        const totalBalance = await balanceService.getBalance(phoneNumber);
        return res.status(200).json({
            message: "Phone number exists.",
            phoneNumber: phoneNumber,
            totalBalance: totalBalance,
        });
    } catch (err) {
        if (err.message === "Invalid phone number format.") {
            return res.status(400).json({ message: err.message });
        } else if (err.message === "Phone number not found.") {
            return res.status(404).json({ message: err.message });
        } else {
            const error = new Error("Server Error");
            error.statusCode = 500;
            next(error);
        }
    }
};
