const asset_details = require('./asset_details.json')
const Discord = require('discord.js');
const fs = require('fs');
const {assetDetailsFilePath } = require('../config.json');

module.exports = {
	name: "trait",
	execute(message, args) {
        if(message.channel.id === `${process.env.BOT_CHANNEL_ID}`){
            if (!args.length) {
                return message.channel.send(`You didn't provide a trait value, ${message.author}!`);
            }


            let asset_details = null;
            try {
                asset_details = JSON.parse(fs.readFileSync(assetDetailsFilePath, 'utf8'));
            }
            catch (error) {
                return message.channel.send(`Error: ${error.message}`);
            }

            // Get the trait request. 
            // Need to append later args since we might have trait with more than one word eg. Gas Mask!
            var trait = args[0];
            for (i=1; i<args.length; i++) {
                trait = trait + " " + args[i]
            }

            // Run through our assets and collect all with given trait
            var assets_with_traits = [];
            for (var a in asset_details) {
                asset = asset_details[a];
                for (var t of asset['traits']){
                    // console.log(t)
                    if (t['value'] && t['value'].toUpperCase() === trait.toUpperCase()){
                        assets_with_traits.push(asset);
                        break
                    }
                }
            }
            
            // Inform the user about the trait count!
            const firstEmbed = new Discord.MessageEmbed()
            .setColor('#581845')
            if (assets_with_traits.length > 5) {
                firstEmbed.setDescription(`${assets_with_traits.length} iAMs exist with trait ${trait}! Showing a random selection below!`)
            }
            else {
                firstEmbed.setDescription(`${assets_with_traits.length} iAMs exist with trait ${trait}!`)
            }
            message.channel.send(firstEmbed)

            // We now display if there are assets that we found.
            // If many assets found, we show a random selection!
            if (assets_with_traits.length < 1){
                return
            } 

            // Find random selection
            var selectedIndices = [];
            if (assets_with_traits.length < 5){
                selectedIndices = Array.from(Array(assets_with_traits.length).keys());
            }
            else {
                while (selectedIndices.length < 4) {
                    // Need to select some non-repeating indices
                    var randomIdx = Math.floor(Math.random() * assets_with_traits.length);
                    var flag = false;
                    for (var i of selectedIndices) {
                        if (i == randomIdx){
                            flag = true;
                            break
                        }
                    }
                    if (flag == false) {
                        selectedIndices.push(randomIdx)
                    }   
                }
            }

            // Build a message for each and send
            selectedIndices.forEach(function(idx){
                const embedMsg = new Discord.MessageEmbed()
                .setColor('#581845')
                .setAuthor(`${assets_with_traits[idx]['name']}`, `${assets_with_traits[idx]['image_thumbnail_url']}`, `${assets_with_traits[idx]['permalink']}`)

                message.channel.send(embedMsg);
            })
        }
        else{
            console.log(message.channel)
            return message.channel.send(`Please head to <#${process.env.BOT_CHANNEL_ID}> channel to use that command ${message.author}`);
          }
	},
};