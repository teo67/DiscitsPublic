const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const getUserFromMention = require('../functions/getUserFromMention');
const findUser = require('../functions/findUser');
const isInt = require('../functions/isInt');
const Trade = require('../classes/cls_trade');
const User = require('../classes/cls_user');
const Caught = require('../classes/cls_caught');

module.exports = new Command(
    'trade', 
    'Premium',
    'Trade Discits with other members of your server!', 
    '[@player]',
    'Has registered for an account, has at least Tier 2 Premium (the other player doesn\'t have to have premium), is not in battle, is in a Discit Station',
    {
        user: true, 
        args: {
            len: 1
        },
        premium: 2,
        battle: false,
        location: 'Discit Station'
    },
    async (message, args, results) => {
        const user = results.user;

        const p2Discord = await getUserFromMention(args[0]);
        if(p2Discord === undefined) {
            message.channel.send(returnEmbed(message.author, 'Make sure to @ your opponent in your first argument!', 'Error'));
            return;
        }
        const p2 = await (async () => {
            try {
                const player = await findUser(p2Discord.id);
                if(!player) {
                    message.channel.send(returnEmbed(message.author, 'That user doesn\'t have an account with us yet.', 'Error'));
                    return null;
                } 
                return player;
            } catch(e) {
                console.log(e);
                message.channel.send(returnEmbed(message.author, 'Sorry, we couldn\'t get to the server!', 'Error'));
                return null;
            }
        })();

        if(!p2) {
            return;
        }

        const invite = await message.channel.send(returnEmbed(message.author, `You invited <@${p2._id}> to a trade! They have 15 seconds to accept or decline.`, 'Trade Invite'));
        try {
            const response = (await message.channel.awaitMessages({ filter: msg => { // get type of attack (1, 2, 3)
                return msg.author.id === p2._id && (msg.content.toLowerCase() == 'accept' || msg.content.toLowerCase() == 'decline');
            }, max: 1, time: 15000, errors: ['time'] })).first().content.toLowerCase();
    
            if(response == 'decline') {
                invite.edit(returnEmbed(message.author, 'Invite declined...', 'Trade Invite'));
                return;
            }
        } catch(e) {
            console.log(`Trade failed: ${e}`);
            invite.edit(returnEmbed(message.author, 'Invite expired...', 'Trade Invite'));
            return;
        }

        await message.channel.send(returnEmbed(message.author, `Both players will now have 30 seconds to add Discits and items to their trade!
        \nAfterwards, they'll have another 30 to review both sides of the trade and and edit their setups accordingly.
        \nFinally, each player will have 15 seconds to accept or decline the trade.
        \nIn order to add a Discit, use '+ d x', where x is the index of that Discit in your collection. Remember, you can use d!list to view your collection.
        \nAdding items works the same, just use '+ i x' instead, where x is the index of that item in your inventory. In order to remove items or Discits, use '- d x' or '- i x' instead.`, 'Trade Info'));

        let p1living = [];
        let p2living = [];

        for(const p of [[p1living, user], [p2living, p2]]) {
            for(let i = 0; i < p[1]._party.length; i++) {
                if(p[1]._party[i] != -1 && p[1].caught[p[1]._party[i]].temphp > 0) {
                    p[0].push(p[1]._party[i] + 1);
                }
            }
        }

        const trade = new Trade(p1living, p2living);

        const getData = async () => {
            await message.channel.awaitMessages({ filter: msg => {
                if(msg.author.id !== user._id && msg.author.id !== p2._id) {
                    return false;
                }
                const content = msg.content.toLowerCase();
                let author = (msg.author.id === user._id ? [user, 1, trade.p1] : [p2, 2, trade.p2]);
                if(content.length < 5) {
                    message.channel.send(returnEmbed(msg.author, 'Your message should be at least 5 characters long.', 'Error'));
                    return false;
                }
                let arg = content.slice(4);
                if(!isInt(arg)) {
                    message.channel.send(returnEmbed(msg.author, 'Your last argument should be an integer greater than 0.', 'Error'));
                    return false;
                }
                arg = parseInt(arg);
                if(arg < 1) {
                    message.channel.send(returnEmbed(msg.author, 'Your last argument has to be at least 1.', 'Error'));
                    return false;
                }

                if(content[2] == 'd'){
                    if(arg > author[0].caught.length) {
                        message.channel.send(returnEmbed(msg.author, 'You don\'t have that many Discits!', 'Error'));
                        return false;
                    }
                    if(content[0] == '+') {
                        let okay = false;
                        for(const living of author[2].living) {
                            if((!author[2].discits.includes(living)) && arg != living) {
                                okay = true;
                                break;
                            }
                        }
                        if(!okay) {
                            message.channel.send(returnEmbed(msg.author, 'You can\'t add all living Discits in your party!', 'Error'));
                            return false;
                        }
                        message.channel.send(returnEmbed(msg.author, `✅ Added *${author[0].caught[arg - 1].nickname}*`, 'Trade Status'));
                        trade.addDiscit(author[1], arg);
                        return true;
                    } else if(content[0] == '-') {
                        message.channel.send(returnEmbed(msg.author, `✅ Removed *${author[0].caught[arg - 1].nickname}*`, 'Trade Status'));
                        trade.removeDiscit(author[1], arg);
                        return true;
                    } else {
                        message.channel.send(returnEmbed(msg.author, 'Your first argument should be either + or - .', 'Error'));
                        return false;
                    }
                } else if(content[2] == 'i'){
                    if(arg > author[0].inventory.length) {
                        message.channel.send(returnEmbed(msg.author, 'You don\'t have that many items!', 'Error'));
                        return false;
                    }
                    if(content[0] == '+') {
                        message.channel.send(returnEmbed(msg.author, `✅ Added 1x *${author[0].inventory[arg - 1]}*`, 'Trade Status'));
                        trade.addItem(author[1], arg, author[0]);
                        return true;
                    } else if(content[0] == '-') {
                        message.channel.send(returnEmbed(msg.author, `✅ Removed 1x *${author[0].inventory[arg - 1]}*`, 'Trade Status'));
                        trade.removeItem(author[1], arg);
                        return true;
                    } else {
                        message.channel.send(returnEmbed(msg.author, 'Your first argument should be either + or - .', 'Error'));
                        return false;
                    }
                } else {
                    message.channel.send(returnEmbed(msg.author, 'Your second argument should be either d or i.', 'Error'));
                    return false;
                }
            }, time: 30000 });
        }
        
        const getDisplay = () => {
            let returning = '';
            for(const set of [[trade.p1, user], [trade.p2, p2]]) {
                returning += `\nHere is what <@${set[1]._id}> has to offer so far:\n*DISCITS*\n`;
                if(set[0].discits.length > 0) {
                    for(let i = 0; i < set[0].discits.length; i++) {
                        const selected = set[1].caught[set[0].discits[i] - 1];
                        returning += `${i + 1}: Level ${selected.level} ${selected._base} - *${(selected.nickname == selected._base ? 'No nickname' : `"${selected.nickname}"`)}*\n`;
                    }
                } else {
                    returning += `None\n`;
                }
                returning += `\n*ITEMS*\n`;
                if(set[0].items.length > 0) {
                    for(let i = 0; i < set[0].items.length; i++) {
                        returning += `${i + 1}: ${set[1].inventory[set[0].items[i] - 1]} x ${set[0].amounts[i]} (they have ${set[1].amounts[set[0].items[i] - 1]} in inventory)\n`;
                    }
                } else {
                    returning += `None\n`;
                }
            }
            return returning;
        }

        const sendAsMultiple = (author, returning, title) => {
            for(let finalIndex = 0; finalIndex < returning.length; finalIndex += 2000) {
                message.channel.send(returnEmbed(author, returning.slice(finalIndex, Math.min(finalIndex + 2000, returning.length)), title));
            }
        }

        await getData();
        sendAsMultiple(message.author, 'Now you\'ll have 30 more seconds to review and edit your trades.\n' + getDisplay(), 'Step 2');
        await getData();
        sendAsMultiple(message.author, 'Time to make the final decision.\n' + getDisplay(), 'Final Step');

        for(const p of [message.author, p2Discord]) {
            const sent = await message.channel.send(returnEmbed(p, `<@${p.id}>, type 'accept' or 'decline.' You have 15 seconds to do so.`, 'Trade Status'));
            try {
                const response = (await message.channel.awaitMessages({ filter: msg => {
                    return msg.author.id === p.id && (msg.content.toLowerCase() == 'accept' || msg.content.toLowerCase() == 'decline');
                }, max: 1, time: 15000, errors: ['time'] })).first().content.toLowerCase();
        
                if(response == 'decline') {
                    await sent.edit(returnEmbed(message.author, `<@${p.id}> declined the trade... maybe some other time.`, 'Trade Canceled'));
                    return;
                }
            } catch(e) {
                console.log(`Trade failed: ${e}`);
                await sent.edit(returnEmbed(message.author, `<@${p.id}> ran out of time, so the trade has been canceled... maybe some other time.`, 'Trade Canceled'));
                return;
            }
        }
        
        let returning = '';
        for(let i = 0; i < 2; i++) {
            const giver = [user, p2][i];
            const giverTrade = [trade.p1, trade.p2][i];
            const receiver = [p2, user][i];
            for(const givenDiscit of giverTrade.discits) {
                const asDiscit = giver.caught[givenDiscit - 1];
                returning += `<@${giver._id}> gave <@${receiver._id}> their level ${asDiscit.level} ${asDiscit._base}!\n`;
                giver.caught.splice(givenDiscit - 1, 1);
                User.newCatch(receiver, JSON.parse(JSON.stringify(asDiscit))); // hard copy fuck you mongoose
                for(let i = 0; i < 6; i++) {
                    if(giver._party[i] != -1) {
                        if(giver._party[i] == givenDiscit - 1) {
                            giver._party[i] = -1;
                        } else if(giver._party[i] > givenDiscit - 1) {
                            giver._party[i]--;
                        }
                    }
                }
                if(giver.equipped == givenDiscit - 1) {
                    giver.equipped = -1;
                } else if(giver.equipped > givenDiscit - 1) {
                    giver.equipped--;
                }
            }

            for(let i = 0; i < giverTrade.items.length; i++) {
                const asItem = giver.inventory[giverTrade.items[i] - 1];
                returning += `<@${giver._id}> gave <@${receiver._id}> ${giverTrade.amounts[i]} ${asItem}(s)!\n`;
                User.gainItem(receiver, asItem, giverTrade.amounts[i]);
                User.loseItem(giver, asItem, giverTrade.amounts[i]);
            }
        }
        sendAsMultiple(message.author, returning, 'Trade Results');

        await p2.save();
        return;
    }
);