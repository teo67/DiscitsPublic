const findUser = require('./findUser');
const returnEmbed = require('./returnEmbed');
const isInt = require('./isInt');
const getPremium = require('./getPremium');
const User = require('../classes/cls_user');
const upSince = require('../lists+constants/fundamentals').upSince;

module.exports = async (message, args, options) => {
    try {
        let results = {};
        if(options.user !== undefined) {
            const found = await findUser(message.author.id);
            if(options.user) {
                if(!found) {
                    message.channel.send(returnEmbed(message.author, 'You don\'t have an account yet! Use \'register\' to get started!', 'Error'));
                    return null;
                }
                results.user = found;
            } else if(found) {
                message.channel.send(returnEmbed(message.author, 'You already have an account!', 'Error'));
                return null;
            }

            if(results.user && results.user.battle && ((results.user.battle.timestamp && results.user.battle.timestamp < upSince) || results.user.battle.paused)) {
                return results; // override other possible failures if resuming battle
            }
        }
        if(options.equipped !== undefined) {
            if(options.equipped) {
                if(results.user.equipped == -1) {
                    message.channel.send(returnEmbed(message.author, 'Make sure to equip a Discit before using this command!', 'Error'));
                    return null;
                }
                results.equipped = results.user.equipped;
            } else if(results.user.equipped != -1) {
                message.channel.send(returnEmbed(message.author, 'You already have a Discit equipped!', 'Error'));
                return null;
            }
        }
        if(options.battle !== undefined) {
            if(options.battle) {
                if(results.user.battle === undefined || results.user.battle.timestamp === undefined) {
                    message.channel.send(returnEmbed(message.author, 'This command can only be used in battle!', 'Error'));
                    return null;
                }
            } else if(results.user.battle !== undefined && results.user.battle.timestamp !== undefined) {
                message.channel.send(returnEmbed(message.author, 'You can\'t use this command in battle!', 'Error'));
                return null;
            }
        }
        if(options.progression !== undefined) {
            if(results.user.progression < options.progression) {
                message.channel.send(returnEmbed(message.author, 'Try getting a little further along in the game before using this command.', 'Error'));
                return null;
            }
        }
        if(options.args !== undefined) {
            if(options.args.len !== undefined) {
                if(args.length < options.args.len) {
                    message.channel.send(returnEmbed(message.author, `This command required ${options.args.len} arguments. Trying using the \'help\' command for more information.`, 'Error'));
                    return null;
                }
            }
            if(options.args.isInt !== undefined) {
                results.parsedArgs = [];
                for(let i = 0; i < Math.min(options.args.isInt.length, options.args.len); i++) {
                    if(options.args.isInt[i]) {
                        if(!isInt(args[i])) {
                            message.channel.send(returnEmbed(message.author, `Argument #${i + 1} should be a positive integer.`, 'Error'));
                            return null;
                        }
                        results.parsedArgs.push(parseInt(args[i]));
                    } else {
                        results.parsedArgs.push(args[i]);
                    }
                }
            }
        }
        if(options.location !== undefined) {
            if(options.location.toLowerCase() != results.user.namedLocation.toLowerCase()) {
                message.channel.send(returnEmbed(message.author, `Make sure you\'re at the location \`${options.location}\` before using this command!`, 'Error'));
                return null;
            }
        }
        if(options.premium !== undefined) {
            if(await getPremium(message.author.id) < options.premium) {
                message.channel.send(returnEmbed(message.author, `This command requires at least Tier ${options.premium} Premium!`, 'Error'));
                return null;
            }
        }
        return results;
    } catch(e) {
        return Promise.reject(e);
    }
}