const path = require('path')
const glob = require('glob')
const electron = require('electron')

const BrowserWindow = electron.BrowserWindow
const app = electron.app

const debug = true

if (process.mas) app.setName('Android Helper')

var mainWindow = null

function initialize () {
  var shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  function createWindow () {
    var windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName()
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      require('devtron').install()
    }

    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }

  app.on('ready', function () {
    createWindow()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    break
  case '--squirrel-uninstall':
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    initialize()
}
