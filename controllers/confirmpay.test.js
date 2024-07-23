//import
const { confirmpay } = require('./confirmpay');
const confirmpayService = require('../services/confirmpay');
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

//test
describe('confirmpay', () => {
    it('should return 400 if transactionId or amount is missing', async () => {
        const req = {
            body: {
                payeeProxyId: '123',
                payeeProxyType: 'type',
                payeeAccountNumber: 'accountNumber',
                payerAccountNumber: 'payerNumber',
                payerName: 'payerName',
                sendingBankCode: 'bankCode',
                receivingBankCode: 'recBankCode',
                amount: null, // Missing amount
                transactionId: null, // Missing transactionId
                transactionDateandTime: '2024-07-23T12:00:00',
                billPaymentRef1: 'ref1',
                billPaymentRef2: 'ref2',
                billPaymentRef3: 'ref3',
                currencyCode: 'THB',
                channelCode: 'channelCode',
                transactionType: 'type'
            }
        };
        const res = mockResponse();

        await confirmpay(req, res);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request parameters' });
    });

    it('should call confirmpayService.confirmpay and return 200 on success', async () => {
        const req = {
            body: {
                payeeProxyId: '123',
                payeeProxyType: 'type',
                payeeAccountNumber: 'accountNumber',
                payerAccountNumber: 'payerNumber',
                payerName: 'payerName',
                sendingBankCode: 'bankCode',
                receivingBankCode: 'recBankCode',
                amount: 1000,
                transactionId: 'transId',
                transactionDateandTime: '2024-07-23T12:00:00',
                billPaymentRef1: 'ref1',
                billPaymentRef2: 'ref2',
                billPaymentRef3: 'ref3',
                currencyCode: 'THB',
                channelCode: 'channelCode',
                transactionType: 'type'
            }
        };
        const res = mockResponse();
        const mockResponseFromService = { success: true };
        confirmpayService.confirmpay = jest.fn().mockResolvedValue(mockResponseFromService);

        await confirmpay(req, res);

        //ผลที่คาดหวัง
        expect(confirmpayService.confirmpay).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResponseFromService);
    });

    it('should return 500 on internal server error', async () => {
        const req = {
            body: {
                payeeProxyId: '123',
                payeeProxyType: 'type',
                payeeAccountNumber: 'accountNumber',
                payerAccountNumber: 'payerNumber',
                payerName: 'payerName',
                sendingBankCode: 'bankCode',
                receivingBankCode: 'recBankCode',
                amount: 1000,
                transactionId: 'transId',
                transactionDateandTime: '2024-07-23T12:00:00',
                billPaymentRef1: 'ref1',
                billPaymentRef2: 'ref2',
                billPaymentRef3: 'ref3',
                currencyCode: 'THB',
                channelCode: 'channelCode',
                transactionType: 'type'
            }
        };
        const res = mockResponse();
        confirmpayService.confirmpay = jest.fn().mockRejectedValue(new Error('Internal server error'));

        await confirmpay(req, res);

        //ผลที่คาดหวัง
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
