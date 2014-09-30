var Dispatcher = require("./dispatcher");

function bindActions(target, actions, dispatchBinder) {
  for (var key in actions) {
    if (actions.hasOwnProperty(key)) {
      if (typeof actions[key] === "function") {
        target[key] = actions[key].bind(dispatchBinder);
      } else if (typeof actions[key] === "object") {
        target[key] = {};
        bindActions(target[key], actions[key], dispatchBinder);
      }
    }
  }
}

var Flux = function(stores, actions) {
  var dispatcher = new Dispatcher(stores),
      dispatchBinder = {
        flux: this,
        dispatch: function(type, payload) {
          dispatcher.dispatch({type: type, payload: payload});
        }
      };

  this.dispatcher = dispatcher;
  this.actions = {};
  this.stores = {};

  bindActions(this.actions, actions, dispatchBinder);

  for (var key in stores) {
    if (stores.hasOwnProperty(key)) {
      this.addStore(key, stores[key]);
    }
  }
};

Flux.prototype.store = function(name) {
  return this.stores[name];
};

Flux.prototype.addStore = function(name, store) {
  if(name in this.stores) {
    throw new Error("A store keyed by '" + name + "' already exists");
  }
  store.flux = this;
  this.stores[name] = store;
};

module.exports = Flux;
