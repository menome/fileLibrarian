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

  // Allow for CORS.
  // NOTE: We allow from any origin. This is because we require a signed Auth token with a limited lifespan to do anything.
  var thisOrigin = req.get("Origin");
  res.setHeader('Access-Control-Allow-Origin', thisOrigin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if(req.method === 'OPTIONS')
    return res.sendStatus(200);
  else
    return next();
});

// Set up our security middleware.
Authenticate.setup(bot);
bot.registerControllers(path.join(__dirname+"/controllers"));

bot.start();
bot.changeState({state: "idle"});