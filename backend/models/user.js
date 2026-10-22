const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");

if (!Number.prototype.equals) {
  Number.prototype.equals = function (other) {
    if (other === null || other === undefined) return false;
    const target = typeof other === "object" && (other._id || other.id) ? (other._id || other.id) : other;
    return String(this) === String(target);
  };
}

if (!String.prototype.equals) {
  String.prototype.equals = function (other) {
    if (other === null || other === undefined) return false;
    const target = typeof other === "object" && (other._id || other.id) ? (other._id || other.id) : other;
    return String(this) === String(target);
  };
}


const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique removed: same username allowed with different emails
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
  },
});

// Virtual getter for _id for Mongoose compatibility
Object.defineProperty(User.prototype, "_id", {
  get() {
    return this.id;
  },
});

User.prototype.equals = function (otherId) {
  if (!otherId) return false;
  const targetId = typeof otherId === "object" && (otherId._id || otherId.id) ? (otherId._id || otherId.id) : otherId;
  return String(this.id) === String(targetId);
};

// Static helper to register a user with password hashing
User.register = async function (userInstance, password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const createdUser = await User.create({
    username: userInstance.username,
    email: userInstance.email,
    password: hashedPassword,
    role: userInstance.role || "user",
  });
  return createdUser;
};

// Helper for Passport Local Strategy
User.authenticate = function () {
  // Passport calls this with (username, password) but we treat
  // the first argument as the email field sent from the login form.
  return async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return done(null, false, { message: "No account found with that email." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };
};

User.serializeUser = function () {
  return (user, done) => {
    done(null, user.id);
  };
};

User.deserializeUser = function () {
  return async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  };
};

module.exports = User;