const { model, Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    img: { type: String, required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const TelevisionSchema = new model("zee", UserSchema);

module.exports = TelevisionSchema;
