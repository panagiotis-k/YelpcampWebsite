const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const multer = require("multer");
const {storage} = require("../cloudinary/index");
const upload = multer({storage})

//import controllers
const campgrounds = require("../controllers/campgrounds");

// import middlewares
const {isLoggedIn,validateCampground,isAuthor} = require("../utils/middleware");

router.route("/")
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn,upload.array("image"),validateCampground,wrapAsync(campgrounds.createCampground));
    

router.get("/new",isLoggedIn,campgrounds.renderNewForm);

router.route("/:id")
    .get( wrapAsync(campgrounds.showCampground))
    .patch(isAuthor,upload.array("image"),validateCampground,wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,wrapAsync(campgrounds.deleteCampground));

router.get("/:id/edit",isLoggedIn,isAuthor,wrapAsync(campgrounds.renderEditForm));

module.exports = router;