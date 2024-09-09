const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const kuramanime = require("./sites/kuramanime");

const corsConfig = {
  origin: "*",
  credentials: true
};

app.use(cors(corsConfig));

app.use("/v1", kuramanime);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

app.listen(port, () => console.log("Server listen on port => " + port));
