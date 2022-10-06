const express = require("express");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

require("dotenv").config();
require("./passport")(passport);
require("./googleauth")(passport);

const mongourl = process.env.MongoURI;
mongoose
  .connect(mongourl, { useNewUrlParser: true })
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));

//Routes
const userRoute = require("./routes/user");
const indexRoute = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

//Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 900000 }
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//body parser
app.use(express.urlencoded({ extended: false }));

app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

//Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});

app.use("/users", userRoute);

app.use(indexRoute);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
  // console.log(mongourl);
});
