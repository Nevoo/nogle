const { google } = require('googleapis');
const express = require("express");
const app = express();
const { setCredentials, authClient } = require('./auth');
const { googleAuth } = require("./middleware");

const port = process.env.PORT || 8080;

app.use(googleAuth);

app.get('/', async (req, res) => {
    res.redirect(res.locales.redirectUrl);
});

app.get('/dashboard', async (req, res) => {
    console.log(req.query.code);
    console.log(req.query.scope);

    let accessToken;

    try {
        const { token } = await authClient.getAccessToken();
        accessToken = token;
    } catch(error) {
        console.error("got no access token");
    }

    if(!accessToken && !req.query.code) {
        return res.send('not logged in')
    };

    if(!accessToken && req.query.code) {
        await setCredentials(req.query.code);
    }

    const calendar = google.calendar({ version: "v3", auth: authClient });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
          console.log('Upcoming 10 events:');
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
          });
        } else {
          console.log('No upcoming events found.');
        }
      });

    res.send('logged in');
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/`);
});


module.exports = { app };
