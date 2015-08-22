"use strict";
var promise = require("promise");
var systemBus = require("./systembus.js");
var bluezService = systemBus.getService("org.bluez");

module.exports = {
  getDefaultAdapter: function() {
    return new promise(function(resolve, reject){
      bluezService.getInterface("/", "org.bluez.Manager", function (err, manager){
        if(err){
          reject(err);
          return;
        } else {
          manager.DefaultAdapter(function(err, adapterPath){
            if(err){
              reject(err);
              return;
            } else {
              bluezService.getInterface(adapterPath,"org.bluez.Adapter", function(err, adapter){
                if(err){
                  reject(err);
                  return;
                } else {
                  resolve(adapter);
                }
              });
            }
          });
        }
      });
    });
  },

  getDeviceObject: function(devicePath) {
    return new promise(function(resolve, reject){
      bluezService.getInterface(devicePath,"org.bluez.Device", function(err, device){
        if(err){
          reject(err);
        } else {
          resolve(device);
        }
      });
    });
  }
};