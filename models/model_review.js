const mongoose   = require("mongoose");

//Reviw Schema
let reviewSchema = new mongoose.Schema({
    rating: {
        // Setting the field type
        type: Number,
        // Making the star rating required
        required: "Please provide a rating (1-5 stars).",
        // Defining min and max values
        min: 1,
        max: 5,
        // Adding validation to see if the entry is an integer
        validate: {
            // validator accepts a function definition which it uses for validation
            validator: Number.isFinite,
            message: "{VALUE} is not an integer value."
        }
    },
    // author id and username fields
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    // Tourist Spot associated with the review
    TouristSpot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TouristSpot"
    }
});

module.exports = mongoose.model("Review", reviewSchema);