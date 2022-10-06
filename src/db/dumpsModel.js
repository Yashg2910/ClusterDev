const mongoose = require("mongoose");

const DumpsSchema = new mongoose.Schema({
  "filename": {
    type: String,
    required: true,
  },
  "dumpDate": {
    type: Date,
    required: true
  },
  "removed": {
    type: Boolean
  }
},
{
  timestamps: true,
  versionKey: false
});

const Dumps = mongoose.model("dumps", DumpsSchema);

module.exports = Dumps;