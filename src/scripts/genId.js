const mongoose = require("mongoose");

console.log({
  youverify: mongoose.Types.ObjectId().toString(),
  organization: mongoose.Types.ObjectId().toString(),
  business: mongoose.Types.ObjectId().toString(),
});
