const Discord = require('discord.js');

const text = ["It didn't work",
    "They’re all gonna laugh at you",
    "Everything is a scam",
    "You’re already getting tired. It’s over.",
    "That was a bad decision",
    "Mr Bean is your real father",
    "We're all a Rick Astley fever dream",
    "It will be like this",
    "You are surrounded",
    "If you don't fomo, do you even own nfts",
    "FOMO is your master",
    "You're the happiest you will ever be right now",
    "You will be left behind",
    "NGMI",
    "Clear your browser history...NOW!",
    "It was all just a dream",
    "You will win the  raffle, but the transaction will fail",
    "Bob is really a bot the iAMs created to be their front man",
    "He's not kidding",
    "Yes, it's too small",
    "What happens if the power goes out and never comes back on",
    "Fiat is the only real currency",
    "Yes, it  was a bad decision",
    "Yes, you will lose the raffle",
    "It's not just a rash",
    "They're watching you",
    "Crypto is crashing, check your portfolio",
    "Your eyes deceive you",
    "What did you miss?",
    "Are You standing on a rug",
    "Check the closet",
    "You will not get this iAM",
    "Fud rules your life",
    "They're never gonna call back",
    "Don't go to sleep",
    "I ask myself sometimes.. why do i serve You "
]

module.exports = {
    name: "fud",
    execute(message) {

        message.channel.send(text[parseInt(text.length * Math.random())] + ` ${message.author}`)

    }
}