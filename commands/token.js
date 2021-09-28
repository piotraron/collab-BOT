const fetch = require('node-fetch');
const { openseaAssetUrl, assetDetailsFilePath, iamsFilePath } = require('../config.json');
const fs = require('fs');

const Discord = require('discord.js');


module.exports = {
	name: process.env.DISCORD_TOKEN_COMMAND || "token",
	execute(message, args) {
    if (!args.length) {
      return message.channel.send(`You didn't provide a token id, ${message.author}!`);
    }

    // Loading iam.json from file and not require since file may be updated.
    let iam = null;
    try {asset_details = JSON.parse(fs.readFileSync(assetDetailsFilePath, 'utf8'));}
    catch (error) {return message.channel.send(`Error: ${error.message}`);}

    // Will check if its a name and then find the corresponding iam
    var correct = null;
    const pattern = /[^0-9]/i;
    if (pattern.test(args[0])) {
      // Build the name given by user
      var name = args[0].toLowerCase();
      for (i=1; i<args.length; i++) {
          name = name + " " + args[i].toLowerCase();
      }

      // Loop through iAM details to find name
      for (var iam_num in asset_details) {
        var temp_iam = asset_details[iam_num];
        // Build the name out of 
        var name_split = temp_iam['name'].toLowerCase().split(' ')
        if (name_split.length > 2) { // this means the iAM has a name
          // build the name
          var iam_name = name_split[2].toLowerCase();
          for (i=3; i<name_split.length; i++) {
              iam_name = iam_name + " " + name_split[i].toLowerCase();
          }

          // compare name we got and iam name
          // console.log(iam_name, name)
          if (iam_name === name) {
            iam = temp_iam
            break
          }
        }
      }
      
      // if we got an iAM name match then take the token id
      if (iam != null) {
        correct = iam['token_id']
      }
    }
    
    // if we dont have token name match, check id
    if (correct == null) {
      // things we cant check for above
      if (name == "star ball i")
        args[0] = "81"
      if (name == "star ball ii")
        args[0] = "164"
      try {iam = JSON.parse(fs.readFileSync(iamsFilePath, 'utf8'));}
      catch (error) {return message.channel.send(`Error: ${error.message}`);}
      correct = iam[args[0]];
    }

    if (correct == null)
      return message.channel.send(`Couldn't find the iAM, ${message.author}!`);

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