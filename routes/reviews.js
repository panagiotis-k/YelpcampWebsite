const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
// mergeParams : true -  so the express-router can merge the params (:id) with my app
const router = express.Router({mergeParams : true});
const reviews = require("../controllers/reviews");
//import my middlewares
const {validateReview,isLoggedIn,isReviewAuthor} = require("../utils/middleware");

router.post("/",validateReview,wrapAsync(reviews.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviews.deleteReview));

module.exports = router;