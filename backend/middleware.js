const { Listing, Review, User, Booking } = require("./models");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "You must be logged in first!" });
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Only admin can perform this action!" });
};

module.exports.hasCheckedIn = async (req, res, next) => {
  let { id } = req.params;
  const todayStr = new Date().toISOString().split("T")[0];

  const bookings = await Booking.findAll({
    where: {
      listingId: id,
      userId: req.user.id,
    },
  });

  const checkedInBooking = bookings.find((b) => b.checkIn <= todayStr);

  if (!checkedInBooking) {
    return res.status(403).json({ error: "You can only leave a review after checking in to your booked stay!" });
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  // Admin can always edit or delete any listing
  if (req.user && req.user.role === "admin") return next();

  let { id } = req.params;
  let listing = await Listing.findByPk(id, {
    include: [{ model: User, as: "owner" }],
  });
  if (!listing) {
    return res.status(404).json({ error: "Listing not found!" });
  }
  if (!listing.owner || !listing.owner._id.equals(res.locals.currUser._id)) {
    return res.status(403).json({ error: "You are not the owner of this listing!" });
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findByPk(reviewId, {
    include: [{ model: User, as: "author" }],
  });
  if (!review) {
    return res.status(404).json({ error: "Review not found!" });
  }
  if (!review.author || !review.author._id.equals(res.locals.currUser._id)) {
    return res.status(403).json({ error: "You are not the author of this review!" });
  }
  next();
};
