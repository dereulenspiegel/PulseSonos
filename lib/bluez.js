"use strict";
var dbus = require("dbus-native");
var promise = require("promise");

var systemBus = dbus.systemBus();

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
  }
};