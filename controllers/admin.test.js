// Import
const { admin } = require('../controllers/admin'); // import function ที่จะทดสอบ
const Wallet = require('../models/wallet');

// mock database
jest.mock('../models/wallet', () => ({
    findOne: jest.fn(),
}));

// test
describe('admin top up', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // reset mock function ทุกครั้งก่อน test
    });

    it('should return 404 when phone number not found', async () => {
        const req = { body: { phoneNumber: '1234567890', topupAmount: 500 } }; // mock ข้อมูลผู้ใช้
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Wallet.findOne.mockResolvedValueOnce(null); // mock ไม่พบเบอร์โทร
        await admin(req, res);

        // ผลที่คาดหวัง
        expect(Wallet.findOne).toHaveBeenCalledWith({ phoneNumber: '1234567890' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Phone number not found.' });
    });

    it('should return 400 when topup amount is < 100', async () => {
        const req = { body: { phoneNumber: '1234567890', topupAmount: 99 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Wallet.findOne.mockResolvedValueOnce({ phoneNumber: '1234567890', totalBalance: 500 });
        await admin(req, res);

        // ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Value must be between 100 and 1000.' });
    });

    it('should return 200 when topup amount is equal 100', async () => {
        const req = { body: { phoneNumber: '1234567890', topupAmount: 100 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        Wallet.findOne.mockResolvedValueOnce({ phoneNumber: '1234567890', totalBalance: 500, save: jest.fn().mockResolvedValueOnce() });
        await admin(req, res);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Phone number exists.',
            phoneNumber: '1234567890',
            totalBalance: 600
        })
    });

    it('should return 200 when topup amount is equal 500', async () => {
        const req = { body: { phoneNumber: '1234567890', topupAmount: 500 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Wallet.findOne.mockResolvedValueOnce({
            phoneNumber: '1234567890', totalBalance: 500, save: jest.fn().mockResolvedValueOnce(),
        });
        await admin(req, res);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Phone number exists.',
            phoneNumber: '1234567890',
            totalBalance: 1000
        });
    });

    it('should return 200 when topup amount is equal 1000', async () => {
        const req = { body: { phoneNumber: '1234567890', topupAmount: 1000 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        Wallet.findOne.mockResolvedValueOnce({
            totalBalance: 500,
            save: jest.fn().mockResolvedValueOnce(),
        });
        await admin(req, res);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Phone number exists.',
            phoneNumber: '1234567890',
            totalBalance: 1500,
        });
    });

    it('should return 400 when topup amount is > 1000', async () => {
        const req = { body: { phoneNumber: '1234567890', topupAmount: 1001 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        Wallet.findOne.mockResolvedValueOnce({ totalBalance: 500 });
        await admin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Value must be between 100 and 1000.' });
    });
});