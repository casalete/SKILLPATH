const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config()
const {findByUsername} = require("./user");

passport.use(new LocalStrategy(
	function (username, password, done) {

		if (username === "admin" && password === process.env.HASHED_PASSWORD) {
			return done(null, username);
		} else {
			return done("1 access", false);
		}
	}
));


passport.serializeUser(function (user, done) {
	done(null, user);
	if (user) done(null, user);
});


passport.deserializeUser(function (id, done) {
		findByUsername(id, function(err, user) {
				done(err, user);
			});
})

module.exports = passport;
