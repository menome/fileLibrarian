module.exports.swaggerDef = {
  "/file": {
    "x-swagger-router-controller": "file",
    "get": {
      "tags": [
        "Librarian"
      ],
      "parameters": [
        {
          "name": "path",
          "in": "query",
          "required": true,
          "description": "The uri of the file we're retrieving. Remember to escape any special characters.",
          "type": "string"
        },
        {
          "name": "library",
          "in": "query",
          "description": "The string identifying the Library we're retrieving from.",
          "required": true,
          "type": "string"
        }
      ],
      "responses": {
        "200": {
          "description": "Success"
        },
        "default": {
          "description": "Error"
        }
      }
    },
    "put": {
      "tags": [
        "Librarian"
      ],
      "parameters": [
        {
          "name": "path",
          "in": "query",
          "required": true,
          "description": "The path of the file we're uploading. Remember to escape any special characters.",
          "type": "string"
        },
        {
          "name": "library",
          "in": "query",
          "description": "The string identifying the Library we're uploading to.",
          "required": true,
          "type": "string"
        },
        {
          "name": "upfile",
          "in": "formData",
          "description": "The file to upload",
          "required": true,
          "type": "file"
        }
      ],
      "responses": {
        "200": {
          "description": "Success"
        },
        "default": {
          "description": "Error"
        }
      }
    },
    "post": {
      "tags": [
        "Librarian"
      ],
      "parameters": [
        {
          "name": "path",
          "in": "query",
          "required": true,
          "description": "The path of the file we're uploading. Remember to escape any special characters.",
          "type": "string"
        },
        {
          "name": "library",
          "in": "query",
          "description": "The string identifying the Library we're uploading to.",
          "required": true,
          "type": "string"
        },
        {
          "name": "upfile",
          "in": "formData",
          "description": "The file to upload",
          "required": true,
          "type": "file"
        }
      ],
      "responses": {
        "200": {
          "description": "Success"
        },
        "default": {
          "description": "Error"
        }
      }
    },
    "head": {
      "tags": [
        "Librarian"
      ],
      "parameters": [
        {
          "name": "path",
          "in": "query",
          "required": true,
          "description": "The uri of the file we're checking. Remember to escape any special characters.",
          "type": "string"
        },
        {
          "name": "library",
          "in": "query",
          "description": "The string identifying the Library we're checking.",
          "required": true,
          "type": "string"
        }
      ],
      "responses": {
        "200": {
          "description": "Success"
        },
        "default": {
          "description": "Error"
        }
      }
    },
    "delete": {
      "tags": [
        "Librarian"
      ],
      "parameters": [
        {
          "name": "path",
          "in": "query",
          "required": true,
          "description": "The uri of the file we're deleting. Remember to escape any special characters.",
          "type": "string"
        },
        {
          "name": "library",
          "in": "query",
          "description": "The string identifying the Library we're deleting from.",
          "required": true,
          "type": "string"
        }
      ],
      "responses": {
        "200": {
          "description": "Success"
        },
        "default": {
          "description": "Error"
        }
      }
    }
  }
}

const util = require('util');

module.exports.get = function(req,res) {
  req.bot.logger.info(util.format("Getting file %s from store %s", req.swagger.params.path.value,req.swagger.params.library.value),{method: "get", library:req.swagger.params.library.value,file:req.swagger.params.path.value})
  let fileName = req.swagger.params.path.value.substring(req.swagger.params.path.value.lastIndexOf('/')+1);
  res.set("Content-Disposition", 'inline; filename="'+fileName+'"');
  var library = req.swagger.params.library.value;
  if(!library) return res.status(400).send("Specify a Library to retrieve from.");
  return req.registry.get(library, req, res);
}

module.exports.head = function(req,res) {
  req.bot.logger.info(util.format("Checking file %s from store %s", req.swagger.params.path.value,req.swagger.params.library.value),{method: "head", library:req.swagger.params.library.value,file:req.swagger.params.path.value})
  var library = req.swagger.params.library.value;
  if(!library) return res.status(400).send("Specify a Library to check.");
  return req.registry.head(library, req, res);
}

module.exports.put = function(req,res) {
  req.bot.logger.info(util.format("Uploading file %s to store %s", req.swagger.params.path.value,req.swagger.params.library.value),{method: "put", library:req.swagger.params.library.value,file:req.swagger.params.path.value})
  var library = req.swagger.params.library.value;
  if(!library) return res.status(400).send("Specify a Library to put.");
  return req.registry.put(library, req, res);
}

module.exports.post = function(req,res) {
  req.bot.logger.info(util.format("Uploading file %s to store %s", req.swagger.params.path.value,req.swagger.params.library.value),{method: "post", library:req.swagger.params.library.value,file:req.swagger.params.path.value})
  var library = req.swagger.params.library.value;
  if(!library) return res.status(400).send("Specify a Library to post.");
  return req.registry.post(library, req, res);
}

module.exports.delete = function(req,res) {
  req.bot.logger.info(util.format("Deleting file %s from store %s", req.swagger.params.path.value,req.swagger.params.library.value),{method: "delete", library:req.swagger.params.library.value,file:req.swagger.params.path.value})
  var library = req.swagger.params.library.value;
  if(!library) return res.status(400).send("Specify a Library to delete from.");
  return req.registry.delete(library, req, res);
}
