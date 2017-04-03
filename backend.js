"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ethUtil = require('ethereumjs-util');
var sigUtil = require('eth-sig-util');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(expressJwt({
  secret: 'shhhhh',
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring (req) {
    return req.cookies.token;
  }
}));

app.post('/sign-in', function (req, res) {
  console.log(req.body);
  
  var msgParams = {
    data: ethUtil.bufferToHex(new Buffer("Sign into demo app.", 'utf8')),
    sig: req.body.signed,
  };
  var recovered = sigUtil.recoverPersonalSignature(msgParams)

  if (recovered === req.body.account) {
    console.log('SigUtil Successfully verified signer as ' + req.body.account);
    
    var token = jwt.sign({loggedInAs: req.body.account}, 'shhhhh');
    
    console.log('JWT token: ' + token);
    res.cookie('token', token, {domain: 'localhost', httpOnly: true});
    res.end();
  } else {
    console.log('SigUtil recover the message signer');
  }  
});

app.get('/who', function (req, res) {
  console.log(req.cookies.token);
  console.log(req.user);
  if (req.user) {
    res.json({account: req.user.loggedInAs});
  }
  else {
    res.status(404);
  }
  res.end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
