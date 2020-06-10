const express           = require("express"),
    router              = express.Router({mergeParams: true}),
    revController       = require("../controller/controller_review"),
    middleware          = require("../middleware/index");

// Create review
router.post("/", middleware.isLoggedIn, middleware.checkReviewExistence, revController.createReview);

// Reviews Update
/* router.put("/", middleware.checkReviewOwnership, (req, res) => {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, (err, updatedReview) => {
        if (err) {
            req.flash("error", "Review Not Found");
            return res.redirect("back");
        }
        TouristSpot.findById(req.params.id).populate("reviews").exec((err, spot) => {
            if (err) {
                req.flash("error", "Tourist Spot not found");
                return res.redirect("back");
            }
            // recalculate campground average
            spot.rating = calculateAverage(spot.reviews);
            //save changes
            spot.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect('/campgrounds/' + spot._id);
        });
    });
}); */



module.exports = router;