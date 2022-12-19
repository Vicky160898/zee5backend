require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const emailRouter = express.Router();
const otpGenerator = require("otp-generator");
const UserModel = require("../models/users/UserSchema");
const send_mail = require("./email");
const argon2 = require("argon2");

let blacklist = [];

// const middleware = emailRouter.use(async (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) {
//     return res.status(401).send("Token expired");
//   }
//   if (blacklist.includes(token)) {
//     return res.send(401).send("Token expired");
//   }
//   try {
//     const verification = await jwt.verify(token, process.env.SECRET_KEY);
//     if (verification) {
//       console.log(verification);
//       req.userId = verification.id;
//       req.userRole = verification.role;
//       next();
//     } else {
//       res.send("Authentications failed");
//     }
//   } catch (e) {
//     res.send(e.message);
//   }
// });

emailRouter.post("/signup", async (req, res) => {
  const { name, email, password, role, plan } = req.body;
  //console.log(req.body);
  const hash = await argon2.hash(password);
  const users = new UserModel({
    name,
    email,
    password: hash,
    role,
    plan,
  });
  await users.save();
  //res.status(201).send(users);
  const token = jwt.sign(
    {
      email: email,
      name: name,
      plan: plan,
      role: role,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "28 days",
    }
  );
  console.log(token);
  res.status(201).send({message:"login successfully", token:token})

  // const refreshtoken = jwt.sign( process.env.REFRESH_KEY, {
  //   expiresIn: "28 days",
  // });

  // res.status(201).send({
  //   message: "login successfully",
  //   token: token,
  //   refresh: refreshtoken,
  // });

 //res.status(401).send("INVALID CREDENTIALS");
});

//login route

emailRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // const otp = otpGenerator.generate(6, {
  //   upperCaseAlphabets: false,
  //   specialChars: false,
  //   lowerCaseAlphabets: false,
  // });
  const user = await UserModel.findOne({ email:email });
  console.log(user)
  try {
    if (await argon2.verify(user.password, password)) {
      //   const token = jwt.sign(
      //     {
      //       id: user._id,
      //       email: user.email,
      //       name: user.name,
      //       plan: user.age,
      //       role: user.role,
      //     },
      //     process.env.SECRET_KEY,
      //     {
      //       expiresIn: "7 days",
      //     }
      //   );
      console.log("login successful");
       return res.status(201).send({message:"login successful", email:email })
      //   const refreshtoken = jwt.sign({ id: user._id }, process.env.REFRESH_KEY, {
      //     expiresIn: "28 days",
      //   });

      //   return res.status(201).send({
      //     message: "login successfully",
      //     token: token,
      //     refresh: refreshtoken,
      //   });
    } else {
      res.status(401).send("INVALID CREDENTIALS");
    }
  } catch (e) {
    res.status(401).send("INVALID CREDENTIALS");
  }
});

emailRouter.get("/", async (req, res) => {
  const user = await UserModel.find();
  res.send(user);
});

emailRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.deleteOne({ _id: id });
    res.send(`User deleted`);
  } catch {
    res.status(500).send("User not found");
  }
});

emailRouter.patch("/update", async (req, res) => {
  const { email, role } = req.body;
  try {
    const data = await UserModel.findOne({ email });
    if (!data) {
      return res.status(401).send("Data not found");
    } else {
      await UserModel.updateOne({ email: email }, { $set: { role: role } });
      return res.status(201).send("Data updated successfully");
    }
  } catch (e) {
    res.status(403).send("error");
  }
});

// patch request for premium...

emailRouter.patch("/set", async (req, res) => {
  const { email, plan } = req.body;
  try {
    const data = await UserModel.findOne({ email });
    if (!data) {
      return res.status(401).send("Data not found");
    } else {
      await UserModel.updateOne({ email: email }, { $set: { plan: plan } });
      return res.status(201).send("Data updated successfully");
    }
  } catch (e) {
    res.status(403).send("error");
  }
});

module.exports = emailRouter;
