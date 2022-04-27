const { google } = require('googleapis');
const { v4: uuid } = require('uuid');

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
        console.log('set credentials with code');
    }

    // https://www.googleapis.com/calendar/v3/calendars/my_calendar@gmail.com/events/watch
    
    const calendar = google.calendar({ version: "v3", auth: authClient });

    // const response = await calendar.events.watch({
    //   calendarId: 'primary',
    //   // Free text search terms to find events that match these terms in any field, except for extended properties. Optional.
    //   // q: 'placeholder-value',
    //   requestBody: {
    //     "address": "https://nogle.herokuapp.com/notifications",
    //     "id": uuid(),
    //     "type": "web_hook",
    //   }
    // })

    // console.log(response.data);

    res.send('logged in');
});

app.post("/notifications", async (req, res) => {
  console.log("notified");
  console.log(req);
  res.send('notification received')
});

app.post("/notifications/stop", async (req, res) => {
  //  {
  //   kind: 'api#channel',
  //   id: '1a755d1a-992d-4c65-8395-3cf0823674a9',
  //   resourceId: 'ulTl_1ud42ihL5lhLVfWFOBO1-w',
  //   resourceUri: 'https://www.googleapis.com/calendar/v3/calendars/primary/events?alt=json',
  //   expiration: '1651676140000'
  //  }

  const calendar = google.calendar({ version: "v3", auth: authClient });

  const response = await calendar.channels.stop({
    requestBody: {
      "id": "1a755d1a-992d-4c65-8395-3cf0823674a9",
      "resourceId": "ulTl_1ud42ihL5lhLVfWFOBO1-w",
    },
  });

  console.log("stopped notification");
  console.log(response);

  res.send(response.status);
});


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`); 
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

module.exports = { app };
