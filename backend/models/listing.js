const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Listing = sequelize.define("Listing", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  image_url: {
    type: DataTypes.TEXT,
  },
  image_filename: {
    type: DataTypes.STRING,
  },
  images: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  image: {
    type: DataTypes.VIRTUAL,
    get() {
      const imgList = this.imagesList;
      return imgList && imgList.length > 0 ? imgList[0] : { url: "", filename: "" };
    },
    set(val) {
      if (val && typeof val === "object") {
        this.setDataValue("image_url", val.url || "");
        this.setDataValue("image_filename", val.filename || "");
        this.setDataValue("images", [val]);
      }
    },
  },
  price: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  location: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: "trending",
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Object.defineProperty(Listing.prototype, "_id", {
  get() {
    return this.id;
  },
});

Object.defineProperty(Listing.prototype, "imagesList", {
  get() {
    if (Array.isArray(this.images) && this.images.length > 0) {
      return this.images;
    }
    if (this.image_url) {
      return [{ url: this.image_url, filename: this.image_filename || "" }];
    }
    return [];
  },
});

module.exports = Listing;
