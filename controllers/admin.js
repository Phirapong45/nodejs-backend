//import
const path = require("path");

//import service
const adminService = require("../services/admin");

exports.admin = async (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const topupAmount = parseInt(req.body.topupAmount);

    try {
        const wallet = await adminService.adminTopup(phoneNumber, topupAmount);
        return res.status(200).json({
            message: "Phone number exists.",
            phoneNumber: phoneNumber,
            totalBalance: wallet.totalBalance,
        });
    } catch (err) {
        console.error(err.message);
        if (err.message === "Invalid phone number format.") {
            return res.status(400).json({ message: err.message });
        } else if (err.message === "Value must be between 100 and 1000.") {
            return res.status(404).json({ message: err.message });
        } else if (err.message === "Phone number not found.") {
            return res.status(404).json({ message: err.message });
        } else {
            const error = new Error("Server Error");
            error.statusCode = 500;
            next(error);
        }
    }
};
