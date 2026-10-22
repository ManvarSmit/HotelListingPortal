const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  comment: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  listingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Object.defineProperty(Review.prototype, "_id", {
  get() {
    return this.id;
  },
});

Review.prototype.equals = function (otherId) {
  if (!otherId) return false;
  const targetId = typeof otherId === "object" && (otherId._id || otherId.id) ? (otherId._id || otherId.id) : otherId;
  return String(this.id) === String(targetId);
};

module.exports = Review;