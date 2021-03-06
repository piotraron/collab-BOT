const fetch = require('node-fetch');
const { openseaAssetUrl } = require('../config.json');

const Discord = require('discord.js');


module.exports = {
    name: "update",
    interval: 34 * 60 * 1000, // 34mins
    async execute(client) {

        client.user.setActivity("!commands", {
            type: "LISTENING",

        })

        let url = `${openseaAssetUrl}/${process.env.CONTRACT_ADDRESS}/${process.env.SAMPLE_TOKEN_ID}`;
        let settings = {
            method: "GET",
            headers: {
                // "X-API-KEY": process.env.OPEN_SEA_API_KEY
            }
        }
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

                let totalOwners = metadata.collection.stats.num_owners;
                let totalSales = metadata.collection.stats.total_sales;

                //check if voice channel ID set up for total owners
                if (process.env.VOICE_CHANNEL_OWNERS) {
                    client.channels.fetch(process.env.VOICE_CHANNEL_OWNERS)
                        .then(channel => {

                            channel.setName(`Total Owners: ${totalOwners}`);

                        })
                }
                //check if voice channel ID set up for total sales
                if (process.env.VOICE_CHANNEL_TOTALSALES) {
                    client.channels.fetch(process.env.VOICE_CHANNEL_TOTALSALES)
                        .then(channel => {

                            channel.setName(`Total Sales: ${totalSales}`);

                        })
                }
            })
            .catch(error => console.log(error));
    },
};