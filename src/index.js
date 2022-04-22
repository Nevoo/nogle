const https = require("https");

const { Client } = require("@notionhq/client");

require('dotenv').config();

const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_KEY });

console.log('test');