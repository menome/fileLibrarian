/**
 * WebDAV Librarian.
 */
var createClient = require('webdav');
var PluginCatalog = require('../PluginCatalog');

function WebDavPlugin({host,username,password}) {
  if(!host || !username || !password) throw new Error("Invalid config for webdav.")
  this.client = createClient(host,username,password);
  

  this.get = function(req,res) {
    var dataStream = this.client.createReadStream(req.query.path)
    
    dataStream.on('data', function(chunk) {
      res.write(chunk);
    })
  
    dataStream.on('end', function() {
      res.send();
    })
  
    dataStream.on('error', function(err) {
      res.status(500).send(err.toString());
    })
  }

  this.delete = function(req,res) {
    this.client.deleteFile(req.query.path).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      res.status(500).send(err.toString());
    })
  }
}

PluginCatalog.register('webdav', WebDavPlugin);

module.exports = WebDavPlugin;