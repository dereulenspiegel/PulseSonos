"use strict";
var dbus = require("dbus-native");
var bluez = require("./bluez.js");
var promise = require("promise");

var capabilities = [
  "DisplayOnly",
  "DisplayYesNo",
  "KeyboardOnly",
  "NoInputNoOutput"
];

var agentInterface = {
  name: "org.bluez.Agent",
  methods: {
    Release: [],
    RequestPinCode: ["s", "o"],
    RequestPasskey: ["s", "u"],
    DisplayPasskey: ["o", "u", "u"],
    RequestConfirmation: ["o","u"],
    Authorize: ["o", "s"],
    ConfirmModeChange: ["s"],
    Cancel: []
  }
};
var defaultPinCode = 1234;
var defaultAgent = {
  Release: function() {
    console.log("Agent: Release called");
  },
  RequestPinCode: function() {
    console.log("Agent: RequestPinCode called");
    return ""+defaultPinCode;
  },
  RequestPasskey: function() {
    console.log("Agent: RequestPasskey called");
    return defaultPinCode;
  },
  DisplayPasskey: function() {
    console.log("Agent: DisplayPasskey called");
  },
  RequestConfirmation: function() {
    console.log("Agent: RequestConfirmation called");
    return null;
  },
  Authorize: function() {
    console.log("Agent: Authorize called");
    return null;
  },
  ConfirmModeChange: function() {
    console.log("Agent: ConfirmModeChange called");
    return null;
  },
  Cancel: function() { 
    console.log("Agent: Cancel called");
  }

};

var defaultCapability = "DisplayOnly";

function adapterReleaseSession(adapter) {
  adapter.ReleaseSession(function(err){
    if(err){
      console.log("Failed to release session: %j", err);
    } else {
      console.log("Released session again");
    }
  });
}

module.exports = {
  defaultAgent: defaultAgent,
  capabilities: capabilities,

  makeDefaultAdapterDiscoverable: function() {
    return new promise(function(resolve, reject){
      bluez.getDefaultAdapter().then(function(adapter){

        adapter.GetProperties(function(err, dict){
          if(err){
            console.log("Failed to get properties");
          } else {
            for(var x in dict){
              console.log("Name %j Value %j", x, dict[x]);
            }
          }
        });

        adapter.RequestSession(function(err){
          if(err){
            console.log("Failed to request session: %j", err);
          } else {
             adapter.SetProperty("DiscoverableTimeout", ["u", 0], function(err){
              if(err){
                console.log("Failed settinf discoverable timeout");
                adapterReleaseSession(adapter);
                reject(err);
                return;
              }
              adapter.SetProperty("Discoverable", ["b", true], function(err){
                if(err){
                  console.log("Failed setting discoverable");
                  adapterReleaseSession(adapter);
                  reject(err);
                  return;
                }
                adapter.SetProperty("PaireableTimeout", ["u", 300], function(err){
                  if(err){
                    console.log("Failed setting paireable timeout");
                    //adapterReleaseSession(adapter);
                    //reject(err);
                    //return;
                  }
                  adapter.SetProperty("Pairable", ["b", true], function(err){
                    if(err){
                      console.log("Failed setting paireable");
                      //adapterReleaseSession(adapter);
                      //reject(err);
                      //return;
                    }
                    adapterReleaseSession(adapter);
                    resolve(true);
                  });
                });
              });
            });
          }
        });
      }, function(error){
        reject(error);
      });
    });
  },

  registerAgent: function(agent, capability) {
    return new promise(function(resolve, reject){
      agent = agent || defaultAgent;
      capability = capability || defaultCapability;

      if(false){
        reject("Invalid capability");
      } else {
        var bus = dbus.systemBus();
        bus.requestName("de.akuz.pulsesonos", 0);
        bus.exportInterface(agent,"/de/akuz/pulsesonos/agent",agentInterface);

        bluez.getDefaultAdapter().then(function(adapter){
          adapter.RegisterAgent("/de/akuz/pulsesonos/agent", capability, function(err){
            if(err){
              reject(err);
            } else {
              resolve(true);
            }
          });
        }, function(error){
          reject(error);
        });
      }
    });
  }

};