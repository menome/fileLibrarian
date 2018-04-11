/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Configuration for the bot
 */
"use strict";
var convict = require('convict');
var fs = require('fs');
var bot = require('@menome/botframework')

// Define a schema
var config = convict({
  port: bot.configSchema.port,
  logging: bot.configSchema.logging,
  librarian: {
    jwtSecret: {
      doc: "The secret we use to verify JSON Web Tokens",
      format: "String",
      default: "nice web mister crack spider",
      env: "JWT_SECRET",
      sensitive: true
    }
  },
  connections: {
    doc: "Array of librarians. Includes librarian type and whatever config params it needs.",
    default: [],
    format: function check(librarians) {
      librarians.forEach((librarian) => {
        if(typeof librarian.connection_type !== 'string') 
          throw new Error("Librarian must have connection_type property")
        if(typeof librarian.connection_libraryname !== 'string') 
          throw new Error("Librarian must have connection_libraryname property")
      })
    }
  }
});

// Load from file.
if (fs.existsSync('./config/config.json')) {
  config.loadFile('./config/config.json');
  config.validate();
}

// Validate the config.
config.validate({allowed: 'strict'});

module.exports = config;