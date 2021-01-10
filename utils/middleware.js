const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("./ExpressError");

//import JOI schemas for validation
const {reviewSchema,campgroundSchema} = require("../schemas");


module.exports.isLoggedIn = (req,res,next)=>{
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next()
}

//campground validations
module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(elm => elm.message).join();
        throw new ExpressError(msg,400);
    }
    else
    {
        next();
    }
}


module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params;
    const camp = await  Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash("error","You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`);
    }

        next();
    
}


//review validations
module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(elm => elm.message).join();
        throw new ExpressError(msg,400);
    }
    else
    {
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    // const camp = await Campground.findById(id);
    if(!review.author.equals(req.user._id)){
        req.flash("error","You have not permission to do that!")
        res.redirect(`/campgrounds/${id}`);
    }else{
        next();
    }
}
    