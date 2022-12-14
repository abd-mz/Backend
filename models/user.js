const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  login: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
