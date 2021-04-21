const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const webinarSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  replay: { type: String },
});

module.exports = mongoose.model("Webinar", webinarSchema);
