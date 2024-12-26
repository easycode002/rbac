const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,// 0=Normal User, 1=Admin, 2=Sub-Admin, 3=Editor, 4=
    default:0
  },
});


module.exports = mongoose.model('User',userSchema);