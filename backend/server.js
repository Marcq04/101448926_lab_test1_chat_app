const { saveGroupMessage, savePrivateMessage } = require('./controller');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});


// Enable CORS for all routes
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

mongoose.connect('mongodb://localhost:27017/chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const router = require('./routes');
app.use('/api', router);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('sendGroupMessage', async ({ from_user, room, message }) => {
        await saveGroupMessage(from_user, room, message);
        io.to(room).emit('receiveGroupMessage', { from_user, message });
    });

    socket.on('sendPrivateMessage', async ({ from_user, to_user, message }) => {
        await savePrivateMessage(from_user, to_user, message);
        io.to(to_user).emit('receivePrivateMessage', { from_user, message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 8080
server.listen(PORT, () => {
    console.log('Server running on http://localhost:8080');
});
