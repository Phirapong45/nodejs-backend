//import
const path = require("path");

//import service
const qrcodeService = require("../services/qrcode");

exports.qrcode = async (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const topupAmount = parseInt(req.body.topupAmount);

    try {
        const wallet = await qrcodeService.qrcodeTopup(phoneNumber, topupAmount);
        return res.status(200).json({
            qrUrl: wallet
        });
    } catch (err) {
        handleError(err, res, next);
    }
};
