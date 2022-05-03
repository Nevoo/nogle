const { google } = require('googleapis');
const User = require('../models/user');

const BASE_API_ROUTE = process.env.ENVIRONMENT === 'dev' ? 'http://localhost:8080/' : 'https://nogle.herokuapp.com/';
const REDIRECT_API_ROUTE = 'calendar/dashboard';
const GOOGLE_REDIRECT = BASE_API_ROUTE + REDIRECT_API_ROUTE;

const googleAuthConfig = {
    clientId: process.env.GOOG_CLIENT_ID,
    clientSecret: process.env.GOOG_CLIENT_SECRET,
    redirect: GOOGLE_REDIRECT,
};

const authClient = new google.auth.OAuth2(
    googleAuthConfig.clientId, 
    googleAuthConfig.clientSecret, 
    googleAuthConfig.redirect,
);

const defaultScope = [
    'https://www.googleapis.com/auth/calendar.events.readonly',
];

const authorize = async () => {
    const refreshToken = await refreshTokenFromDb(process.env.TESTING_DB_ID);
    console.log(process.env.TESTING_DB_ID);
    console.log(refreshToken);
    if(!refreshToken) return generateAuthUrl();

    authClient.setCredentials({refresh_token: refreshToken});
}

const generateAuthUrl = () => {
    const url = authClient.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time
        scope: defaultScope
    });

    return url;
}

const setCredentials = async (code, id) => {
    const { tokens } = await authClient.getToken(code);
    authClient.setCredentials(tokens);
    await refreshToken(tokens, id);
}

const refreshToken = async (tokens, id) => {
    if(tokens.refresh_token) {
        const refreshToken = await refreshTokenFromDb(id, tokens.refresh_token);
        authClient.setCredentials({ refresh_token: refreshToken });
    }

    console.log(`ACCESS TOKEN: ${tokens.access_token}`);
}

const refreshTokenFromDb = async (id, refreshToken) => {
    try {
        let user = await User.findById(id);

        if(!user && refreshToken) {   
            user = await saveUserRefreshTokenInDB(refreshToken);
        } else if(refreshToken && (user && user.refreshToken !== refreshToken)) {
            user.refreshToken = refreshToken;
            user.save();
        } 

        return user?.refreshToken;
    } catch (error) {
        console.error(error);
        return;
    }
};

const saveUserRefreshTokenInDB = async (refreshToken) => {
    let user = User({ refreshToken });
    await user.save();
    return user;
}

module.exports = { 
    authorize, 
    setCredentials, 
    authClient, 
    GOOGLE_REDIRECT 
};