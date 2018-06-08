/**
 * Authentication Middleware
 */
const BasicStrategy = require('passport-http').BasicStrategy;
const PassportJwt = require('passport-jwt');
const passport = require('passport');

// Set up middleware
function setup(bot) {
  // Configure basic auth strategy
  passport.use(new BasicStrategy((username, password, done) => {
    if(username === bot.config.get("librarian.user") && password === bot.config.get("librarian.password"))
      return done(null, username);
  }));

  // Configure JWT strategy
  passport.use(new PassportJwt.Strategy({
    jwtFromRequest: PassportJwt.ExtractJwt.fromExtractors([
      (req) => {
        var token = null;
        if(req.query.token) token = req.query.token;
        else if(req.get('Token')) token = req.get('Token');
        return token;
      }
    ]),
    secretOrKey: bot.config.get("librarian.jwtSecret")
  }, (token, done) => {
    return done(null, token.user)
  }));

  // Add the middleware to the relevant endpoints.
  bot.web.use(passport.initialize())
  bot.web.use("/retrieve", passport.authenticate(['basic','jwt'], {session: false}));
  bot.web.use("/file", passport.authenticate(['basic','jwt'], {session: false}));
}

module.exports = {
  setup
}
