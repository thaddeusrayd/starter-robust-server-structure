const express = require("express");
const app = express();

// TODO: Follow instructions in the checkpoint to implement ths API.
const flips = require("./data/flips-data");

app.use("/flips", (req, res) => {
  res.json({ data: flips });
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
