const fetch = require('node-fetch');
const { openseaAssetUrl } = require('../config.json');
// const ID = require(`../ids/${process.env.OPEN_SEA_COLLECTION_NAME}.json`);

const Discord = require('discord.js');


module.exports = {
	name: "scan",
	execute(message, args) {
    if (!args.length) {
      return message.channel.send(`You didn't provide a right address, ${message.author}!`);
    }

    // if (isNaN(parseInt(args[0]))) {
    //   return message.channel.send(`Token id must be a number!`);
    // }

    // var correct = ID[args[0]];
    let url = `${openseaAssetUrl}s?owner=${args[0]}&collection=${process.env.OPEN_SEA_COLLECTION_NAME}`;
    let settings = { 
      method: "GET",
      headers: {
        // "X-API-KEY": process.env.OPEN_SEA_API_KEY
      }
    };

    fetch(url, settings, args[0])
        .then(res => {
          if (res.status == 404 || res.status == 400)
          {
            throw new Error("Token id doesn't exist.");
          }
          if (res.status != 200)
          {
            throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
          }
          return res.json();
          
        })
        .then((metadata) => {

            const firstEmbed = new Discord.MessageEmbed()
            .setColor('#581845')
            // .setTitle(`some title for now`)
            // .setURL(`https://opensea.io/${args[0]}`)
            .setDescription(`List of iams owned by [${args[0]}](https://opensea.io/${args[0]}) `)
          
            message.channel.send(firstEmbed)

            metadata.assets.forEach(function(asset){
            const embedMsg = new Discord.MessageEmbed()

              .setColor('#581845')
              .setAuthor(`${asset.name}`, `${asset.image_thumbnail_url}`, `${asset.permalink}`)
              // .setTitle(`\u200B\`)
              // .setURL(asset.permalink)
              // .setDescription(`[${asset.name}](${asset.permalink})`)
              // .setThumbnail(asset.image_thumbnail_url)

            message.channel.send(embedMsg);
            })

        })
        .catch(error => message.channel.send(error.message));
	},
};