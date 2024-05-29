//import lib ที่ใช้
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//import route
const checkphoneNumberRoutes = require("./routes/checkphoneNumber");

//สร้างแอปพลิเคชัน Express และใช้ bodyParser เพื่อแปลงข้อมูล JSON จากคำขอ
const app = express();
app.use(bodyParser.json());

// path
app.use("/balance", checkphoneNumberRoutes);

//connect MongoDB
mongoose
    .connect(
        "mongodb+srv://"
    )
    .then((result) => {
        //console.log("Connected to MongoDB"); เช็คว่าต่อ database หรือยัง
        app.listen(8080);
    })
    .catch((err) => console.log(err));

app.js
