const express = require("express");
const app = express();

const { Client } = require("@notionhq/client");

require('dotenv').config();

const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_KEY });

app.get('/', (req, res) => {
    console.log("hello");
    res.send("Hello world");
});

console.log('testt');
