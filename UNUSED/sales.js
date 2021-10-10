const fetch = require('node-fetch');
const Discord = require('discord.js');
const { openseaEventsUrl } = require('../config.json');

var salesCache = [];
var lastTimestamp = null;


module.exports = {
  name: 'sales',
  description: 'sales bot!',
  interval: 30000,
  async execute(client) {
    if (lastTimestamp == null) {
      lastTimestamp = Math.floor(Date.now()/1000) - 120;
    } else {
      lastTimestamp -= 30;
    }
    let newTimestamp = Math.floor(Date.now()/1000) - 30;
    // we're retrieving events from -90 to -30 seconds ago each time, and each query overlaps the previous query by 30 seconds
    // doing this to try to resolve some intermittent issues with events being missed by the bot, suspect it's due to OpenSea api being slow to update the events data
    // duplicate events are filtered out by the salesCache array


    let offset = 0;
    let settings = { 
      method: "GET",
      headers: {
        // "X-API-KEY": process.env.OPEN_SEA_API_KEY
      }
    };
    while(1)
    {

      client.user.setActivity("!commands", {
        type: "LISTENING",
  
      });

      let url = `${openseaEventsUrl}?collection_slug=${process.env.OPEN_SEA_COLLECTION_NAME}&event_type=successful&only_opensea=false&offset=${offset}&limit=50&occurred_after=${lastTimestamp}&occurred_before=${newTimestamp}`;
      try {
        var res = await fetch(url, settings);
        if (res.status != 200) {
          throw new Error(`Couldn't retrieve events: ${res.statusText}`);
        }

        data = await res.json();
        if (data.asset_events.length == 0) {
          break;
        }

        data.asset_events.forEach(function(event) {
          if (event.asset) {
            if (salesCache.includes(event.id)) {
              return;
            } else {
              salesCache.push(event.id);
              if (salesCache.length > 200) salesCache.shift();
            }

            const embedMsg = new Discord.MessageEmbed()

            .setColor('#0099ff')
              .setTitle(event.asset.name + ' sold!')
              .setURL(event.asset.permalink)
              // .setAuthor('OpenSea Bot', 'https://files.readme.io/566c72b-opensea-logomark-full-colored.png', 'https://github.com/piotraron/discord-bot-names')
              .setThumbnail(event.asset.collection.image_url)
              .addFields(
                { name: 'Name', value: event.asset.name },
                { name: 'Amount', value: `${event.total_price/(1e18)} ${event.payment_token.symbol}`},
                { name: 'Buyer', value:  `[${event.winner_account.user?.username || event.winner_account.address.slice(0,8)}](https://opensea.io/${event.winner_account.address})` },
                { name: 'Seller', value: `[${event.seller.user?.username || event.seller.address.slice(0,8)}](https://opensea.io/${event.seller.address})` }
              )
              .setImage(event.asset.image_url)
              .setTimestamp(Date.parse(`${event?.created_date}Z`))
              .setFooter('Sold on OpenSea', 'https://files.readme.io/566c72b-opensea-logomark-full-colored.png')

                

            client.channels.fetch(process.env.DISCORD_SALES_CHANNEL_ID)
            
              .then(channel => {
               
                channel.send(embedMsg);
                console.log("Sale")

              })

              client.channels.fetch(process.env.COPY_CHANNEL_ID)
            
              .then(channel => {
               
                channel.send(embedMsg);
                console.log("message sent")

              })


              .catch(console.error);
          }
        });
      }
      catch (error) {
        console.error
      }

      offset += data.asset_events.length;
    }

    lastTimestamp = newTimestamp;
  }
};
