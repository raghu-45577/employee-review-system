const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "emailId",
      passReqToCallback: true,
    },
    async function (req, emailId, password, done) {
      try {
        let user = await User.findOne({ emailId: emailId });
        if (!user || user.password !== password) {
          req.flash("error", "Username or password is incorrect");
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        req.flash("error", "Error finding user");
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    let user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.log("Error in finding user");
    return;
  }
});

passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/signin");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
