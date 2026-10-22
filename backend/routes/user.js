const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsycn.js");
const passport = require("passport");
const userController = require("../controllers/users.js");

router.post("/signup", wrapAsync(userController.signup));

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid email or password." });
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return userController.login(req, res);
    });
  })(req, res, next);
});

router.get("/logout", userController.logout);
router.get("/api/currUser", userController.getCurrUser);

module.exports = router;