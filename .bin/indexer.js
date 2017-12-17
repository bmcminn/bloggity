// const _db           = require('lowdb')
const bodyParser    = require('body-parser')
const consolidate   = require('consolidate')
const Express       = require('express')
const faker         = require('faker')
const fs            = require('fs')
const lowdbApi      = require('lowdb-api')
const MDit          = require('markdown-it')
const path          = require('path')
// const prism         = require('prismjs')
const Promise       = require('bluebird')
const low           = require('lowdb')
const FileSync      = require('lowdb/adapters/FileSync')

const adapter       = new FileSync('db.json')
const db            = low(adapter)



// Set some defaults
db.defaults({ posts: [], user: {} })
  .write()


// Add a post
db.get('posts')
  .push({ id: 1, title: 'lowdb is awesome'})
  .write()


// Set a user using Lodash shorthand syntax
db.set('user.name', 'typicode')
  .write()





