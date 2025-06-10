const express = require('express');
const router = express.Router({mergeParams:true}); //important so that parent urls req.params get here, does not stay in app.js
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");



//Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Route
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview));
module.exports = router;


//httpcookies -> small blocks of data created by webserver while user is browsing website 
//placed on user's computer by the user's web browser

//light mode on one pg gets applied to the next page
// session management -> cart items
//tracking
//personalized ads also use cookies

