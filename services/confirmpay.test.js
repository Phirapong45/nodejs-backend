//import
const { confirmpay } = require('./confirmpay');
const Wallet = require('../models/wallet');

//mock database
jest.mock('../models/wallet');

//test
describe('confirmpay', () => {
    let paymentData;

    beforeEach(() => {
        paymentData = {
            transactionId: '12345',
            billPaymentRef1: '5551234567',
            amount: '1000'
        };
    });

    it('should successfully update the wallet balance and return a response', async () => {
        //Mock wallet data
        const mockWallet = { phoneNumber: '5551234567', totalBalance: 5000, save: jest.fn() };
        Wallet.findOne = jest.fn().mockResolvedValue(mockWallet);

        //Call the function
        const response = await confirmpay(paymentData);

        //ผลที่คาดหวัง ส่งการตอบกลับไปยัง SCB
        expect(response).toEqual({
            resCode: "00",
            resDesc: "success",
            transactionId: '12345',
            confirmId: "Optional"
        });
        //ผลที่คาดหวัง เพิ่มเงินใน wallet
        expect(mockWallet.totalBalance).toBe(6000);
        expect(mockWallet.save).toHaveBeenCalled();
    });

    it('should throw an error if wallet is not found', async () => {
        Wallet.findOne = jest.fn().mockResolvedValue(null);

        //ผลที่คาดหวัง
        await expect(confirmpay(paymentData)).rejects.toThrow('Wallet not found');
    });

    it('should handle errors properly', async () => {
        Wallet.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

        //ผลที่คาดหวัง
        await expect(confirmpay(paymentData)).rejects.toThrow('Database error');
    });
});
