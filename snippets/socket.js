// ==== Server-side ====
// npm i socket.io

// ==== In server/index.js: ====
const socketio = require('socket.io')
const io = socketio(server)
require('./socket')(io)

// ==== In server/socket/index.js: ====
module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}


// ==== Client Side ====

// ==== In client/socket.js: ====
import io from 'socket.io-client'

// Will attempt to connect to the server at the same domain
const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Socket Connected!')
})

export default socket


// ==== In client/index.js ====
// Just importing this will set up the socket connection
import './socket'
