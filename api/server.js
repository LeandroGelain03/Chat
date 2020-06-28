const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const router = express.Router();
const server = require("http").createServer(app);
const io = require('socket.io')(server);

const dotenv = require('dotenv');
dotenv.config();
var cors = require('cors');
app.use(cors());

const messagesRouter = require('./src/routes/messageRoutes')
const chatController = require('./src/controllers/chatController')
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/message/', messagesRouter);

app.use('/teste/', (req, res) => {
    res.status(200).json({message: 'teste'})
});

io.on("connection", socket => {
    console.log(`socket: ${socket.id}`);
    socket.on("sendMessage", data => {
        chatController.storeMessage(data)
        socket.emit('receivedMessage', data);
        socket.broadcast.emit('receivedMessage', data);
    });
})

app.use(morgan('dev'));
console.log(process.env.USERNAME_MONGO)
mongoose.connect('mongodb+srv://LeandroGelain:M.a.159730@chat-dp911.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use((req, res, next) => {
    const error = new Error("Route not found (404)");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: error.message
    });
});
const porta = process.env.PORT || 3333
server.listen( porta )
