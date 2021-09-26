const fetch = require('node-fetch');
const { openseaAssetUrl } = require('../config.json');
const iam = require('./iam.json');

const Discord = require('discord.js');


module.exports = {
	name: "surpriseme",
	execute(message, args) {

    var correct = "";
    var keys = Object.keys(iam);
    while (correct === ""){
        correct = iam[keys[parseInt(keys.length * Math.random())]];
    }

    let url = `${openseaAssetUrl}/${process.env.CONTRACT_ADDRESS}/${correct}`;
    let settings = { 
      method: "GET",
      headers: {
        // "X-API-KEY": process.env.OPEN_SEA_API_KEY
      }
    };
    
    fetch(url, settings)
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
            const embedMsg = new Discord.MessageEmbed()
            
              .setColor('#0099ff')
              .setTitle(metadata.name)
              .setURL(metadata.permalink)
              .addField("Owner", `[${metadata.top_ownerships[0].owner.user?.username || metadata.top_ownerships[0].owner.address.slice(0,8)}](https://opensea.io/${metadata.top_ownerships[0].owner.address})`)
              .setImage(metadata.image_url);

            metadata.traits.forEach(function(trait){
              embedMsg.addField(trait.trait_type, `${trait.value} (${Number(trait.trait_count/metadata.collection.stats.count).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})})`, true)
              //embedMsg.addField(trait.trait_type, `${trait.value}`, true)
            });

            message.channel.send(embedMsg);
        })
        .catch(error => message.channel.send(error.message));
	},
};