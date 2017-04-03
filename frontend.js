"use strict";

window.addEventListener('load', function() {

  var $ = require('jquery');
  var Web3 = require('web3');
  var ethUtil = require('ethereumjs-util');
  var Eth = require('ethjs');
  window.Eth = Eth;

  window.web3 = new Web3(web3.currentProvider);
  var eth = new Eth(web3.currentProvider)

  web3.version.getNode(function(error, result) {
    if(!error) {
      $("#api").html(web3.version.api);
      $("#node").html(result);
      $("#account").html(web3.eth.accounts[0]);
    }
    else {
      console.error(error);
    }
  });

  web3.version.getNetwork(function(error, result) {
    if(!error) {
      $("#network").html(result);
    }
    else {
      console.error(error);
    }
  });

  web3.version.getEthereum(function(error, result) {
    if(!error) {
      $("#ethereum").html(result);
    }
    else {
      console.error(error);
    }
  });

  web3.net.getPeerCount(function(error, result) {
    if(!error) {
      $("#peer-count").html(result);
    }
    else {
      console.error(error);
    }
  });

  web3.eth.getGasPrice(function(error, result) {
    if(!error) {
      $("#gas-price").html(result.toString(10));
    }
    else {
      console.error(error);
    }
  });

  web3.eth.getBlockNumber(function(error, result) {
    if(!error) {
      $("#block-number").html(result);
    }
    else {
      console.error(error);
    }
  });

  web3.eth.filter('latest', function(error, result) {
    if (!error) {
      web3.eth.getBlockNumber(function(error, result) {
        if(!error) {
          $("#block-number").html(result);
        }
        else {
          console.error(error);
        }
      });
    }
    else {
      console.error(error);
    }
  });

  $('#button').click(function (event) {
    eth.personal_sign(web3.eth.accounts[0], ethUtil.bufferToHex(new Buffer("Sign into demo app.", 'utf8')))
    .then((signed) => {
      console.log('Signed!  Result is: ', signed);

      $.ajax({
        method: 'POST',
        contentType: 'application/json',
        url: 'http://localhost:3000/sign-in',
        data: JSON.stringify({
          account: web3.eth.accounts[0],
          signed: signed,
        }),
        success: function (data, textStatus, jqXHR) {
          console.log('Signed in.');
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('Failed to sign in.');
        }
      });
    })
  });

  $('#who').click(function (event) {
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/who',
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        alert(data.account);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('error');
      }
    });
  });

});
