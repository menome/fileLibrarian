/**
 * Authentication Middleware
 */
var config = require('./config.js');
var jwt = require('jsonwebtoken');

function Authenticate(req,res,next) {
  var token = req.query.token;
  if(!token) token = req.get('Token')
  if(!token) return res.status(400).send("Missing JWT Token in 'Token' Header or 'token' query param.");

  jwt.verify(token,config.get('librarian.jwtSecret'), function(err, decoded) {
    if(err) return res.status(400).send("Failed to verify Token");
    return next(req, res);
  });
}

module.exports = Authenticate;
