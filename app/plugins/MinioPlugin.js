/**
 * WebDAV Librarian.
 */
var config = require('../config.js');
var PluginCatalog = require('../PluginCatalog');
var Minio = require('minio')

function MinioLibrarian({host,port,secure,accesskey,secretkey}) {
  if(!host || !accesskey || !secretkey) throw new Error("Invalid config for Minio.")

  this.client = new Minio.Client({
    endPoint: host,
    port: port || 9000,
    secure: secure || false,
    accessKey: accesskey,
    secretKey: secretkey
  });
  
  this.get = function(req,res) {
    // Get bucket name out of path
    var path = req.query.path;
    var fileName = path.substring(path.indexOf('/'));
    var bucket = path.substring(0,path.indexOf('/'));

    this.client.getObject(bucket, fileName).then((dataStream) => {
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
      if(err.code === 'NotFound') return res.status(404).send(err.toString());
      return res.status(500).send(err.toString());
    })
  }
}

PluginCatalog.register('minio', MinioLibrarian);

module.exports = MinioLibrarian;
