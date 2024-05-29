//import lib ที่ใช้
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const walletSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    totalBalance: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Wallet', walletSchema);
