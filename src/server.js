const express = require("express");
const {google} = require('googleapis');


const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', async (req, res) => {
    const googleAuthConfig = {
        clientId: process.env.GOOG_CLIENT_ID,
        clientSecret: process.env.GOOG_CLIENT_SECRET,
        redirect: process.env.GOOG_REDIRECT,
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

    res.redirect(url);
});

app.get('/dashboard', (req, res) => {
    console.log(req.query.code);
    console.log(req.query.scope);

    res.send('logged in');
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/`);
})


module.exports = { app };
