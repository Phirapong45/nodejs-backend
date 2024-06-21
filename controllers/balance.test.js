// Import
const { balance } = require('../controllers/balance');
const Wallet = require('../models/wallet');

// mock database 
jest.mock('../models/wallet');

const mockWalletData = [
    { phoneNumber: '1234567890', totalBalance: 1000 },
    { phoneNumber: '0987654321', totalBalance: 500 }
];

// mock Wallet.findOne
Wallet.findOne = jest.fn(({ phoneNumber }) => {
    return Promise.resolve(mockWalletData.find(wallet => wallet.phoneNumber === phoneNumber) || null);
});

// test
describe('check balance', () => {
    it('return 404 when phone number not found', async () => {
        const req = { query: { phoneNumber: '1111111111' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await balance(req, res, next);

        // ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Phone number not found."
        });
    });

    it('return 200 when phone number exists', async () => {
        const req = { query: { phoneNumber: '1234567890' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await balance(req, res, next);

        // ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Phone number exists.",
            phoneNumber: '1234567890',
            totalBalance: 1000
        });
    });

    it('return 200 when phone number exists 1', async () => {
        const req = { query: { phoneNumber: '0987654321' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await balance(req, res, next);

        // ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Phone number exists.",
            phoneNumber: '0987654321',
            totalBalance: 500
        });
    });

    it('return 400 when phone number have any character', async () => {
        const req = { query: { phoneNumber: '12345abcde' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await balance(req, res, next);

        // ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid phone number format."
        });
    });

    it('return 500 when server error', async () => {
        const req = { query: { phoneNumber: '1234567890' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        // mock ให้เกิดข้อผิดพลาด
        Wallet.findOne.mockImplementationOnce(() => { throw new Error("Database connection failed"); });

        await balance(req, res, next);

        // ผลที่คาดหวัง
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Server Error', statusCode: 500 }));
    });
});
