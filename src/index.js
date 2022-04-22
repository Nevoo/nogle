const http = require("http");

const { Client } = require("@notionhq/client");

require('dotenv').config();

const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_KEY });

console.log('testt');

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.end("Hello world");
});