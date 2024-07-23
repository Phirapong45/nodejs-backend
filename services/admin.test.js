//Import
const { adminTopup } = require('../services/admin');
const Wallet = require('../models/wallet');

//mock database
jest.mock('../models/wallet');

//test
describe('adminTopup', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('phone number is not found', async () => {
        Wallet.findOne.mockResolvedValue(null);

        //ผลที่คาดหวัง
        await expect(adminTopup('0123456789', 500)) //เรียกฟังก์ชัน adminTopup 
            .rejects.toThrow('Phone number not found.'); // adminTopup หาไม่เจอ และโยนข้อผิดพลาดที่มีข้อความว่า 'Phone number not found.
    });

    it('topupAmount is < 100', async () => {
        Wallet.findOne.mockResolvedValue({ phoneNumber: '0123456789', totalBalance: 500 });

        //ผลที่คาดหวัง
        await expect(adminTopup('0123456789', 99))
            .rejects.toThrow('Value must be between 100 and 1000.');
    });

    it('topup amount is equal 100', async () => {
        const mockWallet = { phoneNumber: '0123456789', totalBalance: 500, save: jest.fn() };
        Wallet.findOne.mockResolvedValue(mockWallet);

        const updatedWallet = await adminTopup('0123456789', 100);

        //ผลที่คาดหวัง
        expect(mockWallet.totalBalance).toBe(600); //ตรวจสอบว่า ได้ 600 ไหม
        expect(mockWallet.save).toHaveBeenCalled(); //ตรวจสอบว่า method save ถูกเรียกใช้งาน
        expect(updatedWallet).toBe(mockWallet); //ตรวจสอบว่า mockWallet ถูกอัพเดตแล้ว
    });

    it('topup amount is equal 500', async () => {
        const mockWallet = { phoneNumber: '0123456789', totalBalance: 500, save: jest.fn() };
        Wallet.findOne.mockResolvedValue(mockWallet);

        const updatedWallet = await adminTopup('0123456789', 500);

        //ผลที่คาดหวัง
        expect(mockWallet.totalBalance).toBe(1000);
        expect(mockWallet.save).toHaveBeenCalled();
        expect(updatedWallet).toBe(mockWallet);
    });

    it('topup amount is equal 1000', async () => {
        const mockWallet = { phoneNumber: '0123456789', totalBalance: 500, save: jest.fn() };
        Wallet.findOne.mockResolvedValue(mockWallet);

        const updatedWallet = await adminTopup('0123456789', 1000);

        //ผลที่คาดหวัง
        expect(mockWallet.totalBalance).toBe(1500);
        expect(mockWallet.save).toHaveBeenCalled();
        expect(updatedWallet).toBe(mockWallet);
    });

    it('topupAmount is > 1000', async () => {
        Wallet.findOne.mockResolvedValue({ phoneNumber: '0123456789', totalBalance: 500 });

        //ผลที่คาดหวัง
        await expect(adminTopup('0123456789', 1001))
            .rejects.toThrow('Value must be between 100 and 1000.');
    });
});
