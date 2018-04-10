/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Bot entrypoint. Initialize, configure, create HTTP endpoints, etc.
 */
"use strict";
var bot = require('@menome/botframework')
var config = require('./config.js');
var WebDavLibrarian = require('./plugins/WebDavLibrarian');
var LibrarianRegistry = require('./LibrarianRegistry');
var Authenticate = require('./auth');
var PluginCatalog = require('./PluginCatalog');

// We only need to do this once. Bot is a singleton.
bot.configure({
  name: "File Library",
  desc: "File Retrieval Service for theLink",
  logging: config.get('logging'),
  port: config.get('port')
});

var thisRegistry = new LibrarianRegistry();

config.get('librarians').forEach((librarian) => {
  var thisLibObject = new PluginCatalog.plugins[librarian.librarianType]({...librarian});
  thisRegistry.register(librarian.librarianKey,thisLibObject);
})

// Register our sync endpoint.
bot.registerEndpoint({
  "name": "Get Object",
  "path": "/retrieve",
  "method": "GET",
  "desc": "Attempts to pull a file for this instance.",
  "params": [
    {
      "name": "path",
      "desc": "The uri of the file we're retrieving. Remember to escape any special characters."
    },
    {
      "name": "library",
      "desc": "The string identifying the Library we're retrieving from."
    }
  ]
}, function(req,res) {
  Authenticate(req,res, function(req,res) {
    var library = req.query.library;
    if(!library) return res.status(400).send("Specify a Library to retrieve from.");
    return thisRegistry.get(library, req, res);
  })
});

// Start the bot.
bot.start();
bot.changeState({state: "idle"})