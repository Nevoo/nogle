require('dotenv').config();

const { Client } = require("@notionhq/client");
const { server } = require("./server");

const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_KEY });