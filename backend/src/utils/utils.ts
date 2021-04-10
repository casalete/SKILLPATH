import jsonwebtoken from 'jsonwebtoken';

export const issueJWT = (user) => {
    const _id = user._id;

    const expiresIn = '1d';

    const payload = {
        sub: _id,
        iat: Date.now(),
    };

    const signedToken = jsonwebtoken.sign(payload, 'SKILLPATH_SECRET_PASSWORD', { expiresIn: expiresIn });

    return {
        token: signedToken,
        expires: expiresIn,
    };
};
