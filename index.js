const _db           = require('lowdb')
const bodyParser    = require('body-parser')
const consolidate   = require('consolidate')
const Express       = require('express')
const faker         = require('faker')
const fs            = require('fs')
const lowdbApi      = require('lowdb-api')
const MDit          = require('markdown-it')
const path          = require('path')
const prism         = require('prismjs')
const Promise       = require('bluebird')



const app           = express()
const dbFilepath    = path.join(__dirname, './data/db.json')
const options       = {}


app.use(bodyParser.json())
app.use(lowdbApi(dbFilepath, options))


