// Import libraries
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const http = require('http');
const server = http.createServer();

//ใช้ dotenv ทำ environment variables
require("dotenv").config({ path: ".env" });

//import environment variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbOptions = process.env.DB_OPTIONS;
const frontendLink = process.env.FR_LINK;

//Import route
const balanceRoutes = require("./routes/balance");
const adminRoutes = require("./routes/admin");
const healthRoutes = require("./routes/health");
const qrcodeRoutes = require("./routes/qrcode");
const confirmpayRoutes = require('./routes/confirmpay');
const addwalletRoutes = require('./routes/addwallet');

//สร้างแอปพลิเคชัน Express และใช้ bodyParser เพื่อแปลงข้อมูล JSON จากคำขอ
const app = express();
app.use(bodyParser.json());

//ตั้งค่า CORS
const corsOptions = {
    // origin: frontendLink,
    origin: 'http://localhost:3000',
    credentials: true
};
app.use(cors(corsOptions));

//path
app.use("/balance", balanceRoutes);
app.use("/admin", adminRoutes);
app.use("/health", healthRoutes);
app.use("/qrcode", qrcodeRoutes);
app.use("/confirmpay", confirmpayRoutes);
app.use("/addwallet", addwalletRoutes);

//Middleware ที่จัดการ error
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

//เชื่อมต่อ MongoDB
const mongoUri = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?${dbOptions}`;

//เชื่อมต่อ MongoDB
mongoose
    .connect(mongoUri)
    .then((result) => {
        // เช็คว่าต่อ database หรือยัง
        console.log('Connected to MongoDB');
        // เปิด server ที่ port 8080
        app.listen(8080, () => {
            console.log("Server is running on port 8080");
        });
    })
    .catch((err) => console.log(err));
