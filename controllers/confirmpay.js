const confirmpayService = require("../services/confirmpay");

exports.confirmpay = async (req, res) => {
    const {
        payeeProxyId,
        payeeProxyType,
        payeeAccountNumber,
        payerAccountNumber,
        payerName,
        sendingBankCode,
        receivingBankCode,
        amount,
        transactionId,
        transactionDateandTime,
        billPaymentRef1,
        billPaymentRef2,
        billPaymentRef3,
        currencyCode,
        channelCode,
        transactionType
    } = req.body;

    if (!transactionId || !amount) {
        return res.status(400).json({ error: 'Invalid request parameters' });
    }

    const paymentData = {
        payeeProxyId,
        payeeProxyType,
        payeeAccountNumber,
        payerAccountNumber,
        payerName,
        sendingBankCode,
        receivingBankCode,
        amount,
        transactionId,
        transactionDateandTime,
        billPaymentRef1,
        billPaymentRef2,
        billPaymentRef3,
        currencyCode,
        channelCode,
        transactionType
    };

    try {
        const response = await confirmpayService.confirmpay(paymentData);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
