const express = require("express");
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    console.log("hello");
    res.send("Hello world");
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/`);
})

console.log('testt');

module.exports = { server: app };
