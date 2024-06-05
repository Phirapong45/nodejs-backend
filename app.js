//import lib ที่ใช้
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

//import route
const balanceRoutes = require("./routes/balance"); //const balance

//สร้างแอปพลิเคชัน Express และใช้ bodyParser เพื่อแปลงข้อมูล JSON จากคำขอ
const app = express();
app.use(bodyParser.json());

//cors
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// path
app.use("/balance", balanceRoutes);

//middleware ที่จัดการ error
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

//connect MongoDB
mongoose
    .connect(
        "mongodb+srv://phirapongintern:...@cluster0.op88gju.mongodb.net/wallet_db?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then((result) => {
        //console.log("Connected to MongoDB"); เช็คว่าต่อ database หรือยัง
        app.listen(8080);
    })
    .catch((err) => console.log(err));
