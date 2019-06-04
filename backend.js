"use strict";

var express = require('express');
var app = express();
var web3Auth = require('web3-auth');

app.use(express.static('public'));

web3Auth.attach(app, "This is my secret.");

app.get('/who', function (req, res) {
  console.log(req.cookies.token);
  console.log(req.user);
  if (req.user) {
    res.json({
      account: req.user.loggedInAs
    });
  } else {
    res.status(404);
  }
  res.end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
