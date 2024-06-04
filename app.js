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

//connect MongoDB
mongoose
    .connect(
        ""
    )
    .then((result) => {
        //console.log("Connected to MongoDB"); เช็คว่าต่อ database หรือยัง
        app.listen(8080);
    })
    .catch((err) => console.log(err));


//middleware ที่จัดการ error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});
