const User = require("./user");
const Listing = require("./listing");
const Review = require("./review");
const Booking = require("./booking");

// Associations
User.hasMany(Listing, { foreignKey: "ownerId", as: "listings" });
Listing.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

Listing.hasMany(Review, { foreignKey: "listingId", as: "reviews", onDelete: "CASCADE" });
Review.belongsTo(Listing, { foreignKey: "listingId" });

User.hasMany(Review, { foreignKey: "authorId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "authorId", as: "author" });

User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

Listing.hasMany(Booking, { foreignKey: "listingId", as: "bookings", onDelete: "CASCADE" });
Booking.belongsTo(Listing, { foreignKey: "listingId", as: "listing" });

module.exports = {
  User,
  Listing,
  Review,
  Booking,
};
