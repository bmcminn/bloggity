const gruntFS   = require('grunt').file
const nodeFS    = require('fs')

const fs        = {}


fs.copy                     = gruntFS.copy
fs.delete                   = gruntFS.delete
// fs.exists                   = gruntFS.exists
fs.expand                   = gruntFS.expand
fs.isDir                    = gruntFS.isDir
fs.isFile                   = gruntFS.isFile
fs.isLink                   = gruntFS.isLink
fs.match                    = gruntFS.match
// fs.mkdir                    = gruntFS.mkdir
fs.read                     = gruntFS.read
fs.readJSON                 = gruntFS.readJSON
fs.readYAML                 = gruntFS.readYAML
fs.recurse                  = gruntFS.recurse
fs.write                    = gruntFS.write


// Map Node FS sync methods
fs.access                   = nodeFS.accessSync
fs.appendFile               = nodeFS.appendFileSync
fs.chmod                    = nodeFS.chmodSync
fs.chown                    = nodeFS.chownSync
fs.close                    = nodeFS.closeSync
fs.copyFile                 = nodeFS.copyFileSync
fs.exists                   = nodeFS.existsSync
fs.fchmod                   = nodeFS.fchmodSync
fs.fchown                   = nodeFS.fchownSync
fs.fdatasync                = nodeFS.fdatasyncSync
fs.fstat                    = nodeFS.fstatSync
fs.fsync                    = nodeFS.fsyncSync
fs.ftruncate                = nodeFS.ftruncateSync
fs.futimes                  = nodeFS.futimesSync
fs.lchmod                   = nodeFS.lchmodSync
fs.lchown                   = nodeFS.lchownSync
fs.link                     = nodeFS.linkSync
fs.lstat                    = nodeFS.lstatSync
fs.mkdir                    = nodeFS.mkdirSync
fs.mkdtemp                  = nodeFS.mkdtempSync
fs.open                     = nodeFS.openSync
fs.readdir                  = nodeFS.readdirSync
fs.readFile                 = nodeFS.readFileSync
fs.readlink                 = nodeFS.readlinkSync
// fs.read                     = nodeFS.readSync  // TODO: note file stream methods and store them accordingly
fs.realpath                 = nodeFS.realpathSync
fs.rename                   = nodeFS.renameSync
fs.rmdir                    = nodeFS.rmdirSync
fs.stat                     = nodeFS.statSync
fs.symlink                  = nodeFS.symlinkSync
fs.truncate                 = nodeFS.truncateSync
fs.unlink                   = nodeFS.unlinkSync
fs.utimes                   = nodeFS.utimesSync
fs.writeFile                = nodeFS.writeFileSync
// fs.write                    = nodeFS.writeSync  // TODO: note file stream methods and store them accordingly
// fs.realpathSync.native      = nodeFS.realpathSync.native


fs.async = {}

fs.async.access             = nodeFS.access
fs.async.appendFile         = nodeFS.appendFile
fs.async.chmod              = nodeFS.chmod
fs.async.chown              = nodeFS.chown
fs.async.close              = nodeFS.close
fs.async.constants          = nodeFS.constants
fs.async.copyFile           = nodeFS.copyFile
fs.async.createReadStream   = nodeFS.createReadStream
fs.async.createWriteStream  = nodeFS.createWriteStream
fs.async.exists             = nodeFS.exists
fs.async.fchmod             = nodeFS.fchmod
fs.async.fchown             = nodeFS.fchown
fs.async.fdatasync          = nodeFS.fdatasync
fs.async.fstat              = nodeFS.fstat
fs.async.fsync              = nodeFS.fsync
fs.async.ftruncate          = nodeFS.ftruncate
fs.async.futimes            = nodeFS.futimes
fs.async.lchmod             = nodeFS.lchmod
fs.async.lchown             = nodeFS.lchown
fs.async.link               = nodeFS.link
fs.async.lstat              = nodeFS.lstat
fs.async.mkdir              = nodeFS.mkdir
fs.async.mkdtemp            = nodeFS.mkdtemp
fs.async.open               = nodeFS.open
fs.async.read               = nodeFS.read
fs.async.readdir            = nodeFS.readdir
fs.async.readFile           = nodeFS.readFile
fs.async.readlink           = nodeFS.readlink
fs.async.realpath           = nodeFS.realpath
fs.async.realpath.native    = nodeFS.realpath.native
fs.async.rename             = nodeFS.rename
fs.async.rmdir              = nodeFS.rmdir
fs.async.stat               = nodeFS.stat
fs.async.symlink            = nodeFS.symlink
fs.async.truncate           = nodeFS.truncate
fs.async.unlink             = nodeFS.unlink
fs.async.unwatchFile        = nodeFS.unwatchFile
fs.async.utimes             = nodeFS.utimes
fs.async.watch              = nodeFS.watch
fs.async.watchFile          = nodeFS.watchFile
fs.async.write              = nodeFS.write
fs.async.write              = nodeFS.write
fs.async.writeFile          = nodeFS.writeFile



// TODO: fs.constants? -- https://nodejs.org/api/fs.html#fs_fs_constants_1



module.exports = fs
