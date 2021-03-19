const passport = require('./passport');

exports.auth = () => {
	return (req, res, next) => {
		passport.authenticate('local', (error, user, info) => {
			if (error) res.status(400).json({"statusCode": 200, "message": error});
			req.login(user, function (error) {
				if (error) return next(error);
				next();
			});
		})(req, res, next);
	}
}

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next()
	}
	return res.status(401).json({"statusCode": 400, "message": "not authenticated"})
}
