# File Librarian

File Retrieval service for theLink.

This is the Librarian.
It has plugins for different backends. (Eg. WebDAV.)
Use config to register connections that use plugins as backends. Eg:

```json
{
  "connection_type": "webdav",
  "connection_libraryname": "sambadav",
  "host": "http://localhost:8080/webdav",
  "username": "user",
  "password": "pass"
}
```