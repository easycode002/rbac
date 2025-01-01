const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  permission_name: {
    type: String,
    required: true,
  },
  is_default: {
    type: Number,
    default: 1, //0=not default, 1=default
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
