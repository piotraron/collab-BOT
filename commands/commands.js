
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
                { name: '!surpriseme', value: `Show a random ${slug}`},
                { name: '!floor', value: `Floor price`},
                { name: '!collectors', value: `Number of unique owners`},
                { name: `!${slug} NUMBER`, value: `Detailed information about an ${slug}`},
                { name: '!auction', value: `Auctions explained`},
                { name: '\u200B', value: `__**Commands that can be used in <#${process.env.BOT_CHANNEL_ID}> channel**__\n\n`},
                { name: '!showme ADDRESS', value: `Displays all ${slug}s of the address owner`},
                { name: "!trait VALUE", value: `Filter for trait VALUE. Shows a random selection.`}


            )

            message.channel.send(embedMsg);
        
	},
};