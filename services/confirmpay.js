//import
const Wallet = require("../models/wallet");

module.exports = {
    confirmpay: async (paymentData) => {
        //ดูที่ SCB ส่งมา
        console.log('Received Payment Confirmation from SCB:', paymentData);

        //ส่งการตอบกลับไปยัง SCB
        try {
            const response = {
                resCode: "00",
                resDesc: "success",
                transactionId: paymentData.transactionId,
                confirmId: "Optional"
            };
            console.log('Merchant response to SCB', response);

            //ดึงค่า billPaymentRef1 สำหรับการเพิ่มเงินใน wallet
            const phoneNumber = paymentData.billPaymentRef1;
            const topupAmount = parseInt(paymentData.amount);

            //ค้นหา wallet ตามหมายเลขโทรศัพท์
            const wallet = await Wallet.findOne({ phoneNumber: phoneNumber });
            if (!wallet) {
                throw new Error('Wallet not found');
            }

            //เพิ่มยอดเงินเข้าไปใน wallet
            wallet.totalBalance += topupAmount;
            await wallet.save();
            console.log("Wallet updated successfully", wallet);

            //ส่งค่าตอบกลับหลังจากทำงานเสร็จ
            return response;

        } catch (error) {
            console.error('Error Payment Confirmation:', error);
            throw error;
        }
    }
};