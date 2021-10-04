const express = require("express");
const app = express();

// TODO: Follow instructions in the checkpoint to implement ths API.
const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

app.use(express.json());

app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next(`Count id not found: ${countId}`);
  } else {
    res.json({ data: foundCount });
  }
});

app.use("/counts", (req, res) => {
  res.json({ data: counts });
});

app.use("/flips/:flipId", (req, res, next) => {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));

  if (foundFlip) {
    res.json({ data: foundFlip });
  } else {
    next(`Flip not found: ${flipId}`);
  }
});

app.get("/flips", (req, res) => {
  res.json({ data: flips });
});

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
function bodyHasResultProperty(req, res, next) {
  const { data: { result } = {} } = req.body;
  if (result) {
    next();
  } else {
    next({ status: 400, message: "A result property is required" });
  }
}

let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

app.post("/flips", bodyHasResultProperty, (req, res) => {
  const { data: { result } = {} } = req.body;
  const newFlip = {
    id: ++lastFlipId, // Increment last ID, then assign as the current ID
    result: result,
  };
  flips.push(newFlip);
  res.status(201).json({ data: newFlip });
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
