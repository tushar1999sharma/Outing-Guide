const mongoose   = require("mongoose");

//Comment Schema
let commentSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" //name of model
        },
        username: String,
    },
});

module.exports = mongoose.model("Comment", commentSchema);