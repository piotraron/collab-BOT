const fetch = require('node-fetch');
const { openseaAssetUrl, assetDetailsFilePath, iamsFilePath, ownersFilePath } = require('../config.json');
const fs = require('fs');

const Discord = require('discord.js');


module.exports = {
    name: "surpriseme",
    execute(message, args) {

        let iam = null;
        try { iams = JSON.parse(fs.readFileSync(iamsFilePath, 'utf8')); } catch (error) { return message.channel.send(`Error: ${error.message}`); }
        try { asset_details = JSON.parse(fs.readFileSync(assetDetailsFilePath, 'utf8')); } catch (error) { return message.channel.send(`Error: ${error.message}`); }
        try { owners = JSON.parse(fs.readFileSync(ownersFilePath, 'utf8')); } catch (error) { return message.channel.send(`Error: ${error.message}`); }

        var correct = "";
        var keys = Object.keys(iams);
        while (correct === "") {
            correct = iams[keys[parseInt(keys.length * Math.random())]];
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
                if (res.status == 404 || res.status == 400) {
                    throw new Error("Token id doesn't exist.");
                }
                if (res.status != 200) {
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
                    //check if animation
                if (metadata.animation_url !== null) {
                    let url = metadata.animation_url;
                    url = url.replace("https://storage.opensea.io/files/", "https://github.com/piotraron/iamgifs/blob/main/");
                    url = url.replace(".mp4", ".gif?raw=true");

                    embedMsg.setImage(url);
                } else {
                    embedMsg.setImage(metadata.image_url);
                }

                metadata.traits.forEach(function(trait) {
                    embedMsg.addField(trait.trait_type, `${trait.value} (${Number(trait.trait_count/metadata.collection.stats.count).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})})`, true)
                        //embedMsg.addField(trait.trait_type, `${trait.value}`, true)
                });

                message.channel.send(embedMsg);

                var iam_number = metadata.name.split(' ')[1].substring(1)
                var new_asset = {}
                var valid_keys = ['token_id', 'image_url', 'image_thumbnail_url', 'animation_url', 'name', 'permalink', 'traits', 'last_sale'];
                valid_keys.forEach((key) => new_asset[key] = metadata[key])
                asset_details[iam_number] = new_asset
                fs.writeFile(assetDetailsFilePath, JSON.stringify(asset_details, null, 4), 'utf8', function(err, result) {
                    if (err) console.log('error', err);
                    console.log("Updating asset_details.json done through token command")
                }); // write it back 

                new_asset = metadata['top_ownerships'][0]['owner']
                new_asset['updated_on'] = Date.now()
                owners[iam_number] = new_asset
                fs.writeFile(ownersFilePath, JSON.stringify(owners, null, 4), 'utf8', function(err, result) {
                    if (err) console.log('error', err);
                    console.log("Updating owners.json done through token command")
                });
            })
            .catch(error => message.channel.send(error.message));
    },
};