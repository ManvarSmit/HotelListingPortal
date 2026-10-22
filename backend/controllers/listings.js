const { Listing, User, Review, Booking } = require("../models"); 
const { Op } = require("sequelize");

module.exports.index = async (req, res) => {
  const { q, category } = req.query;
  let whereClause = {};

  if (category) {
    whereClause.category = category;
  }

  if (q && q.trim() !== "") {
    const queryTerm = `%${q.trim()}%`;
    whereClause[Op.or] = [
      { title: { [Op.iLike]: queryTerm } },
      { location: { [Op.iLike]: queryTerm } },
      { country: { [Op.iLike]: queryTerm } },
    ];
  }

  let allListings = await Listing.findAll({
    where: whereClause,
    include: [{ model: User, as: "owner" }],
    order: [["createdAt", "DESC"]],
  });

  res.json({
    allListings,
    searchQuery: q || "",
    selectedCategory: category || "",
  });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByPk(id, {
    include: [
      { model: User, as: "owner" },
      {
        model: Review,
        as: "reviews",
        include: [{ model: User, as: "author" }],
      },
    ],
  });
  if (!listing) {
    return res.status(404).json({ error: "Listing you requested for does not exist!" });
  }

  const allBookings = await Booking.findAll({
    where: { listingId: id },
  });

  const bookedRanges = allBookings.map((b) => ({
    from: b.checkIn,
    to: b.checkOut,
  }));

  let hasCheckedIn = false;
  if (req.user) {
    const todayStr = new Date().toISOString().split("T")[0];
    hasCheckedIn = allBookings.some((b) => b.userId === req.user.id && b.checkIn <= todayStr);
  }

  res.json({ listing, hasCheckedIn, bookedRanges });
};

module.exports.createListing = async (req, res, next) => {
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  } else if (req.file) {
    images = [{ url: req.file.path, filename: req.file.filename }];
  }

  const listingData = {
    ...req.body.listing,
    ownerId: req.user.id,
    images: images,
    image_url: images[0] ? images[0].url : "",
    image_filename: images[0] ? images[0].filename : "",
  };
  const newListing = await Listing.create(listingData);
  res.json({ success: true, listing: newListing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByPk(id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  await listing.update({ ...req.body.listing });
  if (req.files && req.files.length > 0) {
    let newImages = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    listing.images = newImages;
    listing.image_url = newImages[0].url;
    listing.image_filename = newImages[0].filename;
    await listing.save();
  }
  res.json({ success: true, listing });
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.destroy({ where: { id } });
  res.json({ success: true });
};