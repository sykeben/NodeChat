// Modules.
const path = require('path')

// Config.
const config = require('./config.json')

// Servers.
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Pages.
app.get('/room/:id', (req, res) => res.render('../views/room', {room: req.params.id }) )
app.get('/', (req, res) => res.render('../views/home') )

// Chat IO management.
io.on('connection', function(socket){
    socket.on('chat sent', (msg) => {
        const parts = msg.split('\t')
        console.log(`[${parts[0]}: ${parts[1]}] ${parts[2]}`)
        io.emit(`chat echo: ${parts[0]}`, `${parts[1]}\t${parts[2]}`)
    })
})

// Starter.
app.set('view engine', 'ejs')
http.listen(config.port, () => console.log(`Listening on port ${config.port}.`))