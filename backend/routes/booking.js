const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsycn.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

router.get("/", isLoggedIn, wrapAsync(bookingController.getUserBookings));
router.post("/", isLoggedIn, wrapAsync(bookingController.createBooking));
router.delete("/:bookingId", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;
