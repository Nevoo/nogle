const router  = require('express').Router();
const { google } = require('googleapis');

const { setCredentials, authClient } = require('../../services/auth');

router.use('/notifications', require('./notifications/notifications'))

router.get('/dashboard', async (req, res) => {
    let accessToken;

    try {
        const { token } = await authClient.getAccessToken();
        accessToken = token;
    } catch(error) {
        console.error("got no access token");
    }

    if(!accessToken && !req.query.code) {
        return res.send('not logged in');
    };

    if(!accessToken && req.query.code) {
        await setCredentials(req.query.code);
        console.log('set credentials with code');
    }

    getUpcomingCalendarEvents();
    res.send('logged in');
});


const getUpcomingCalendarEvents = () => {
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
  }
  

  module.exports = router;