const fetch = require('node-fetch');
const { openseaAssetUrl } = require('../config.json');

const Discord = require('discord.js');


module.exports = {
	name: "sales",
	execute(message) {

    let url = `${openseaAssetUrl}/${process.env.CONTRACT_ADDRESS}/${process.env.SAMPLE_TOKEN_ID}`;
    let settings = { 
      method: "GET",
      headers: {
        // "X-API-KEY": process.env.OPEN_SEA_API_KEY
      }
    }
    
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

            let slug = metadata.collection.stats;

            const embedMsg = new Discord.MessageEmbed()
            
            .setColor('#0099ff')
            .setTitle(`Total Sales: ${slug.total_sales}`)
            .addFields(

                { name: '1 Day', value: `${slug.one_day_sales}`},
                { name: '7 Day', value: `${slug.seven_day_sales}`},
                { name: '30 Day', value: `${slug.thirty_day_sales}`}
              )


          message.channel.send(embedMsg);
        })
        .catch(error => message.channel.send(error.message));
	},
};