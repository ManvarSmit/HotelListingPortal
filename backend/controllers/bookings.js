const { Listing, Booking } = require("../models");

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.body.booking;

  const listing = await Listing.findByPk(id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found!" });
  }

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
    return res.status(400).json({ error: "Please select valid check-in and check-out dates!" });
  }

  const timeDiff = endDate.getTime() - startDate.getTime();
  const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const totalPrice = totalDays * listing.price;

  const existingBookings = await Booking.findAll({
    where: { listingId: listing.id },
  });

  const isOverlapping = existingBookings.some((b) => {
    return checkIn < b.checkOut && checkOut > b.checkIn;
  });

  if (isOverlapping) {
    return res.status(400).json({
      error: "This hotel is already booked for the selected dates! Please choose different dates.",
    });
  }

  const booking = await Booking.create({
    checkIn,
    checkOut,
    totalDays,
    totalPrice,
    listingId: listing.id,
    userId: req.user.id,
  });

  res.json({
    success: true,
    message: `Booking successful! You booked ${listing.title} for ${totalDays} night(s). Total: ₹ ${totalPrice.toLocaleString("en-IN")}`,
    booking,
  });
};

module.exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    include: [{ model: Listing, as: "listing" }],
    order: [["createdAt", "DESC"]],
  });

  res.json({ bookings });
};

module.exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found!" });
  }

  if (booking.userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "You do not have permission to cancel this booking!" });
  }

  await booking.destroy();
  res.json({ success: true, message: "Booking cancelled successfully!" });
};
