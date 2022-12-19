const express = require("express");
const app = express.Router();
const TelevisionSchema = require("../models/Admin/userSchema");

app.post("/add", async (req, res) => {
  const { title, url, category, img } = req.body;

  const data = await TelevisionSchema.findOne({ url });
  try {
    if (!data) {
      const newData = new TelevisionSchema({
        title,
        url,
        category,
        img,
      });
      await newData.save();
      return res.status(200).send(newData);
    } else {
      return res.send("data already present");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//delete Route

app.delete("/delete", async (req, res) => {
  const { title } = req.query;
  console.log(title)
  try {
    await TelevisionSchema.deleteOne({ title: title });
    res.send(`Data deleted`);
  } catch {
    res.status(500).send("Data not found");
  }
});

//patch request here

app.patch("/update", async (req, res) => {
  const { title, url } = req.body;
  try {
    const data = await TelevisionSchema.findOne({ title });
    if (!data) {
      return res.status(401).send("Data not found");
    } else {
       await TelevisionSchema.updateOne(
        { title: title },
        { $set: { url: url } }
      );
      return res.status(201).send("Data updated successfully");
    }
  } catch (e) {
    res.status(403).send("error");
  }
});

module.exports = app;
