module.exports = {
  librarian: {
    jwtSecret: {
      doc: "The secret we use to verify JSON Web Tokens",
      format: "String",
      default: "nice web mister crack spider",
      env: "JWT_SECRET",
      sensitive: true
    }
  },
  connections: {
    doc: "Array of librarians. Includes librarian type and whatever config params it needs.",
    default: [],
    format: function check(librarians) {
      librarians.forEach((librarian) => {
        if(typeof librarian.connection_type !== 'string') 
          throw new Error("Librarian must have connection_type property")
        if(typeof librarian.connection_libraryname !== 'string') 
          throw new Error("Librarian must have connection_libraryname property")
      })
    }
  }
}