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

module.exports.get = function(req,res) {
  var library = req.swagger.params.library.value;
  if(!library) return res.status(400).send("Specify a Library to retrieve from.");
  return req.registry.get(library, req, res);
}

module.exports.delete = function(req,res) {
  var library = req.swagger.params.library.value;
  if(!library) return res.status(400).send("Specify a Library to delete from.");
  return req.registry.delete(library, req, res);
}