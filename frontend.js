"use strict";

var web3AuthFrontEnd = require('./web3-auth-git/frontend.js')
var $ = require('jquery');
var Web3 = require('web3');

function loadApp(web3Provider, address) {
  const legacyOptions = {
    defaultBlock: 'latest'
  }

  const newOptions = {
    defaultAccount: address,
    defaultBlock: 'latest',
    defaultGas: 1,
    defaultGasPrice: 0,
    transactionBlockTimeout: 50,
    transactionConfirmationBlocks: 1,
    transactionPollingTimeout: 480,
  }

  const _options = !address ? newOptions : legacyOptions

  const web3 = new Web3(web3Provider, null, _options);
  window.web3 = web3

  const getNodeInfo = function (error, result) {
    if (!error) {
      $("#api").html(web3.version);
      $("#node").html(result);
      console.log("TCL: getNodeInfo -> web3", web3)
    } else {
      console.error(error);
    }
  }

  const getChainID = function (error, result) {
    if (!error) {
      $("#network").html(result);
    } else {
      console.error(error);
    }
  }

  const getEthereum = function (error, result) {
    if (!error) {
      $("#ethereum").html(result);
    } else {
      console.error(error);
    }
  }

  const getPeerCount = function (error, result) {
    if (!error) {
      $("#peer-count").html(result);
    } else {
      console.error(error);
    }
  }

  if (address) {
    web3.eth.getNodeInfo(getNodeInfo);
    web3.eth.getChainId(getChainID);
    web3.eth.requestAccounts().then(accounts => {
      $("#account").html(accounts[0]);
    });
    web3.eth.net.getPeerCount(getPeerCount);
  } else {
    // legacy calls
    web3.version.getNode(getNodeInfo);
    web3.version.getNetwork(getChainID);
    web3.version.getEthereum(getEthereum);
    web3.net.getPeerCount(getPeerCount);
  }


  web3.eth.getGasPrice(function (error, result) {
    if (!error) {
      $("#gas-price").html(result.toString(10));
    } else {
      console.error(error);
    }
  });

  web3.eth.getBlockNumber(function (error, result) {
    if (!error) {
      $("#block-number").html(result);
    } else {
      console.error(error);
    }
  });
  setUIEvents()
}

const setUIEvents = function () {
  $('#button').click(function (event) {
    web3AuthFrontEnd.signIn();
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
}

window.addEventListener('load', function () {
  let web3Provider = null
  // Modern dapp browsers...
  if (window.ethereum) {
    web3Provider = window.ethereum;

    try {
      // Request account access
      window.ethereum.enable().then(address => {
        console.log("Using address:", address)
        window.metaMaskCoinbase = address
        loadApp(web3Provider, address)
      }).catch(error => {
        console.log("Metamask .enable() error: ", error)
      })
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  } else if (window.web3) {
    // Legacy dapp browsers...
    web3Provider = window.web3.currentProvider;
    loadApp(web3Provider)
  } else {
    // If no injected web3 instance is detected, fall back to Ganache
    web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    loadApp(web3Provider)
  }


});
