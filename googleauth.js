var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2");

const User = require("./models/User");
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        callbackURL: "https://niwzxj.sse.codesandbox.io/google/callback",
        passReqToCallback: true
      },
      function (req, accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.email })
          .then((user) => {
            if (!user) {
              //Create user
              const u = new User({
                name: profile.displayName,
                email: profile.email
              });
              u.save((err, newUser) => {
                if (err) throw err;
                return done(null, newUser);
              });
            }
            return done(null, user);
          })
          .catch((err) => console.log(err));
        // console.log(profile);
        // return done(null, profile);
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
      if (err) console.log(err);

      done(err, user);
    });
    // done(null, user);
  });
};
