const mongoose = require("mongoose");

const DevicesSchema = new mongoose.Schema({
  "google_id": {
    type: String,
    required: true,
  },
  "package_name": {
    type: String,
    required: true,
  },
  "package_installed_at": {
    type: Number,
    required: true,
  },
  "client_ip": {
    type: String,
    required: true,
  }
}, {
  versionKey: false
});

const Devices = mongoose.model("devices", DevicesSchema);

module.exports = Devices;