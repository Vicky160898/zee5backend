const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: {
    type: String,
    enum: ["Admin", "Service Provider", "User"],
    default: "User",
  },
  plan: {
    type: String,
    enum: ["Gold", "Silver", "Bronze", "Free trial"],
    default: "Free trial",
  },
  Amount: { type: Number },
});

const UserModel = model("user", UserSchema);

module.exports = UserModel;
