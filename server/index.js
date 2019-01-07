const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')

const app = express()
const PORT = process.env.PORT || 8080

function startServer() {
  // Logging
  app.use(morgan('dev'))
  // Body parsing
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))
  // Compression
  app.use(compression())
  // Server static files
  app.use(express.static(path.join(__dirname, '..', 'public')))
  // Send an error for file requests when the file is not available
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not Found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // Serve the index.html by default
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  // Error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })

  const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
}

startServer()
