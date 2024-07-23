//import
const { qrcode } = require('./qrcode');
const qrcodeService = require('../services/qrcode');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
};

const mockRequest = (body) => ({
    body
});

//test
describe('qrcode Controller', () => {
    it('should return a QR code URL on successful topup', async () => {
        const phoneNumber = '1234567890';
        const topupAmount = 100;
        const mockQrUrl = 'data:image/png;base64,mockQrCode';

        //Mock qrcodeService.qrcodeTopup ให้ mock QR URL 
        qrcodeService.qrcodeTopup = jest.fn().mockResolvedValue(mockQrUrl);

        const req = mockRequest({ phoneNumber, topupAmount });
        const res = mockResponse();

        await qrcode(req, res);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ qrUrl: mockQrUrl });
    });

    it('should handle errors', async () => {
        const phoneNumber = '1234567890';
        const topupAmount = 100;
        const mockError = new Error('Topup failed');

        //Mock qrcodeService.qrcodeTopup ให้ throw an error
        qrcodeService.qrcodeTopup = jest.fn().mockRejectedValue(mockError);

        const req = mockRequest({ phoneNumber, topupAmount });
        const res = mockResponse();
        const next = jest.fn();

        await qrcode(req, res, next);

        //ผลที่คาดหวัง Check if handleError was called with the right parameters
        expect(next).toHaveBeenCalledWith(mockError);
    });
});
