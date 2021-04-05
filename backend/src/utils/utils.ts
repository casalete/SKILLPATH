const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');

function issueJWT(user) {
	const _id = user._id;

	const expiresIn = '1d';

	const payload = {
		sub: _id,
		iat: Date.now(),
	};

	const signedToken = jsonwebtoken.sign(payload, 'SKILLPATH_JWT_SIGNATURE', { expiresIn: expiresIn });

	return {
		token: 'Bearer ' + signedToken,
		expires: expiresIn,
	};
}

module.exports.issueJWT = issueJWT;
