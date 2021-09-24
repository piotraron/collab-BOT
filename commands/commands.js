
const fetch = require('node-fetch');
const Discord = require('discord.js');


module.exports = {
	name: "commands",
	execute(message) {
        let slug = process.env.DISCORD_TOKEN_COMMAND;
        const embedMsg = new Discord.MessageEmbed()

            .setColor('##ff9900')
            .setTitle(`COMMANDS`)
            .addFields(
                { name: '!volume', value: `Detailed volume stats`},
                { name: '!sales', value: `Detailed sales stats`},
                { name: '!floor', value: `Floor price`},
                { name: '!collectors', value: `Number of unique owners`},
                { name: `!${slug} NUMBER`, value: `Detailed information about Your ${slug}`},
                { name: '!auction', value: `Auctions explained`}


            )

            message.channel.send(embedMsg);
        
	},
};