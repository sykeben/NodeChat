// Modules.
const path = require('path')

// Config (Set "dbString" in the config to "false" if not using a DB).
const port = process.env.PORT || require('./config').port // If running on Heroku it will use the supplied port.
const dbString = process.env.DATABASE_URL || require('./config').dbString // If running on Heroku it will try to use the enviroment's DB string.

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

// Postgres DB (only if enabled).
if (dbString !== 'false') {

    app.get('/data/info', (req, res) => {
        res.send({
            dbString: '[disabled]'
        })
    })

}

// Starter.
app.set('view engine', 'ejs')
http.listen(port, () => console.log(`Listening on port ${port}.`))