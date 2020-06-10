const mongoose   = require("mongoose");

//TouristSpot Schema
let spotSchema = new mongoose.Schema({
    name: String,

    image: String,

    imageId: String,

    city: String,
    
    description: String,

    createdAt: { type: Date, default: Date.now },

    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment" //name of model
        }
    ],

    author: 
    {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" //name of model
        },
        username: String
    }
});

module.exports = mongoose.model("TouristSpot",spotSchema);