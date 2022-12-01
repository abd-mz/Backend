const express = require("express");
const app = express();
var cors = require("cors");

app.use(cors({ credentials: true, origin: "htpp://localhost:4200" }));

// GET /films
app.get("/films", (request, response) => {
  response.json({ data: "get films entry" });
});

let films = [];

// GET films/:id
app.get("/films/:id", (request, response) => {
  response.json({ data: "get films:id entry" });
});

// POST /films/:id
app.post("/films", (request, response) => {
  response.json({ data: films });
});

// PUT /films/:id
app.put("/films", (request, response) => {
  response.json({ data: "PUT films:id entry" });
});

// DELETE /films/:id
app.delete("/films/id", (request, response) => {
  response.json({ data: "PUT films:id entry" });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
