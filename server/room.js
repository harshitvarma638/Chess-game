const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
app.use(cors());
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);

function generateRandomID(length){
    let result = '';
    const characters = 'ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for( let i=0;i<length;i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const timestamp = new Date().getTime();
    return result + timestamp;
}

const MAX_PLAYERS_ALLOWED = 3;
const rooms = [];

io.on('connection', (socket) => {
    socket.on('createRoom', () => {
        const roomID = generateRandomID(8);
        rooms.push({
            roomID,
            players: [socket.id],
        });
        socket.join(roomID);
        socket.emit('room-created', { roomID });
    });
    
    socket.on('joinRoom', (data) => {
        const room = rooms.find(room => room.roomID === data.roomId);
        if (room) {
            if (room.players.length < MAX_PLAYERS_ALLOWED) {
                // console.log(room.players.length)
                const color = room.players.length === 1 ? 'w' : 'b';
                room.players.push({id: socket.id, color});
                socket.join(data.roomId);
                io.to(data.roomId).emit('room-joined', { roomID: data.roomId, color});
            } else {
                socket.emit('room-full', { message: 'Room is full. Please try another room or create a new one.' });
            }
        } else {
            socket.emit('room-not-found', { message: 'Room not found. Please check the room ID and try again.' });
        }
    });

    socket.on('move', (data) =>{
        // if(data.promotion){
        //     const promotionOption = ['q', 'r', 'n', 'b'];
        //     socket.broadcast.emit('promotion', {
        //         from: data.from,
        //         to: data.to,
        //         color: data.color,
        //         promotionOptions: promotionOption
        //     })
        // }
        socket.broadcast.emit('move', data);
    });

    socket.on('reset', () => {
        socket.broadcast.emit('reset');
    });

});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});