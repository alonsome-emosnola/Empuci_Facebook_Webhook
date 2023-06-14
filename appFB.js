var express = require('express');
var app = express();
require("dotenv").config();
app.use(express.json());
const port = 3000;

app.post('/*', function (req, res) {
  console.log("-------------- New Request POST --------------");
  console.log("Headers:"+ JSON.stringify(req.headers, null, 3));
  console.log("Body:"+ JSON.stringify(req.body, null, 3));
  res.json(JSON.parse(req.body));
})

// Add support for GET requests to Facebook webhook
app.get("/*", (req, res) => {
  // Parse the query params
  var mode = req.query["hub.mode"];
  var token = req.query["hub.verify_token"];
  var challenge = req.query["hub.challenge"];

  console.log("-------------- New Request GET --------------");
  console.log("Headers:"+ JSON.stringify(req.headers, null, 3));
  console.log("Body:"+ JSON.stringify(req.body, null, 3));

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
    res.json(JSON.parse(req.body));
  }
});

app.listen(port, function () {
   console.log(`Example Facebook app listening at ${port}`)
})
