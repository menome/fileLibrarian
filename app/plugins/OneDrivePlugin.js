/**
 * Onedrive Librarian.
 */
var oneDriveAPI = require('onedrive-api');
var PluginCatalog = require('../PluginCatalog');


function OneDrivePlugin(clientId, accessToken) {
    if(!accessToken) throw new Error("Invalid config for onedrive.")
    
    function initialize(clientId, scope){
      var options = {
        uri: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize" + 
        "?client_id=" + clientId +
        "&scope=" + scope + 
        "&response_type=code",

        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
      }
      rp.get(options)
      .then(function(response) {
          console.log(response)
      })
      .catch(function(err) {
          console.error(err.toString());
      })
    }
    accessToken=initialize(clientId, scope);


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
          itemId: req.query.path
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