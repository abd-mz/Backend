const mongoose = require("mongoose");
const filmSchema = mongoose.Schema({
  title: { type: String, required: true },
  type: { type: Array, required: true },
  picture: { type: String, required: true },
  actors: { type: Array, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Film", filmSchema);
