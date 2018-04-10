# File Library

File Retrieval service for theLink.

This is the Library.
It has plugins for different backends. (Eg. WebDAV.)
Use config to register Librarians with plugins. Eg:

```json
{
  "librarianType": "webdav",
  "librarianKey": "localwebdav",
  "host": "http://localhost:8080/webfolders",
  "username": "user",
  "password": "password"
}
```