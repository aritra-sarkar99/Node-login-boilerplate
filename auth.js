module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      // res.set(
      //   "Cache-Control",
      //   "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      // );
      return next();
    }
    req.flash("error_msg", "Please login to view this resource");
    res.redirect("/users/login");
  }
};
