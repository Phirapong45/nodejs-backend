//import
const Wallet = require("../models/wallet");

exports.adminTopup = async (phoneNumber, topupAmount) => {

    const wallet = await Wallet.findOne({ phoneNumber: phoneNumber });  //ค้นหาเบอร์ในระบบ
    if (!wallet) {
        throw new Error("Phone number not found.");
    }

    if (topupAmount < 100 || topupAmount > 1000) {  //ตรวจสอบว่ายอดเงินอยู่ในช่วง 100-1000
        throw new Error("Value must be between 100 and 1000.");
    }

    wallet.totalBalance += topupAmount;  //เพิ่มเงินเข้าไปใน wallet
    await wallet.save();

    return wallet;
};
