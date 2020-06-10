const TouristSpot           = require("../models/model_touristSpot"),
    Review                  = require("../models/model_review");

module.exports = {
    createReview: async (req, res) => {
        try{
            let spot = await TouristSpot.findById(req.params.id).populate("reviews").exec();
            try {
                let review = await Review.create(req.body.review);
                //add author username/id and associated spot to the review
                review.author.id = req.user._id;
                review.author.username = req.user.username;
                review.TouristSpot = spot;
                //save review
                review.save();
                spot.reviews.push(review);
                // calculate the new average review for the campground
                spot.rating = calculateAverage(spot.reviews);
                //save spot
                spot.save();
                req.flash("success", "Your review has been successfully added.");
                res.redirect('/spots/' + spot._id);
            } 
            catch (err) {
                req.flash("error", "Something went wrong");
                return res.redirect("back");
            }
        }
        catch (err) {
            req.flash("error", "Tourist Spot not found");
            return res.redirect("back");
        }
    }
}

function calculateAverage(reviews) {
    //calculate average rating
    if (reviews.length === 0) {
        return 0;
    }
    let sum = 0;
    reviews.forEach((element) => {
        sum += element.rating;
    });
    let res = sum / reviews.length;
    res = res.toPrecision(2); //for upto 2 decimal
    return res;
}