//import lib ที่ใช้
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const walletSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true
        // unique: true //เงื่อนไขให้ unique //ดูใน mongodb compass มันเป็น unique 
    },
    totalBalance: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Wallet', walletSchema);
