function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Proceed to the next middleware or route handler
    }
    res.redirect("/login"); // Redirect to login page if not authenticated
}

export default ensureAuthenticated;
