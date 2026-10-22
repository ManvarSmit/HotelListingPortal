const { Sequelize } = require("sequelize");

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@127.0.0.1:5432/wanderlust";

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false,
  define: {
    timestamps: true,
  },
});

module.exports = sequelize;
