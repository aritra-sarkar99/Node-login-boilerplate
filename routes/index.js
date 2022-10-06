const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../googleauth")(passport);
const { ensureAuth } = require("../auth");

function isLogged(req, res, next) {
  console.log(req.user);

  return req.isAuthenticated() ? next() : res.sendStatus(401);
}
router.get("/", (req, res) => res.render("welcome"));
router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard", {
    name: req.user.name
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/"
  })
);

router.get("/protected", ensureAuth, (req, res) => {
  res.send("Authenticated");
});

module.exports = router;
