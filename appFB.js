const express = require('express');
// const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(express.json());
// app.use(bodyParser.json())
const port = 10000;

app.post('/*', function (req, res) {
  res.send("-------------- New Request POST --------------");
  res.send("Headers:"+ JSON.stringify(req.headers, null, 3));
  res,send("Body:"+ JSON.stringify(req.body, null, 3));
  // res.json(req.body);
  // res.json({ message: "Thank you for the message" });
})

// Add support for GET requests to Facebook webhook
app.get("/*", (req, res) => {
  // Parse the query params
  var mode = req.query["hub.mode"];
  var token = req.query["hub.verify_token"];
  var challenge = req.query["hub.challenge"];

  // res.send("-------------- New Request GET --------------");
  // res.send("Headers:"+ JSON.stringify(req.headers, null, 3));
  res.send("Body:"+ JSON.stringify(req.body, null, 3));

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === process.env.WEBHOOK_TOKEN) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      console.log("Responding with 403 Forbidden");
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    console.log("Replying Thank you.");
    res.json(req.body);
    // res.json({ message: "Thank you for the message" });
  }
});

app.listen(port, function () {
   console.log(`Example Facebook app listening at ${port}`)
})
