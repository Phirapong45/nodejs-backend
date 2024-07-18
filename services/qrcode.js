const axios = require('axios');
const QRCode = require('qrcode');
const Wallet = require("../models/wallet");

const getToken = async () => {
    const url = 'https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic bDc5ZWRiMGFhMzc4MDQ0ZWEzODA0YmE3N2MwYWNmYzZhYTozODBmM2E0MThhNTg0ZmE5OTcyMTI0YWM0YTNkZTRjYw==',
        'requestUId': 'your-request-uid',
        'resourceOwnerId': 'l79edb0aa378044ea3804ba77c0acfc6aa'
    };
    const data = {
        applicationKey: 'l79edb0aa378044ea3804ba77c0acfc6aa',
        applicationSecret: '380f3a418a584fa9972124ac4a3de4cc'
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log('data:', response.data)
        return response.data;
    } catch (error) {
        console.error('Error getting token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const createQRCode = async (accessToken, topupAmount) => {
    const url = 'https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create';
    const headers = {
        'Content-Type': 'application/json',
        'accept-language': 'EN',
        'authorization': `Bearer ${accessToken}`,
        'requestUId': 'your-request-uid',
        'resourceOwnerId': 'l79edb0aa378044ea3804ba77c0acfc6aa'
    };
    const data = {
        qrType: 'PP',
        ppType: 'BILLERID',
        ppId: '068384100982686',
        amount: topupAmount.toString(),
        ref1: 'REFERENCE1',
        ref2: 'REFERENCE2',
        ref3: 'SCB'
    };

    try {
        const response = await axios.post(url, data, { headers, timeout: 20000 });
        const qrRawData = response.data.data.qrRawData;
        return qrRawData;
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data);
        } else if (error.request) {
            console.error('No Response:', error.request);
        } else {
            console.error('Error Setting Up Request:', error.message);
        }
        throw error;
    }
};

exports.qrcodeTopup = async (phoneNumber, topupAmount) => {
    try {
        const wallet = await Wallet.findOne({ phoneNumber: phoneNumber }); // ค้นหาเบอร์ในระบบ
        if (!wallet) {
            throw new Error("Phone number not found.");
        }

        const accessToken = await getToken();
        process.env.TOKEN = accessToken.data.accessToken
        const qrRawData = await createQRCode(accessToken.data.accessToken, topupAmount);

        // Display the URL of the generated QR code
        const qrImageUrl = await QRCode.toDataURL(qrRawData);
        console.log('QR Code URL:', qrImageUrl);
        return qrImageUrl;
    } catch (error) {
        console.error('Error in qrcodeTopup function:', error.message);
        throw error;
    }
};
