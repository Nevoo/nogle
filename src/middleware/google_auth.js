const { authorize, GOOGLE_REDIRECT } = require('../services/auth');


const googleAuth = async (req, res, next) => {
    let url;

    try {
        const authUrl = await authorize();
        url = authUrl ? authUrl : GOOGLE_REDIRECT;
    } catch (error) {
        console.error('something went wrong while authorizing');
        console.error(error);
    }

    res.locales = { redirectUrl: url };

    next();
}

module.exports = { googleAuth };