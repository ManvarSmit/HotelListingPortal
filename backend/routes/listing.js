const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsycn.js");
const { isLoggedIn, isOwner, validateListing, isAdmin } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    isAdmin,
    upload.array('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.array('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;