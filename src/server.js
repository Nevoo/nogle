const express = require("express");
const app = express();
const { googleAuth } = require('./auth');

const port = process.env.PORT || 8080;

app.get('/', async (req, res) => {
    const url = googleAuth();

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
