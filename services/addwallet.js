//import
const Wallet = require("../models/wallet");

//service
exports.getBalance = async (phoneNumber) => {
    if (!/^\d+$/.test(phoneNumber)) {  //ตรวจสอบว่าหมายเลขโทรศัพท์ว่ามีเฉพาะตัวเลข
        throw new Error("Invalid phone number format.");
    }

    const wallet = await Wallet.findOne({ phoneNumber: phoneNumber }); //ตรวจสอบหมายเลขโทรศัพท์
    if (!wallet) {
        throw new Error("Phone number not found.");
    }

    return wallet.totalBalance;
};
