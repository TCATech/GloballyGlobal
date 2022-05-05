const mongoose = require("mongoose");

module.exports = mongoose.model(
  "prefix",
  new mongoose.Schema({
    Prefix: String,
    Guild: String,
  })
);
