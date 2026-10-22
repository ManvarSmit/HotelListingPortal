const { Listing, Review } = require("../models");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findByPk(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found!" });
  }
  const review = await Review.create({
    ...req.body.review,
    listingId: listing.id,
    authorId: req.user.id,
  });

  res.json({ success: true, review });
};

module.exports.destroyReview = async (req, res) => {
  let { reviewId } = req.params;
  await Review.destroy({ where: { id: reviewId } });
  res.json({ success: true });
};