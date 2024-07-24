//import
const axios = require('axios');
const QRCode = require('qrcode');
const Wallet = require('../models/wallet');
const { qrcodeTopup } = require('./qrcode');

//mock tools
jest.mock('axios');
jest.mock('qrcode');

//mock database
jest.mock('../models/wallet');

//test
describe('qrcodeTopup', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // ล้างการเรียกใช้งาน mock ก่อนแต่ละเทส
    });

    it('should generate QR code and return URL and phone number', async () => {
        const mockPhoneNumber = '1234567890';
        const mockTopupAmount = 100;
        const mockWallet = { phoneNumber: mockPhoneNumber };
        const mockAccessToken = { data: { accessToken: 'mockAccessToken' } };
        const mockQrRawData = 'mockQrRawData';
        const mockQrImageUrl = 'data:image/png;base64,mockImageData';

        // Mock data
        Wallet.findOne.mockResolvedValue(mockWallet);
        axios.post.mockResolvedValueOnce({ data: mockAccessToken });
        axios.post.mockResolvedValueOnce({ data: { data: { qrRawData: mockQrRawData } } });
        QRCode.toDataURL.mockResolvedValue(mockQrImageUrl);

        const result = await qrcodeTopup(mockPhoneNumber, mockTopupAmount);

        //ผลที่คาดหวัง
        expect(Wallet.findOne).toHaveBeenCalledWith({ phoneNumber: mockPhoneNumber });
        expect(axios.post).toHaveBeenCalledWith(process.env.URL_GET_TOKEN, {
            applicationKey: process.env.SCB_API_KEY,
            applicationSecret: process.env.SCB_API_SECRET
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTHORIZATION,
                'requestUId': 'your-request-uid',
                'resourceOwnerId': process.env.SCB_API_KEY
            }
        });
        expect(axios.post).toHaveBeenCalledWith(process.env.URL_CREATE_QR_CODE, {
            qrType: 'PP',
            ppType: 'BILLERID',
            ppId: process.env.Biller_ID,
            amount: mockTopupAmount.toString(),
            ref1: mockPhoneNumber,
            ref2: 'REFERENCE2',
            ref3: 'SCB'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept-language': 'EN',
                'authorization': `Bearer ${mockAccessToken.data.accessToken}`,
                'requestUId': 'your-request-uid',
                'resourceOwnerId': process.env.SCB_API_KEY
            },
            timeout: 20000
        });
        expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrRawData);

        expect(result).toEqual({
            qrImageUrl: mockQrImageUrl,
            phoneNumber: mockPhoneNumber
        });
    });

    it('should throw an error if wallet is not found', async () => {
        const mockPhoneNumber = '1234567890';
        const mockTopupAmount = 100;

        Wallet.findOne.mockResolvedValue(null);

        //ผลที่คาดหวัง
        await expect(qrcodeTopup(mockPhoneNumber, mockTopupAmount))
            .rejects
            .toThrow("Phone number not found.");
    });

    it('should throw an error if getToken fails', async () => {
        const mockPhoneNumber = '1234567890';
        const mockTopupAmount = 100;
        const mockWallet = { phoneNumber: mockPhoneNumber };

        Wallet.findOne.mockResolvedValue(mockWallet);
        axios.post.mockRejectedValueOnce(new Error('Failed to get token'));

        //ผลที่คาดหวัง
        await expect(qrcodeTopup(mockPhoneNumber, mockTopupAmount))
            .rejects
            .toThrow('Failed to get token');
    });

    it('should throw an error if createQRCode fails', async () => {
        const mockPhoneNumber = '1234567890';
        const mockTopupAmount = 100;
        const mockWallet = { phoneNumber: mockPhoneNumber };
        const mockAccessToken = { data: { accessToken: 'mockAccessToken' } };

        Wallet.findOne.mockResolvedValue(mockWallet);
        axios.post.mockResolvedValueOnce({ data: mockAccessToken });
        axios.post.mockRejectedValueOnce(new Error('Failed to create QR code'));

        //ผลที่คาดหวัง
        await expect(qrcodeTopup(mockPhoneNumber, mockTopupAmount))
            .rejects
            .toThrow('Failed to create QR code');
    });

    it('should throw an error if topupAmount is less than 100', async () => {
        const mockPhoneNumber = '1234567890';
        const mockTopupAmount = 99;
        const mockWallet = { phoneNumber: mockPhoneNumber };

        Wallet.findOne.mockResolvedValue(mockWallet);

        //ผลที่คาดหวัง
        await expect(qrcodeTopup(mockPhoneNumber, mockTopupAmount))
            .rejects
            .toThrow("Value must be between 100 and 1000.");
    });

    it('should throw an error if topupAmount is greater than 1000', async () => {
        const mockPhoneNumber = '1234567890';
        const mockTopupAmount = 1001;
        const mockWallet = { phoneNumber: mockPhoneNumber };

        Wallet.findOne.mockResolvedValue(mockWallet);

        //ผลที่คาดหวัง
        await expect(qrcodeTopup(mockPhoneNumber, mockTopupAmount))
            .rejects
            .toThrow("Value must be between 100 and 1000.");
    });

    it('should generate QR code for topupAmount 100', async () => {
        const mockPhoneNumber = '1234567890';
        const mockTopupAmount = 100;
        const mockWallet = { phoneNumber: mockPhoneNumber };
        const mockAccessToken = { data: { accessToken: 'mockAccessToken' } };
        const mockQrRawData = 'mockQrRawData';
        const mockQrImageUrl = 'data:image/png;base64,mockImageData';

        // Mock data
        Wallet.findOne.mockResolvedValue(mockWallet);
        axios.post.mockResolvedValueOnce({ data: mockAccessToken });
        axios.post.mockResolvedValueOnce({ data: { data: { qrRawData: mockQrRawData } } });
        QRCode.toDataURL.mockResolvedValue(mockQrImageUrl);

        const result = await qrcodeTopup(mockPhoneNumber, mockTopupAmount);

        //ผลที่คาดหวัง
        expect(Wallet.findOne).toHaveBeenCalledWith({ phoneNumber: mockPhoneNumber });
        expect(axios.post).toHaveBeenCalledWith(process.env.URL_GET_TOKEN, {
            applicationKey: process.env.SCB_API_KEY,
            applicationSecret: process.env.SCB_API_SECRET
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTHORIZATION,
                'requestUId': 'your-request-uid',
                'resourceOwnerId': process.env.SCB_API_KEY
            }
        });
        expect(axios.post).toHaveBeenCalledWith(process.env.URL_CREATE_QR_CODE, {
            qrType: 'PP',
            ppType: 'BILLERID',
            ppId: process.env.Biller_ID,
            amount: mockTopupAmount.toString(),
            ref1: mockPhoneNumber,
            ref2: 'REFERENCE2',
            ref3: 'SCB'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept-language': 'EN',
                'authorization': `Bearer ${mockAccessToken.data.accessToken}`,
                'requestUId': 'your-request-uid',
                'resourceOwnerId': process.env.SCB_API_KEY
            },
            timeout: 20000
        });
        expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrRawData);

        expect(result).toEqual({
            qrImageUrl: mockQrImageUrl,
            phoneNumber: mockPhoneNumber
        });
    });

    it('should generate QR code for topupAmount 500', async () => {
        const mockPhoneNumber = '1234567890';
        const mockTopupAmount = 500;
        const mockWallet = { phoneNumber: mockPhoneNumber };
        const mockAccessToken = { data: { accessToken: 'mockAccessToken' } };
        const mockQrRawData = 'mockQrRawData';
        const mockQrImageUrl = 'data:image/png;base64,mockImageData';

        // Mock data
        Wallet.findOne.mockResolvedValue(mockWallet);
        axios.post.mockResolvedValueOnce({ data: mockAccessToken });
        axios.post.mockResolvedValueOnce({ data: { data: { qrRawData: mockQrRawData } } });
        QRCode.toDataURL.mockResolvedValue(mockQrImageUrl);

        const result = await qrcodeTopup(mockPhoneNumber, mockTopupAmount);

        //ผลที่คาดหวัง
        expect(Wallet.findOne).toHaveBeenCalledWith({ phoneNumber: mockPhoneNumber });
        expect(axios.post).toHaveBeenCalledWith(process.env.URL_GET_TOKEN, {
            applicationKey: process.env.SCB_API_KEY,
            applicationSecret: process.env.SCB_API_SECRET
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTHORIZATION,
                'requestUId': 'your-request-uid',
                'resourceOwnerId': process.env.SCB_API_KEY
            }
        });
        expect(axios.post).toHaveBeenCalledWith(process.env.URL_CREATE_QR_CODE, {
            qrType: 'PP',
            ppType: 'BILLERID',
            ppId: process.env.Biller_ID,
            amount: mockTopupAmount.toString(),
            ref1: mockPhoneNumber,
            ref2: 'REFERENCE2',
            ref3: 'SCB'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept-language': 'EN',
                'authorization': `Bearer ${mockAccessToken.data.accessToken}`,
                'requestUId': 'your-request-uid',
                'resourceOwnerId': process.env.SCB_API_KEY
            },
            timeout: 20000
        });
        expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrRawData);

        expect(result).toEqual({
            qrImageUrl: mockQrImageUrl,
            phoneNumber: mockPhoneNumber
        });
    });

    it('should generate QR code for topupAmount 1000', async () => {
        const mockPhoneNumber = '1234567890';
        const mockTopupAmount = 1000;
        const mockWallet = { phoneNumber: mockPhoneNumber };
        const mockAccessToken = { data: { accessToken: 'mockAccessToken' } };
        const mockQrRawData = 'mockQrRawData';
        const mockQrImageUrl = 'data:image/png;base64,mockImageData';

        // Mock data
        Wallet.findOne.mockResolvedValue(mockWallet);
        axios.post.mockResolvedValueOnce({ data: mockAccessToken });
        axios.post.mockResolvedValueOnce({ data: { data: { qrRawData: mockQrRawData } } });
        QRCode.toDataURL.mockResolvedValue(mockQrImageUrl);

        const result = await qrcodeTopup(mockPhoneNumber, mockTopupAmount);

        //ผลที่คาดหวัง
        expect(Wallet.findOne).toHaveBeenCalledWith({ phoneNumber: mockPhoneNumber });
        expect(axios.post).toHaveBeenCalledWith(process.env.URL_GET_TOKEN, {
            applicationKey: process.env.SCB_API_KEY,
            applicationSecret: process.env.SCB_API_SECRET
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTHORIZATION,
                'requestUId': 'your-request-uid',
                'resourceOwnerId': process.env.SCB_API_KEY
            }
        });
        expect(axios.post).toHaveBeenCalledWith(process.env.URL_CREATE_QR_CODE, {
            qrType: 'PP',
            ppType: 'BILLERID',
            ppId: process.env.Biller_ID,
            amount: mockTopupAmount.toString(),
            ref1: mockPhoneNumber,
            ref2: 'REFERENCE2',
            ref3: 'SCB'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept-language': 'EN',
                'authorization': `Bearer ${mockAccessToken.data.accessToken}`,
                'requestUId': 'your-request-uid',
                'resourceOwnerId': process.env.SCB_API_KEY
            },
            timeout: 20000
        });
        expect(QRCode.toDataURL).toHaveBeenCalledWith(mockQrRawData);

        expect(result).toEqual({
            qrImageUrl: mockQrImageUrl,
            phoneNumber: mockPhoneNumber
        });
    });
});
