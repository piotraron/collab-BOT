# NFT Discord Bot
This is a discord bot for ERC721 NFT collections, all the token metadata is being retrieved from opensea at the moment, instead of directly from the tokenURI in the smart contract.

<!-- # Supported functions
The following functions are currently supported:

## User Commands
### **!*TOKEN_COMMAND*** *[tokenId]*
Retrieves the NFT based on the supplied tokenId, returns an embed message as follows. The actual *TOKEN_COMMAND* can be any keyword you like and is configurable via environment variables as described below.

![token command example screenshot]()

### **!floor**
Retrieves the current price floor that's listed for sale on OpenSea.  Results are cached and will not update more than once every 60 seconds.

The bot's post will contain the current price with a link to the item for sale on OpenSea.

![floor command example]()

## Automatic Posts
### **Sales**
The bot will look up sales events on OpenSea every 15 seconds, and all newly closed sales will be posted to the configured Discord channel.

![Sales bot example]() -->

# Configuration

## Discord Application
You'll need to create a Discord Application first, see https://discord.com/developers/applications

## Bot Configuration

All configuration is done via environment variables, which are as follows:
| Env Var      | Description |
| ----------- | ----------- |
| CONTRACT_ADDRESS      | Ethereum address for the NFT Smart Contract       |
| DISCORD_BOT_TOKEN   | Pretty self explanatory        |
| DISCORD_SALES_CHANNEL_ID   | The discord channel id where sales events should be posted to, should look like a long number       |
| COPY_CHANNEL_ID   | The SECOND discord channel id where sales events should be posted to, should look like a long number       |
| DISCORD_TOKEN_COMMAND | The command word you'd like the bot to respond to for posting token information, pick a simple word that represents the collection, see example above |
| OPEN_SEA_API_KEY | Contact OpenSea to request an API key at https://docs.opensea.io/reference#request-an-api-key.  The bot will work without it, but heavy use may result in being blocked. |
| SAMPLE_TOKEN_ID | ID of any token from a collection, avoids extra code to look for it each time found here: https://opensea.io/assets/ CONTRACT_ADDRESS / SAMPLE_TOKEN_ID |
| VOICE_CHANNEL_OWNERS | ID of the first discord voice channel to display owners |
| VOICE_CHANNEL_TOTALSALES | ID of the second discord voice channel to display total sales |
| OPEN_SEA_COLLECTION_NAME | The collection slug name on OpenSea, get this from the browser when you are viewing a collection, e.g. the collection name for https://opensea.io/collection/iam-v1 is "**iam-v1**"|


# Deployment
If running locally, just checkout the repository and run
  
`npm install`

followed by

`npm start`

You can also deploy directly to Heroku in just a few minutes.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

If you use the free dynos in Heroku, they go to sleep every 30 minutes unless there's a request on the endpoint, you can set up a free cron job online to poll your app every 20 minutes or so to keep it alive. https://cron-job.org/
