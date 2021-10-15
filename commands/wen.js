const Discord = require('discord.js');

const text = ["Might be ready in 5 minutes!! Stop asking every hour",
    "Its better to arrive late than not ready",
    "Today",
    "Within the next 24h that's for sure",
    "Wen you stop asking",
    "Artist working really hard on this, please be patient",
    "You feel it coming too?",
    "I can't wait myself",
    "Hopefully soon",
    "Good question",
    "Wen who?",
    "You are not very patient are you?",
    "I’ll let you know when I have an answer",
    "What answer could I give you so that you’ll stop asking",
    "It will happen eventually",
    "Oh, you know, these things sometimes take a little longer than expected. I’m hoping one day soon",
    "When the time is right",
    "Only God knows, and He hasn’t told me yet",
    "Why do you want to know?",
    "What do you think?",
    "How soon do you need to know?",
    "I will get back to you?\n\n ....probably not tho."
]

module.exports = {
    name: "wen",
    execute(message) {

        message.channel.send(text[parseInt(text.length * Math.random())] + ` ${message.author}`)

    }
}