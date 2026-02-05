const express = require("express");
const shortid = require("shortid");

const app = express();
app.use(express.json());

const urlDB = {};

app.post("/shorten", (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "URL required" });
  }

  const shortCode = shortid.generate();
  urlDB[shortCode] = originalUrl;

  res.json({
    shortUrl: `http://localhost:3000/${shortCode}`
  });
});

app.get("/:code", (req, res) => {
  const originalUrl = urlDB[req.params.code];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send("URL not found");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
