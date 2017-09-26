"use strict";

class SocketServer {
    constructor(io) {
        this.io = io;
        
        this.io.on('connection', socket => {
            console.log('a user connected');
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });
        
            socket.on('matchup', matchup => {
                socket.broadcast.emit('matchup', matchup);
            });
        
            socket.on('minimap', minimap => {
                socket.broadcast.emit('minimap', minimap);
            })
        });
    }
}

module.exports = SocketServer;