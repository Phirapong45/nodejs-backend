const axios = require('axios');
const QRCode = require('qrcode');
const Wallet = require("../models/wallet");

const getToken = async () => {
    const url = process.env.URL_GET_TOKEN;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': process.env.AUTHORIZATION,
        'requestUId': 'your-request-uid',
        'resourceOwnerId': process.env.SCB_API_KEY
    };
    const data = {
        applicationKey: process.env.SCB_API_KEY,
        applicationSecret: process.env.SCB_API_SECRET
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log('get access token data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const createQRCode = async (accessToken, topupAmount, phoneNumber) => {
    const url = process.env.URL_CREATE_QR_CODE;
    const headers = {
        'Content-Type': 'application/json',
        'accept-language': 'EN',
        'authorization': `Bearer ${accessToken}`,
        'requestUId': 'your-request-uid',
        'resourceOwnerId': process.env.SCB_API_KEY
    };
    const data = {
        qrType: 'PP',
        ppType: 'BILLERID',
        ppId: process.env.Biller_ID,
        amount: topupAmount.toString(),
        ref1: phoneNumber,
        ref2: 'REFERENCE2',
        ref3: 'SCB'
    };

    try {
        const response = await axios.post(url, data, { headers, timeout: 20000 });
        const qrRawData = response.data.data.qrRawData;
        return qrRawData;
    } catch (error) {
        console.error('Error creating QR code:', error.response ? error.response.data : error.message);
        throw new Error('Failed to create QR code');
    }
};

exports.qrcodeTopup = async (phoneNumber, topupAmount) => {
    try {
        const wallet = await Wallet.findOne({ phoneNumber: phoneNumber });
        if (!wallet) {
            throw new Error("Phone number not found.");
        }

        const accessToken = await getToken();
        const qrRawData = await createQRCode(accessToken.data.accessToken, topupAmount, phoneNumber);

        // Display the URL of the generated QR code
        const qrImageUrl = await QRCode.toDataURL(qrRawData);
        console.log('QR Code URL:', qrImageUrl);
        return {
            qrImageUrl,
            phoneNumber
        };
    } catch (error) {
        console.error('Error in qrcodeTopup function:', error.message);
        throw error;
    }
};
