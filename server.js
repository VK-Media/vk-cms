const debug = require('debug')
const cookieParser = require('cookie-parser')
const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const path = require('path')
const i18n = require('i18n')
const http = require('http')
const mongoose = require('mongoose');

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// configure localization
i18n.configure({
    locales: ['en', 'da'],
    directory: path.join(__dirname, 'locales')
})

const url = 'mongodb+srv://codeUser:Dihk9KlcDUeRvSTb@development-vjgii.mongodb.net/test?retryWrites=true';
mongoose.connect(url, { useNewUrlParser: true });

app.use(i18n.init)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

const port = process.env.PORT || 3000

app.set('port', port)

const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function onError(error) {
  if (error.syscall !== 'listen') throw error

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port

    debug('vk-cms:server')('Listening on ' + bind)
}
