const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = { email, username, role: "user" };
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      if (req.headers.accept?.includes("application/json") || req.originalUrl.includes("/api")) {
        return res.json({ success: true, user: registeredUser });
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    // Give clean messages for Sequelize unique constraint errors
    let message = e.message;
    if (e.name === "SequelizeUniqueConstraintError") {
      const field = e.errors?.[0]?.path;
      if (field === "username") message = "Username already taken. Please choose a different one.";
      else if (field === "email") message = "An account with this email already exists.";
      else message = "Username or email already in use.";
    }
    if (req.headers.accept?.includes("application/json") || req.originalUrl.includes("/api")) {
      return res.status(400).json({ error: message });
    }
    req.flash("error", message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  if (req.headers.accept?.includes("application/json") || req.originalUrl.includes("/api")) {
    return res.json({ success: true, user: req.user });
  }
  req.flash("success", "Welcome back to Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    if (req.headers.accept?.includes("application/json") || req.originalUrl.includes("/api")) {
      return res.json({ success: true });
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};

module.exports.getCurrUser = (req, res) => {
  res.json({ currUser: req.user || null });
};