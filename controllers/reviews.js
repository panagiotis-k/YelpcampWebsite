const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id).populate("reviews");
    const review = new Review(req.body.review);
    review.author =req.user._id; 
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success","Created a new review!")
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id ,reviewId} = req.params;
    const review = await Review.findByIdAndDelete(reviewId);
    const camp = await Campground.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    req.flash("success","Successfully deleted review!")
    res.redirect(`/campgrounds/${id}`);
}