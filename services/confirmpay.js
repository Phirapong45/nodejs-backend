const axios = require('axios');
const qrcode = require('../services/qrcode'); 

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
            const accessTokenData = await qrcode.getToken(); // Get access token from qrcode.js
            const accessToken = accessTokenData.accessToken;

            const slipVerifyResponse = await axios.get(`https://api-sandbox.partners.scb/partners/sandbox/v1/payment/billpayment/transactions/${paymentData.transactionId}?sendingBank=${paymentData.sendingBankCode}`, {
                headers: {
                    'accept-language': 'EN',
                    'authorization': `Bearer ${accessToken}`,
                    'requestUID': 'your-request-uid',
                    'resourceOwnerID': 'l79edb0aa378044ea3804ba77c0acfc6aa'
                }
            });

            console.log('Slip Verify Response:', slipVerifyResponse.data);

            // นำข้อมูลจาก slip verify มาใส่ใน response
            response.slipVerify = slipVerifyResponse.data;

        } catch (error) {
            console.error('Error fetching slip verify:', error);
            response.resCode = "99";
            response.resDesc = "error";
        }

        return response;
    }
};
