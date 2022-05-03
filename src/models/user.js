const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
    id: mongoose.Types.ObjectId,
    refreshToken: { type: String },
    syncToken: {  type: String },
});

const User = mongoose.model("User", user);
module.exports = User;
