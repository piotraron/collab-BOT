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
              "You are not very patient are you?"
            ]

module.exports = {
	name: "wen",
	execute(message) {

        message.channel.send(text[parseInt(text.length * Math.random())] + ` ${message.author}`)

    }
}