const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES] });
const prefix = 'd!';
const STATCHANGES = [.25, .285, .333, .4, .5, .666, 1, 1.5, 2, 2.5, 3, 3.5, 4];
const ACCEVACHANGES = [0.33, 0.375, 0.428, 0.5, 0.6, 0.75, 1, 1.33, 1.66, 2, 2.33, 2.66, 3];
let downtime = false;
let upSince = Date.now();
console.log(`Started at ${upSince}!`);
module.exports = {
    prefix, Discord, client, STATCHANGES, ACCEVACHANGES, downtime, upSince
}