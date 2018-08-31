/**
 * Keeps a list of registered connections.
 * 
 * Each librarian has a string key, and a Librarian object that implements a few functions.
 */

function ConnectionRegistry() {
  this.librarians = {};

  this.register = function(key,librarian) {
    this.librarians[key] = librarian;
  }

  this.get = function(key, req, res) {
    if(!this.librarians.hasOwnProperty(key)) throw new Error("No Librarian with key "+key);
    if(typeof this.librarians[key].get !== 'function') throw new Error("Librarian has no defined 'get' function.");
    return this.librarians[key].get(req,res)
  }

  this.head = function(key, req, res) {
    if(!this.librarians.hasOwnProperty(key)) throw new Error("No Librarian with key "+key);
    if(typeof this.librarians[key].head !== 'function') throw new Error("Librarian has no defined 'head' function.");
    return this.librarians[key].head(req,res)
  }

  this.delete = function(key, req, res) {
    if(!this.librarians.hasOwnProperty(key)) throw new Error("No Librarian with key "+key);
    if(typeof this.librarians[key].delete !== 'function') throw new Error("Librarian has no defined 'delete' function.");
    return this.librarians[key].delete(req,res)
  }

  this.post = function(key, req, res) {
    if(!this.librarians.hasOwnProperty(key)) throw new Error("No Librarian with key "+key);
    if(typeof this.librarians[key].post !== 'function') throw new Error("Librarian has no defined 'post' function.");
    return this.librarians[key].post(req,res)
  }

  this.put = function(key, req, res) {
    if(!this.librarians.hasOwnProperty(key)) throw new Error("No Librarian with key "+key);
    if(typeof this.librarians[key].put !== 'function') throw new Error("Librarian has no defined 'put' function.");
    return this.librarians[key].put(req,res)
  }
}

module.exports = ConnectionRegistry;