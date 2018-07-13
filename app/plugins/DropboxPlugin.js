

var PluginCatalog = require('../PluginCatalog');


function DropboxPlugin(accessToken) {
    require('isomorphic-fetch'); // or another library of choice.
    var Dropbox = require('dropbox').Dropbox;
    if (!accessToken) accessToken = 'czMGjLQPPtgAAAAAAAAHtIdM5Q_sS6QWKmNjHegqmO-fIKIL1kFMVoc93BPdnPhO';
    var dbx = new Dropbox(accessToken);

    

    //Get metadata function
    this.get = function(req,res) {
        dbx.fileRequestsGet({id:req.query.id})
        .then(function(dataStream) {

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

PluginCatalog.register('dropbox', DropboxPlugin);

module.exports = DropboxPlugin;