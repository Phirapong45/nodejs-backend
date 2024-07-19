const axios = require('axios');
const Wallet = require("../models/wallet");

module.exports = {
    confirmpay: async (paymentData) => {
        // ประมวลผลข้อมูลที่ได้รับ เช่น บันทึกลงฐานข้อมูล
        console.log('Received Payment Confirmation:', paymentData);

        // ส่งการตอบกลับไปยัง SCB
        const response = {
            resCode: "00",
            resDesc: "success",
            transactionId: paymentData.transactionId,
            confirmId: "Optional"
        };

        // ดึง slip verify โดยใช้ transactionId และ sendingBankCode
        try {
            // Get access token from qrcode.js
            const slipVerifyResponse = await axios.get(`https://api-sandbox.partners.scb/partners/sandbox/v1/payment/billpayment/transactions/${paymentData.transactionId}?sendingBank=${paymentData.sendingBankCode}`, {
                headers: {
                    'accept-language': 'EN',
                    'authorization': `Bearer ${process.env.TOKEN}`,
                    'requestUID': 'your-request-uid',
                    'resourceOwnerID': 'l79edb0aa378044ea3804ba77c0acfc6aa'
                }
            });

            console.log('Slip Verify Response:', slipVerifyResponse.data);
            // console.log('amount:', process.env.AMOUNT);

            // นำข้อมูลจาก slip verify มาใส่ใน response
            response.slipVerify = slipVerifyResponse.data;

            const phoneNumber = process.env.PHONE
            const topupAmount = parseInt(process.env.AMOUNT);

            const wallet = await Wallet.findOne({ phoneNumber: phoneNumber });
            wallet.totalBalance += topupAmount;  //เพิ่มเงินเข้าไปใน wallet
            await wallet.save();
            console.log('success', wallet)
            return wallet;

        } catch(error) {
        console.error('Error fetching slip verify:', error);
        response.resCode = "99";
        response.resDesc = "error";
    }

        return {
            status: 200,
            message: 'Top up successful',
            wallet: wallet
        };
}
};
