const Discord = require('discord.js');


module.exports = {
	name: "auction",
	execute(message) {

            const embedMsg = new Discord.MessageEmbed()
            .setColor('#581845')
            .setTitle(`Auctions Information`)
            .setDescription(`\u200B`)
            .addFields(
                {name: ":arrow_down: Dutch Auction :arrow_down:\n\n", 
                    value: `Price of an item is falling from high to low until first person makes a purchase. \n\n__Fastest bidder wins__ \n\n **Requires ETH**`, inline: true},
                {name: '\u200B', value: "\u200B", inline: true},
                {name: ':arrow_up: English(regular) Auction :arrow_up:\n\n', 
                    value: 'Price of an item and time to finish raises with each bid until no more bidders. \n\n__Highest bidder wins__ \n\n **Requires WETH**', inline: true}

            )
          
            message.channel.send(embedMsg)

    
        .catch(error => message.channel.send(error.message));
    }
}