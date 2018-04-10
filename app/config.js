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
  fileLibrary: {
    jwtSecret: {
      doc: "The secret we use to verify JSON Web Tokens",
      format: "String",
      default: "nice web mister crack spider",
      env: "JWT_SECRET",
      sensitive: true
    }
  },
  librarians: {
    doc: "Array of librarians. Includes librarian type and whatever config params it needs.",
    default: [],
    format: function check(librarians) {
      librarians.forEach((librarian) => {
        if(typeof librarian.librarianType !== 'string') 
          throw new Error("Librarian must have librarianType property")
        if(typeof librarian.librarianKey !== 'string') 
          throw new Error("Librarian must have libraryKey property")
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