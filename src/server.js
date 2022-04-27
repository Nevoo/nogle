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
    }

    // https://www.googleapis.com/calendar/v3/calendars/my_calendar@gmail.com/events/watch
    
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const response = await calendar.events.watch({
        // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
      calendarId: 'primary',
      // Specifies event ID in the iCalendar format to be included in the response. Optional.
      // iCalUID: 'placeholder-value',
      // The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
      // maxAttendees: 'placeholder-value',
      // Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.
      // maxResults: 'placeholder-value',
      // The order of the events returned in the result. Optional. The default is an unspecified, stable order.
      // orderBy: 'placeholder-value',
      // Token specifying which result page to return. Optional.
      // pageToken: 'placeholder-value',
      // Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints.
      // privateExtendedProperty: 'placeholder-value',
      // Free text search terms to find events that match these terms in any field, except for extended properties. Optional.
      // q: 'placeholder-value',
      // Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints.
      // sharedExtendedProperty: 'placeholder-value',
      // Whether to include deleted events (with status equals "cancelled") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False.
      // showDeleted: 'placeholder-value',
      // Whether to include hidden invitations in the result. Optional. The default is False.
      // showHiddenInvitations: 'placeholder-value',
      // Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.
      // singleEvents: 'placeholder-value',
      // Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All events deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False.
      // There are several query parameters that cannot be specified together with nextSyncToken to ensure consistency of the client state.
      //
      // These are:
      // - iCalUID
      // - orderBy
      // - privateExtendedProperty
      // - q
      // - sharedExtendedProperty
      // - timeMin
      // - timeMax
      // - updatedMin If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken.
      // Learn more about incremental synchronization.
      // Optional. The default is to return all entries.
      // syncToken: 'placeholder-value',
      // Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMin is set, timeMax must be greater than timeMin.
      // timeMax: 'placeholder-value',
      // Lower bound (exclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMax is set, timeMin must be smaller than timeMax.
      // timeMin: 'placeholder-value',
      // Time zone used in the response. Optional. The default is the time zone of the calendar.
      // timeZone: 'placeholder-value',
      // Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time.
      // updatedMin: 'placeholder-value',

      // Request body metadata
      requestBody: {
        // request body parameters
        "address": "https://nogle.herokuapp.com/",
        //   "expiration": "my_expiration",
        "id": uuid(),
        "type": "web_hook",
        //   "kind": "my_kind",
        //   "params": {},
        //   "payload": false,
        //   "resourceId": "my_resourceId",
        //   "resourceUri": "my_resourceUri",
        //   "token": "my_token",
      }
    })

    console.log(response.data);

    res.send('logged in');
});

app.post("/notifications", async (req, res) => {
  console.log("notified");
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
