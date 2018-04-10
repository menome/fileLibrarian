/**
 * Keeps a list of registered libraries.
 * 
 * Each librarian has a string key, and a Librarian object that implements a few functions.
 */

function LibrarianRegistry() {
  this.librarians = {};

  this.register = function(key,librarian) {
    this.librarians[key] = librarian;
  }

  this.get = function(key, req, res) {
    if(!this.librarians.hasOwnProperty(key)) throw new Error("No Librarian with key "+key);
    return this.librarians[key].get(req,res)
  }
}

module.exports = LibrarianRegistry;