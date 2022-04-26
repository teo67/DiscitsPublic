const threshold = require('../functions/threshold');
const returnEmbed = require('../functions/returnEmbed');
const client = require('../lists+constants/fundamentals').client;
const doBattle = require('../functions/battle/doBattle');
const upSince = require('../lists+constants/fundamentals').upSince;
const getUser = require('../functions/getUser');
const initBattle = require('../functions/initBattle');

class Command {
    constructor(_name, _type, _description, _arguments, _parameters, _thresholds, _func) {
        this.name = _name;
        this.type = _type;
        this.description = _description;
        this.arguments = _arguments; 
        this.parameters = _parameters;
        this.thresholds = _thresholds;
        this.func = _func;
    }

    async execute(message, args) {
        console.log('Num guilds: ' + client.guilds.cache.size);
        try {
            if(this.name !== 'power' && require('../lists+constants/fundamentals').downtime) { // override for me to turn it back on
                await message.channel.send(returnEmbed(message.author, 'The bot is currently in a minute of programmed downtime. Sorry for the inconvenience!', 'Error: Try again later'));
                return;
            }
            const results = await threshold(message, args, this.thresholds);
            if(!results) {
                return;
            }
            if(results.user && results.user.battle && ((results.user.battle.timestamp && results.user.battle.timestamp < upSince) || results.user.battle.paused)) {
                results.user.battle.timestamp = Date.now(); // so they cant game the system by spamming and triggering twice
                results.user.battle.paused = false;
                await message.channel.send(returnEmbed(message.author, 'Looks like you\'re in a battle right now. Resuming progress...', 'Resume Battle'));
                if(results.user.battle.uid !== undefined) {
                    const otherPlayer = await getUser(results.user.battle.uid, message);
                    if(otherPlayer === null) {
                        results.user.battle = undefined;
                        return;
                    }
                    if(otherPlayer.battle) { // this should really never be false, but just in case theres a glitch of some kind
                        otherPlayer.battle.timestamp = Date.now();
                        otherPlayer.battle.paused = false;
                    } else {
                        results.user.battle = undefined;
                        message.channel.send(returnEmbed(message.author, 'Your opponent is not in battle, but you are. Battle cancelled. This a bug, so please report it to dev-team@discits.xyz.', 'Error'));
                        return;
                    }
                    let p1 = results.user;
                    let p1Discord = message.author;
                    let p2 = otherPlayer;
                    let p2Discord;
                    try {
                        p2Discord = await client.users.fetch(results.user.battle.uid);
                    } catch(e) {
                        results.user.battle = undefined;
                        console.log(`Error grabbing p2Discord: ${e}`);
                        message.channel.send(returnEmbed(message.author, 'We weren\'t able to find your opponent\'s Discord account anymore, so the battle has been cancelled.', 'Error'));
                        return;
                    }
                    if(results.user.battle.wager === undefined) { // swap em to find first player
                        p1 = otherPlayer;
                        p1Discord = p2Discord;
                        p2 = results.user;
                        p2Discord = message.author;
                    }
                    initBattle(p1, p1Discord, p2, message.channel, true, p2Discord);
                } else { // trainer or wild
                    initBattle(results.user, message.author, (results.user.battle.trainer !== undefined) ? results.user.battle.trainer : results.user.battle.wild, message.channel, true);
                }
                return;
            }
            const time = Date.now();
            if(results.user && results.user.cds.any && time - results.user.cds.any < 2000) { // 2 sec cooldown
                message.channel.send(returnEmbed(message.author, 'Please wait two seconds in between commands!', 'Error'));
                return;
            } else if(results.user) {
                results.user.cds.any = time;
            }
            await this.func(message, args, results);
            if(results.user) {
                await results.user.save();
            }
        } catch(e) {
            console.log(e);
            return;
        }
    }
}

module.exports = Command;