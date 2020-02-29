const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: String,
    author: String,
    currentDate: String
})

module.exports = mongoose.model('messages', messageSchema);