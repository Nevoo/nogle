require('dotenv').config();

const { Client } = require("@notionhq/client");
const { app } = require("./server");

const connect = require('./services/mongo_connection');
connect();

const helmet = require('helmet');
app.use(helmet());

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: NOTION_KEY });