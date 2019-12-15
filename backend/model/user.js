const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  empId: {type: Number, required: true, unique: true},
  name: { type: String, required: true },
  password: { type: String, required: true },
  angel: {type: String},
  santa: {type: String}
  /*angel: {type: String , unique: true},
  santa: {type: String , unique: true}*/
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
