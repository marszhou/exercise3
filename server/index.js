'use strict'

require("babel-core/register");
require("babel-polyfill");
const getHttpServer = require('./utils/get-http-server')
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const multipart = require('connect-multiparty')();
const fs = require('fs')

let httpServer = getHttpServer(app)

app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method'
  )
  next()
})

app.get('/', (req, res)=> {
  res.json('OK')
})

function getPath(tempath) {
  const dirpath = '/uploads/'
  const filename = path.basename(tempath)
  const uploadPath = path.join(__dirname, '../public' , dirpath, filename)

  return {
    urlPath: dirpath + filename,
    filePath: uploadPath
  }
}

app.put('/upload', multipart, (req, res) => {
  const {images} = req.files
  const result = []
  for(let i=0; i<images.length; i++) {
    const image = images[i]
    const {filePath: destPath, urlPath} = getPath(image.path)
    fs.copyFileSync(image.path, destPath)
    fs.unlinkSync(image.path)
    result.push(urlPath)
  }

  res.json(result)
})