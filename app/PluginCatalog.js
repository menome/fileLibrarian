/**
 * Manages plugins.
 */

function PluginCatalog() {
  this.plugins = {};

  this.register = function(key,plugin) {
    this.plugins[key] = plugin;
  }
}

module.exports = new PluginCatalog();
