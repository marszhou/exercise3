'use strict'

let fs = require('fs')
let http = require('http')

module.exports = function(app, config) {
  let server = http.createServer(app)
  server.listen((config && config.port) || 8080, function() {
    let address = server.address()
  })
  return server
}
