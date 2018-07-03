/**
 * Onedrive Librarian.
 */
var oneDriveAPI = require('onedrive-api');
var PluginCatalog = require('../PluginCatalog');


function OneDrivePlugin(accessToken) {
    if(!accessToken) throw new Error("Invalid config for onedrive.")
    
    //Get metadata function
    this.get = function(req,res) {
        return oneDriveAPI.items.getMetadata({
            accessToken: accessToken,
            itemId: req.query.path
          }).then((item) => {
            console.log(item);
            res.sendStatus(200);
          }).catch((err) => {
            res.status(500).send(err.toString());
          })
      }

      //Delete function
      this.delete = function(req,res){
        oneDriveAPI.items.delete({
            accessToken: accessToken,
            itemId: req.query.path
          }).then(() => {
            res.sendStatus(200);
          }).catch((err) => {
            res.status(500).send(err.toString());
          })
      }
      
      //download function
      this.dowload = function(req,res){
        fileStream = oneDriveAPI.items.download({
          accessToken: accessToken,
          itemId: req.query.id
        });

        fileStream.on('data', function(chunk) {
          res.write(chunk);
        })
      
        fileStream.on('end', function() {
          res.send();
        })
      
        fileStream.on('error', function(err) {
          res.status(500).send(err.toString());
        })
      }

      //simple upload function
      this.upload = function(req,res){
        oneDriveAPI.items.uploadSimple({
          accessToken: accessToken,
          filename: req.query.filename,
          readableStream: req.query.readableStream
        }).then((item) => {
          console.log(item);
          res.sendStatus(200);
        }).catch((err) => {
          res.status(500).send(err.toString());
        })
      }
}

PluginCatalog.register('onedrive', OneDrivePlugin);

module.exports = OneDrivePlugin;