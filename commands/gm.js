const Discord = require('discord.js');

module.exports = {
    name: "gm",
    execute(message) {

        const embedMsg = new Discord.MessageEmbed()
            .setImage("https://lh3.googleusercontent.com/OoWeebTJCmCfYySgX6Pwiw1OH0HwOyyPiXriZsr6MHlgjFP9Su4g2oMCDM6MkozcQ4XbNte6rD0MtKOz6yG6vMxtu_4EP1nnEbH7bw")

        message.channel.send(embedMsg)

        .catch(error => message.channel.send(error.message));
    }
}