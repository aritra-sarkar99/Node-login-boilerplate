const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push("All fields not filled");
  }
  if (password !== password2) {
    errors.push("Password not matching");
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          errors.push("Email already exists");
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const u = new User({ name, email, password });
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(u.password, salt, (err, hash) => {
              if (err) throw err;

              u.password = hash;
              u.save((err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  // console.log(result);
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in "
                  );
                  res.redirect("/users/login");
                }
              });
            })
          );
        }
      })
      .catch((err) => console.log(err));
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  // console.log(req);

  req.logout((err) => {
    if (err) throw err;
    req.flash("success_msg", "You are logged out !!");
    res.redirect("/");
  });
});

module.exports = router;
