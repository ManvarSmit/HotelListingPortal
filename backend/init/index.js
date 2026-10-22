const sequelize = require("../config/db.js");
const { User, Listing, Review } = require("../models");
const initdata = require("./data.js");

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connection successful");
    await sequelize.sync({ force: true });
    console.log("Tables recreated successfully");

    const sampleUser = await User.register(
      { username: "admin", email: "admin@gmail.com", role: "admin" },
      "admin123"
    );

    const formattedData = initdata.data.map((obj) => {
      let imagesList = [];
      if (obj.images && Array.isArray(obj.images)) {
        imagesList = obj.images;
      } else if (obj.image) {
        imagesList = [obj.image];
      }
      return {
        title: obj.title,
        description: obj.description,
        category: obj.category || "trending",
        images: imagesList,
        image_url: imagesList[0] ? imagesList[0].url : "",
        image_filename: imagesList[0] ? imagesList[0].filename : "",
        price: obj.price,
        location: obj.location,
        country: obj.country,
        ownerId: sampleUser.id,
      };
    });

    await Listing.bulkCreate(formattedData);
    console.log("Data was initialized successfully");
    process.exit(0);
  } catch (err) {
    console.error("Initialization error:", err);
    process.exit(1);
  }
};

initDB();