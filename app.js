// Import libraries ที่ใช้
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

// Import route
// const homeRoutes = require("./routes/home");
const balanceRoutes = require("./routes/balance");
const adminRoutes = require("./routes/admin");

// สร้างแอปพลิเคชัน Express และใช้ bodyParser เพื่อแปลงข้อมูล JSON จากคำขอ
const app = express();
app.use(bodyParser.json());

// ตั้งค่า CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// path
app.use("/balance", balanceRoutes);
app.use("/admin", adminRoutes);

// Middleware ที่จัดการ error
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

// เชื่อมต่อ MongoDB
mongoose
    .connect(
        "mongodb+srv://phirapongintern:phirapong99@cluster0.op88gju.mongodb.net/wallet_db?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then((result) => {
        // เช็คว่าต่อ database หรือยัง
        app.listen(8080, () => {
            console.log("Server is running on port 8080");
        });
    })
    .catch((err) => console.log(err));
