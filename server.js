var express = require('express');
var app = express();

app.use(express.static('public'));

var http = require('http');
var server = http.createServer(app);

var io = require('socket.io')(server);

var randomHex = require('random-hex');


var cursors = [];

io.on('connection', function(socket){
    console.log('A new client has connected - ' + socket.id);
    io.to(socket.id).emit('generatedId', socket.id);
    cursors.push({
        // x: Math.round(Math.random() * 800),
        // y: Math.round(Math.random() * 500),
        color: randomHex.generate(),
        id: socket.id
    })
    io.emit('updatedCursorList', cursors);
    socket.on('movedCursor', (cursorData) => {
        for(var i = 0; i< cursors.length; i++){
            if (cursors[i].id == socket.id) {
                cursors[i].x = cursorData.x;
                cursors[i].y = cursorData.y;
                io.emit('updatedCursorList', cursors);
                break;
            }
        }
    })
    socket.on('disconnect', function(){
        for(var i = 0; i< cursors.length; i++){
            if (cursors[i].id == socket.id) {
                cursors.splice(i, 1);
                io.emit('updatedCursorList', cursors);
                break;
            }
        }
    })
})

server.listen(3000, function(){
    console.log('Server is running at http://localhost:3000');
})