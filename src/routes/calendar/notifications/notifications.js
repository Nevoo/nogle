const router  = require('express').Router();
const { google } = require('googleapis');
const { v4: uuid } = require('uuid');

const { authClient } = require('../../../services/google_auth');


router.post("/", async (req, res) => {
    console.log("notified");
    console.log(req.body);
    res.send('notification received')
});

router.post("/start", async (req, res) => {
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const response = await calendar.events.watch({
      calendarId: 'primary',
      // Free text search terms to find events that match these terms in any field, except for extended properties. Optional.
      // q: 'placeholder-value',
      requestBody: {
        "address": "https://nogle.herokuapp.com/calendar/notifications",
        "id": uuid(),
        "type": "web_hook",
      }
    })

    console.log(response.data);
    res.sendStatus(201);
});

router.post("/stop", async (req, res) => {
    //  {
    //     kind: 'api#channel',
    //     id: 'ab9e7fa7-ceb5-4e01-8c6c-02fadbbdefd3',
    //     resourceId: 'ulTl_1ud42ihL5lhLVfWFOBO1-w',
    //     resourceUri: 'https://www.googleapis.com/calendar/v3/calendars/primary/events?alt=json',
    //     expiration: '1651834910000'
    //   }

    const calendar = google.calendar({ version: "v3", auth: authClient });

    const response = await calendar.channels.stop({
        requestBody: {
          "id": "ab9e7fa7-ceb5-4e01-8c6c-02fadbbdefd3",
          "resourceId": "ulTl_1ud42ihL5lhLVfWFOBO1-w",
        },
    });

    console.log("stopped notification");
    console.log(response);

    res.sendStatus(response.status);
});

module.exports = router;