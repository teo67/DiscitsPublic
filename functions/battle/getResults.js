const returnEmbed = require('../returnEmbed');
const chooseType = require('./chooseType');
const attackFilter = require('./attackFilter');
const swapFilter = require('./swapFilter');
const itemFilter = require('./itemFilter');
const targetFilter = require('./targetFilter');
const returnMoveList = require('../returnMoveList');
const returnPartyList = require('../returnPartyList');
const firstDisc = require('../firstDisc');
const items = require('../../lists+constants/items');
const tag = require('../tag');
const trainers = require('../../lists+constants/trainers');

const execute = async (player, user, userDiscord, other, canCancel, mustSwap) => {
    if(tag(user) == 'user') {
        try {
            const userDM = await userDiscord.createDM(); // create channel

            let type;
            if(mustSwap) {
                type = 2;
            } else {
                await userDiscord.send(returnEmbed(userDiscord, 'First, choose a type of move!\n - Type \'attack\' to use one of your equipped Discit\'s attacks\n - Type \'swap\' to switch out to a different Discit in your party\n - Type \'use\' to use an item in your inventory', 'Attack, Swap, or Use!'));

                type = ['attack', 'swap', 'use'].indexOf((await userDM.awaitMessages({ filter: msg => { // get type of attack (1, 2, 3)
                    if(msg.author.bot) {
                        return false;
                    }
                    return chooseType(msg, userDiscord, user);
                }, max: 1, time: 30000, errors: ['time'] })).first().content.toLowerCase()) + 1;
            }

            let body = '';
            if(type == 1) {
                body += 'Here are the attacks you currently have equipped:\n';
                for(let i = 0; i < 4; i++) {
                    body += returnMoveList(user.caught[user.equipped].moveSet, i, user.caught[user.equipped].moveSet, user.caught[user.equipped].PPSet) + "\n";
                }
                body += '\nPlease respond with the index of the attack you\'d like to use (1, 2, 3, 4)!';
            } else if(type == 2) {
                body += 'Here is your current party status:\n';
                body += returnPartyList(user);
                body += '\nPlease respond with the index of the Discit you\'re swapping to (1, 2, 3, 4, 5, 6)!';
            } else { // type == 3
                body += 'This is a list of items in your inventory:\nThere aren\'t any descriptions because this message could get kinda long, but you can always use the \'inventory\' command to find out more (remember, commands don\'t work in DMs).\n\n';
                for(let i = 0; i < user.inventory.length; i++) {
                    body += `(${i + 1}) **${user.inventory[i]}**    `;
                    if(i % 3 == 0) {
                        body += '\n';
                    }
                }
                body += '\nPlease respond with the index of the item you plan to use (1, 2, 3, etc)!';   
            }
            if(!mustSwap) {
                body += '\n*If you want to go back, type \'cancel\' - just watch out because you only get one of these per turn.*';
            }
           
            await userDiscord.send(returnEmbed(userDiscord, body, (mustSwap ? 'Who are you swapping to?' : 'Next, choose the move itself!')));

            const index = (await userDM.awaitMessages({ filter: msg => { // get index of attack (1, 2, 3, 4, etc)
                if(msg.author.bot) {
                    return false;
                }
                if(!mustSwap && msg.content.toLowerCase() == 'cancel') {
                    if(!canCancel) {
                        userDiscord.send(returnEmbed(userDiscord, 'You have already cancelled an attack this turn!', 'Error'));
                        return false;
                    }
                    return true;
                }
                return [attackFilter, swapFilter, itemFilter][type - 1](msg, userDiscord, user, other);
            }, max: 1, time: 30000, errors: ['time'] })).first().content.toLowerCase();

            if(index == 'cancel') {
                return await execute(player, user, userDiscord, other, false, mustSwap);
            }

            let targetIndex = -1;
            if(type == 3 && items[user.inventory[index - 1]].requiresTarget) {
                await userDiscord.send(returnEmbed(userDiscord, `It looks like the item you\'re using requires a target. Choose one:\n${returnPartyList(user)}\nPlease respond with the index of the Discit to target (1, 2, 3, 4, 5, 6)!\n*If you want to go back, type \'cancel\' - just watch out because you only get one of these per turn.*`, 'Choose a target!'));
                targetIndex = (await userDM.awaitMessages({ filter: msg => {
                    if(msg.author.bot) {
                        return false;
                    }
                    if(msg.content.toLowerCase() == 'cancel') {
                        if(!canCancel) {
                            userDiscord.send(returnEmbed(userDiscord, 'You have already cancelled an attack this turn!', 'Error'));
                            return false;
                        }
                        return true;
                    }
                    return targetFilter(msg, userDiscord, user, other, index);
                }, max: 1, time: 30000, errors: ['time'] })).first().content.toLowerCase();
            }

            if(targetIndex == 'cancel') {
                return await execute(player, user, userDiscord, other, false, mustSwap);
            }

            return [type, index, targetIndex]; // example: [1, 1, -1]
        } catch(e) {
            console.log(`User failed to take turn in battle: ${e}`);
            return Promise.reject(player);
        }
    }
    if(tag(user) == 'wild') {
        if(mustSwap) {
            return [2, 1, -1];
        }
        let realMoves = [];
        for(let i = 0; i < user.moveSet.length; i++) {
            if(user.moveSet[i] != 'Empty') {
                realMoves.push(i);
            }
        }
        const chosen = Math.floor(Math.random() * realMoves.length);
        return [1, realMoves[chosen] + 1, -1];
    }
    if(tag(user) == 'trainer') {
        if(user.caught[user.equipped].temphp < 1) {
            return [2, firstDisc(user) + 1, -1];
        }
        if(mustSwap) {
            return [2, user.equipped + 1, -1];
        }
        return trainers[user.index].AI(user, other.caught[other.equipped]);
    }
    return Promise.reject('getResults function is broken lmaooooo');
}

module.exports = execute;