const express = require("express");
const app = express();

const { googleAuth } = require("./middleware");

const port = process.env.PORT || 8080;

app.use(googleAuth);

app.get('/', async (req, res) => {
  res.redirect(res.locales.redirectUrl);
});

app.use('/calendar', require('./routes/calendar/router'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`); 
});


module.exports = { app };
