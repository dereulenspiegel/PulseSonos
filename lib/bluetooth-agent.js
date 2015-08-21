"use strict";

var bluez = require("./bluez.js");

var defaultAdapter = bluez.getDefaultAdapter().then(function(adapter){
  console.log("Received defaultAdapter");

  for(var prop in adapter){
    console.log("Adapter prop: %j", prop);
  }
},
function(error){
  console.log("Can't retrieve default adapter: %j",error);
});

module.exports = {
  registerAgent: function() {

  }

};