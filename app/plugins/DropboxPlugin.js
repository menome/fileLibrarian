

var PluginCatalog = require('../PluginCatalog');


function DropboxPlugin(accessToken) {
    require('isomorphic-fetch'); // or another library of choice.
    var Dropbox = require('dropbox').Dropbox;
    if (!accessToken) accessToken = 'czMGjLQPPtgAAAAAAAAHtIdM5Q_sS6QWKmNjHegqmO-fIKIL1kFMVoc93BPdnPhO';
    var dbx = new Dropbox(accessToken);

    

    //Get metadata function
    this.get = function(req,res) {
        dbx.fileRequestsGet({id:req.query.id})
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
}

PluginCatalog.register('dropbox', DropboxPlugin);

module.exports = DropboxPlugin;