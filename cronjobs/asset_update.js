const fs = require('fs');
const fetch = require('node-fetch');
const { openseaAssetUrl, assetDetailsFilePath } = require('../config.json');
const iam = require('../commands/iam.json')

const Discord = require('discord.js');
const { json } = require('express');

module.exports = {
	name: "asset_update",
    interval: 17*60*1000, // 17mins
	async execute(client) {

        console.log("Updating asset details")

        var final_assets = {};
        var token_ids = [];
        var num_lookup = {};

        // Get the numbers of iAMs available
        var keys = Object.keys(iam);

        // Define the list of keys of metadata we are interested in
        var valid_keys = [ 'token_id', 'image_url', 'image_thumbnail_url', 'animation_url', 'name', 'permalink', 'traits', 'last_sale' ];

        // Create a batch of 30 (since that is the specified limit by OS) token_ids
        // Send a request to collect it
        for (let idx=0;idx<keys.length;idx++){
            
            // Some iAM nums point to "" in iam.json
            let k = keys[idx]
            if (iam[k] === "")
                continue
            
            // Create a reverse lookup from token_id to num
            num_lookup[iam[k]] = k;

            // Build the list of token_ids
            token_ids.push(iam[k]);

            // This ensures that the last few iAMs are written even if we haven't built a batch of 30
            // IMPORTANT: Keep the iAM trimmed to only available tokens for this to work.
            if (token_ids.length == 30 || idx == keys.length-1) {

                // Fetch the details for each of the asset
                let settings = {
                    method: "GET",
                    headers: {
                        // "X-API-KEY": process.env.OPEN_SEA_API_KEY
                    }
                }

                // Let's build the url
                let base_url = "https://api.opensea.io/api/v1/assets?"
                let params = new URLSearchParams({ 
                    "asset_contract_address": "0x495f947276749ce646f68ac8c248420045cb7b5e",
                    "order_direction": "asc",
                    "limit": 50
                })
                let token_params = ""
                for (let t of token_ids) {
                    token_params += "&token_ids="+t
                }
                let url = base_url + params + token_params

                // Fetch
                let res = null;
                try {
                    res = await fetch(url, settings);
                }
                catch (e) {
                    break
                }          
                if (res.status == 404 || res.status == 400)
                {
                    throw new Error("Token id doesn't exist.");
                }
                if (res.status != 200)
                {
                    throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
                }

                // Convert to an obj
                let data = await res.json();
                if (!("assets" in data)) {
                    throw new Error(`Couldn't retreive assets from response`);
                }

                // Pick only required properties of asset metadata
                for (let a of data['assets']) {
                    let new_asset = {}
                    valid_keys.forEach((key) => new_asset[key] = a[key])
                    final_assets[num_lookup[a['token_id']]] = new_asset
                }

                // Reset for next batch of 30
                token_ids = [];
            }
        }

        // Update the file by reading the existing metadata and writing the new metadata
        fs.readFile(assetDetailsFilePath, 'utf8', function readFileCallback(err, data){
            var asset_details = {};
            if (err){
                if (err.code != "ENOENT") {
                    console.log(err);
                    throw new Error(`Error reading asset details file.`)
                    return
                }
            }
            
            // Update the old assets
            for (let a of Object.keys(final_assets)) {
                asset_details[a] = final_assets[a]
            }

            // Write them
            fs.writeFile(assetDetailsFilePath, JSON.stringify(asset_details, null, 4), 'utf8',  function(err, result) {
                if(err) console.log('error', err);
                console.log("Updating asset details done")
            }); // write it back 
        });

        
	},
};