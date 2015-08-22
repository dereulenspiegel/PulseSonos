"use strict";
var bluez = require("./bluez.js");
var promise = require("promise");
var bus = require("./systembus.js");

bus.requestName("de.akuz.pulsesonos", 0, function(err){
  if(err){
    console.log("Error registering name: %j", err);
  }
});

bus.connection.on("message", function(msg){
  if(msg["interface"] === "org.bluez.Agent"){
    console.log("Bluetooth agent has been called. Path %j, Destination %j, Sender %j", msg.path, msg.destination, msg.sender);
  }
});

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
    RequestPinCode: ["o", "s"],
    RequestPasskey: ["o", "u"],
    DisplayPasskey: ["o", "u", "u"],
    RequestConfirmation: ["o","u"],
    Authorize: ["o", "s"],
    ConfirmModeChange: ["s"],
    Cancel: []
  },
  signals: {},
  properties: {}
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

module.exports = {
  defaultAgent: defaultAgent,
  capabilities: capabilities,

  makeDefaultAdapterDiscoverable: function() {
    return new promise(function(resolve, reject){
      bluez.getDefaultAdapter().then(function(adapter){
           adapter.SetProperty("DiscoverableTimeout", ["u", 0], function(err){
            if(err){
              console.log("Failed settinf discoverable timeout");
              reject(err);
              return;
            }
            adapter.SetProperty("Discoverable", ["b", true], function(err){
              if(err){
                console.log("Failed setting discoverable");
                reject(err);
                return;
              }
              adapter.SetProperty("PaireableTimeout", ["u", 300], function(err){
                if(err){
                  console.log("Failed setting paireable timeout");
                }
                adapter.SetProperty("Pairable", ["b", true], function(err){
                  if(err){
                    console.log("Failed setting paireable");
                  }
                  resolve(true);
              });
            });
          });
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
        bus.exportInterface(agent, "/de/akuz/pulsesonos/agent", agentInterface);

        setInterval(function(){
          bluez.getDefaultAdapter().then(function(adapter){
            adapter.RegisterAgent("/de/akuz/pulsesonos/agent", capability, function(err){
              if(err){
                reject(err);
              } else {
                adapter.RequestSession(function(error){
                  if(error){
                    console.log("Error when requesting session: %j", error);
                  }
                  resolve(true);
                });
              }
            });
          }, function(error){
            reject(error);
          });
        },1000);
      }
    });
  },

  unregisterAgent: function(){
    return new promise(function(resolve, reject){
      bluez.getDefaultAdapter().then(function(adapter){
        adapter.UnregisterAgent("/de/akuz/pulsesonos/agent", function(error){
          if(error){
            reject(error);
          } else {
            adapter.ReleaseSession(function(error){
              if(error){
                reject(error);
              } else {
                resolve(true);
              }
            });
          }
        });
      }, function(error){
        reject(error);
      });
    });
  }

};