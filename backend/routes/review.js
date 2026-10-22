const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsycn.js");
const { validateReview, isLoggedIn, isReviewAuthor, hasCheckedIn } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//post review route
router.post("/", isLoggedIn, hasCheckedIn, validateReview, wrapAsync(reviewController.createReview));

  // Delete Review Route
  router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
  );

  module.exports = router;