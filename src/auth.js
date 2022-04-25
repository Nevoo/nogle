const { google } = require('googleapis');


const GOOGLE_REDIRECT = 'http://localhost:8080/dashboard';

const googleAuth = () => {
    const googleAuthConfig = {
        clientId: process.env.GOOG_CLIENT_ID,
        clientSecret: process.env.GOOG_CLIENT_SECRET,
        redirect: GOOGLE_REDIRECT,
    };

    const auth = new google.auth.OAuth2(
        googleAuthConfig.clientId, 
        googleAuthConfig.clientSecret, 
        googleAuthConfig.redirect,
    );

    const defaultScope = [
        'https://www.googleapis.com/auth/calendar.events.readonly',
    ];

    const url = auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time
        scope: defaultScope
    });

    return url;
}

module.exports = { googleAuth };