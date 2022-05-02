const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
    refreshToken: { type: String },
    syncToken: {  type: String },
});

const User = mongoose.model("Feedback", user);
module.exports = User;
