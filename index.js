var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var read = require('read-yaml');
var config = read.sync('config.yml');
var mailgun = require('mailgun-js')({apiKey: config.key, domain: config.domain});

//Reading multipart/form-data
var multer = require('multer')();
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
const path = require("path")
const public = __dirname + "/build/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', express.static(path.join(__dirname, 'build')));

var auth = {
  auth: {
    api_key: config.key,
    domain: config.domain
  }
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth));

function router(app) {
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
    next();
  });
  app.post('/webhooks/*',multer.any(), function (req, res, next) {
    var body = req.body;

    if (!mailgun.validateWebhook(body.timestamp, body.token, body.signature)) {
      console.error('Request came, but not from Mailgun');
      res.send({ error: { message: 'Invalid signature. Are you even Mailgun?' } });
      return;
    }

    next();
  });
  app.post('/webhooks/mailgun/', multer.any(), function (req, res) {
    // actually handle request here
    console.log("got post message");
    res.send("ok 200");
  });
  app.get('/', function (req, res) {
    // actually handle request here
    res.sendFile(path.join(public + "index.html"));
  });
  
  app.post('/send', function (req, res) {
    // actually handle request here
    nodemailerMailgun.sendMail({
      from: 'adityapandey@this.com',
      to: 'anything@hackergully.com', // An array if you have multiple recipients.
      subject: req.body.title,
      text: req.body.body,
    }, function (err, info) {
      if (err) {
        res.status(400).json(err)
      }
      else {
        let response = {statusText: "Your Email Has Been Send"}
        res.status(200).json(response);
      }
    });
  });
}

app.listen(5000, function(){
  router(app);
  console.log("listening post in port 5000");
});