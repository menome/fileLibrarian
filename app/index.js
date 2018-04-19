/**
 * The Bot Itself
 */
"use strict";
const path = require("path")
const fs = require("fs");
const Bot = require('@menome/botframework')
const Authenticate = require('./auth');
const config = require("../config/config.json")
const configSchema = require("./config-schema")
const ConnectionRegistry = require('./ConnectionRegistry');
const PluginCatalog = require('./PluginCatalog');

// Loader for controllers
var paths = { }
var normalizedPath = path.join(__dirname, "controllers");
fs.readdirSync(normalizedPath).forEach(function(file) {
  paths = Object.assign(paths,require("./controllers/" + file).swaggerDef);
});

// Loader for Library plugins.
var normalizedPath = path.join(__dirname, "plugins");
fs.readdirSync(normalizedPath).forEach(function(file) {
  require("./plugins/" + file);
});

// Start the actual bot here.
var bot = new Bot({config, configSchema});

var thisRegistry = new ConnectionRegistry();
bot.config.get('connections').forEach((connection) => {
  var thisConnection = new PluginCatalog.plugins[connection.connection_type]({...connection});
  thisRegistry.register(connection.connection_libraryname,thisConnection);
})

// Let our middleware use these.
bot.web.use((req,res,next) => {
  req.registry = thisRegistry;
  next();
});

// Set up our security middleware.
bot.web.use("/retrieve", Authenticate.bind(this,bot.config));

bot.registerPaths(paths,__dirname+"/controllers");

bot.start();
bot.changeState({state: "idle"});