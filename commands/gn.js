const Discord = require('discord.js');

module.exports = {
	name: "gn",
	execute(message) {

            const embedMsg = new Discord.MessageEmbed()
            .setImage("https://lh3.googleusercontent.com/XBACH7r8qrzLbmUC9ZH0Go302lxmmNTTkfWPPMXMwqTKjHRjPo8p4hzfXme5YIQQ-VsK0Ik6CJDBHNbNxtP7j3T71R0QXAIqEWAo3Q=s0")
          
            message.channel.send(embedMsg)

        .catch(error => message.channel.send(error.message));
    }
}