require("dotenv").config();

const express = require("express");
const {constants: http} = require("http2");
const morgan = require("morgan");

const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.use(morgan("dev"));
app.use("/", express.static("uploads"));

app.use("/", require("./src/routers"));

app.use("/*splate", (req, res)=>{
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Not found"
    });
});

const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Listening on PORT ${PORT}`);
});