const { google } = require('googleapis');
const fs = require('fs');

const GOOGLE_REDIRECT = 'http://localhost:8080/dashboard';

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
    const refreshToken = readSavedRefreshTokenFromFile();

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

const setCredentials = async (code) => {
    const { tokens } = await authClient.getToken(code);
    authClient.setCredentials(tokens);
    refreshToken(tokens);
}

const refreshToken = (tokens) => {
    if(tokens.refresh_token) {
        console.log(`REFRESH TOKEN: ${tokens.refresh_token}`);
        writeRefreshTokenToFile(tokens.refresh_token);
        const refreshToken = readSavedRefreshTokenFromFile();
        authClient.setCredentials({ refresh_token: refreshToken });
    }

    console.log(`ACCESS TOKEN: ${tokens.access_token}`);
}

const writeRefreshTokenToFile = (refreshToken) => {
    try {
        fs.writeFileSync('refresh_token.txt', refreshToken);
    } catch (error) {
        console.error(`couldnt save refresh token ${refreshToken}`);
        console.error(error);
    }
}

const readSavedRefreshTokenFromFile = () => {
    try {
        const refreshToken = fs.readFileSync('refresh_token.txt', 'utf8');
        return refreshToken;
    } catch (error) {
        console.error(`couldnt read refresh token from file`);
        return;
    }
}

module.exports = { 
    authorize, 
    setCredentials, 
    authClient, 
    GOOGLE_REDIRECT 
};