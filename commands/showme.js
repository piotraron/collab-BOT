const fetch = require('node-fetch');
const web3_eth = require('web3-eth');
const { openseaAssetUrl, ethPublicRpcUrl } = require('../config.json');
const w3_eth = new web3_eth(ethPublicRpcUrl);

// const ID = require(`../ids/${process.env.OPEN_SEA_COLLECTION_NAME}.json`);

const Discord = require('discord.js');

const sendShowMe = async(message, address) => {
  let url = `${openseaAssetUrl}s?owner=${address}&collection=${process.env.OPEN_SEA_COLLECTION_NAME}`;
  let settings = { 
    method: "GET",
    headers: {
      // "X-API-KEY": process.env.OPEN_SEA_API_KEY
    }
  };

  fetch(url, settings, address)
      .then(res => {
        if (res.status == 404 || res.status == 400)
        {
          throw new Error(`Address ${address} doesn't exist.`);
        }
        if (res.status != 200)
        {
          throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
        }
        return res.json();
        
      })
      .then((metadata) => {

        let user = message.content;
        const embedMsg = new Discord.MessageEmbed()
        // const firstEmbed = new Discord.MessageEmbed()
        .setColor('#581845')
        // .setTitle(`List of iams owned by [${args[0]}](https://opensea.io/${args[0]})\n\n`)
        // .setURL(`https://opensea.io/${args[0]}`)

        .setDescription(`List of iams owned by [${user.slice(8)}](https://opensea.io/${address}) `)

        metadata.assets.forEach(function(asset){

          embedMsg.addFields(
            {name: `\u200B`, 
                value: `[${asset.name}](${asset.permalink})`, inline: false}

             )
          })
          
          message.channel.send(embedMsg);
      })
      .catch(error => message.channel.send(error.message));
}

module.exports = {
	name: "showme",
	execute(message, args) {
    if(message.channel.id === `${process.env.BOT_CHANNEL_ID}`){
      if (!args.length) {
        return message.channel.send(`You didn't provide a right address, ${message.author}!`);
      }

      let address = args[0]
      if (args[0].includes(".eth")) {
        address = w3_eth.ens.getAddress(args[0])
          .then(res => {
            sendShowMe(message, res).catch(error => message.channel.send(error.message));
          })
          .catch(error => message.channel.send(error.message));
      }
      else {
        sendShowMe(message, address).catch(error => message.channel.send(error.message));
      }
    }
    else{
      console.log(message.channel)
      return message.channel.send(`Please head to <#${process.env.BOT_CHANNEL_ID}> channel to use that command ${message.author}`);
    }
	},
};