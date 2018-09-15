/**
 * WebDAV Librarian.
 */
var PluginCatalog = require('../PluginCatalog');
var Minio = require('minio')

function MinioPlugin({host,port,useSSL,accesskey,secretkey}) {
  if(!host || !accesskey || !secretkey) throw new Error("Invalid config for Minio.")

  this.client = new Minio.Client({
    endPoint: host,
    port: port || 9000,
    useSSL: useSSL || false,
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

  this.post = function(req,res) {
    var path = req.query.path;
    var fileName = path.substring(path.indexOf('/')+1);
    var bucket = path.substring(0,path.indexOf('/'));
    
    return this.client.putObject(bucket, fileName, req.swagger.params.upfile.value.buffer, req.swagger.params.upfile.value.size).then((etag) => {
      return res.status(201).send(JSON.stringify({
        message: "Uploaded",
        etag
      }))
    }).catch((err) => {
      return res.status(500).send(err.toString());
    })
  }

  this.head = function(req,res) {
    // Get bucket name out of path
    var path = req.query.path;
    var fileName = path.substring(path.indexOf('/'));
    var bucket = path.substring(0,path.indexOf('/'));
    
    this.client.statObject(bucket, fileName).then((stat) => {
      res.set("Content-Length", stat.size).status(200).send();
    }).catch((err) => {
      if(err.code === 'NotFound') return res.sendStatus(404);
      return res.sendStatus(500);
    })
  }
}

PluginCatalog.register('minio', MinioPlugin);

module.exports = MinioPlugin;
