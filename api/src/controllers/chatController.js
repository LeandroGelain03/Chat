const userModel = require('../models/userModel');
const messages = require('../models/messageModel');

module.exports = {
    async storeMessage(data, res) {
        const date = new Date()
        const currentDate = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        const { author, message } = data;
        if (author.length && message.length) {
            await messages.create({
                author,
                message,
                currentDate
            });
            return ({ author: author, message: message })
        }
    },
    async getPreviousMessage(req, res) {
        const previousMessages = await messages.find();
        const messagesObject = []
        for (previousMessage of previousMessages){
            messagesObject.push({
                author:previousMessage.author,
                message: previousMessage.message
            })
        }
        return res.status(201).send(messagesObject)
    }
}