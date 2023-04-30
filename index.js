const express = require("express");
const postgres = require("pg");
const morgan = require("morgan");
const logging = require("./helpers/loggingHelper");
const bodyParser = require("body-parser");

const http = express();
const databaseClient = new postgres.Client({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  host: process.env.POSTGRES_HOST,
  database: "ldb",
  port: 5432,
});

http.use(morgan("combined"));
http.use(bodyParser.urlencoded({ extended: true }));
http.use(bodyParser.json());

http.set("trust proxy", true);

// Initiate the database connection
databaseClient.connect((connectError) => {
  if (connectError) {
    logging.write(
      "error",
      "A database connection could not be made. (port 5432)"
    );
    process.exit(1);
  } else {
    logging.write("info", "A connection to the database was established.");
  }
});

// Link endpoints to main
require("./endpoints/retrieveProduct")(databaseClient, http, logging);
require("./endpoints/transmitProduct")(databaseClient, http, logging);

// Establish a base route
http.get("/", (req, res) => {
  return res.json({
    code: 200,
    databaseStatus: "OK",
    serverStatus: "OK",
    requestAddress: req.ip,
  });
});

// Establish a 404 route
http.all("*", (req, res) => {
  return res.status(404).json({
    code: 404,
    requestAddress: req.ip,
  })
})

http.listen(9101, () => {
  logging.write("info", `Listening on port 9101.`);
});
