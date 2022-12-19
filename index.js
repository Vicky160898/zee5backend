require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const connect = require("./config/db");
const GETREQUEST = require("./controller/GetRoute");
const POSTREQUEST = require("./controller/PostRoute");
const UserModel = require("./controller/emailRoute");
const payment = require("./controller/payment");
const PORT = process.env.PORT;

const app = express();
app.use(express.urlencoded({ extended: true }));
mongoose.set('strictQuery', false)
app.use(express.json());
app.use(cors());

 app.use("/admin", GETREQUEST);
 app.use("/admin", POSTREQUEST);
 app.use("/user", UserModel)
 app.post("/orders" , payment.orders)
app.post("/verify" , payment.verify)

app.listen(PORT, async (req, res) => {
  await connect();
  console.log("server started on 8080");
});
