const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "root",
  port: 5432,
  password: "zach",
  database: "zauth",
});

client.connect();

module.exports = client;