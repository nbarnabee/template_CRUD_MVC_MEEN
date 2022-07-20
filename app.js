// Base
const express = require("express");
const app = express();

// Environmental variables
require("dotenv").config();
const port = process.env.PORT || 5000;
let dbString = process.env.DB_STRING;

// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// can remove that if I install multer, but if I'm not planning to upload files then I won't need multer

// Templating
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main");

// Database connection
const { MongoClient } = require("mongodb");
const client = new MongoClient(dbString);
let dbName = "boardgames";
let db = client.db(dbName);
async function run() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("Database connection successful");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  try {
    let content = "This will be added to the template";
    res.render("index", { title: "Template Test Page Example", content });
  } catch (err) {
    console.log(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    let users = await db
      .collection("games")
      .find({}, { projection: { publisher: 1 } })
      .toArray();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
});

// Initialize server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
