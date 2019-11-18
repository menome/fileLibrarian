/**
 * WebDAV Librarian.
 */
var createClient = require('webdav');
var PluginCatalog = require('../PluginCatalog');

function WebDavPlugin({host,username,password}) {
  if(!host || !username || !password) throw new Error("Invalid config for webdav.")
  this.client = createClient(host,username,password);
  
  this.get = function(req,res) {
    return this.client.stat(req.query.path).then(() => {
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
    }).catch((err) => {
      res.status(err.status);

      if(err.status === 404) {
        return res.json({message: "File not found.", expected_path: req.query.path})
      }
      else
        res.send();
    })
  }

  this.post = async function(req,res) {
    var path = req.query.path;
    let dirPath = req.query.path.substring(0,req.query.path.lastIndexOf('/'));
    await this.client.createDirectory(dirPath).catch((err) => {
    })
    return  this.client.putFileContents(path, req.swagger.params.upfile.value.buffer).then((upResult) => {
      return res.status(201).send(JSON.stringify({
        message: "Uploaded",
        upResult
      }));
    }).catch((err) => {
      return res.status(500).send(err.toString());
    })
  }

  this.put = this.post;

  this.head = function(req,res) {
    return this.client.stat(req.query.path).then((statResult) => {
      res.set("Content-Length", statResult.size).status(200).send();
    }).catch((err) => {
      res.sendStatus(err.status)
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