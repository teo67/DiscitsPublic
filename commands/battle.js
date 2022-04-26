const checkForDiscs = require('../functions/checkForDiscs');
const firstDisc = require('../functions/firstDisc');
const getUserFromMention = require('../functions/getUserFromMention');
const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const doBattle = require('../functions/battle/doBattle');
const User = require('../classes/cls_user');
const getUser = require('../functions/getUser');
const initBattle = require('../functions/initBattle');

module.exports = new Command(
    'battle', 
    'Multiplayer',
    'This command challenges another user on your server to a battle.', 
    '[@player] [coin wager]',
    'Have an account, be in a Discit Station, have Discits in your party, not currently in combat (all of these apply to your opponent too), wager is above 0 but not more than either person has',
    {
        user: true, 
        battle: false, 
        args: {
            len: 2, 
            isInt: [false, true]
        }, 
        progression: 6, 
        location: 'Discit Station'
    },
    async (message, args, results) => {
        const user = results.user;
        const wager = results.parsedArgs[1];

        const p2Discord = await getUserFromMention(args[0]);
        if(p2Discord === undefined) {
            message.channel.send(returnEmbed(message.author, 'Make sure to @ your opponent in your first argument!', 'Error'));
            return;
        }
        const p2 = await getUser(p2Discord.id, message);
        if(!p2) {
            return;
        }
        if(p2.progression < 6) {
            message.channel.send(returnEmbed(message.author, 'The player you\'re challenging hasn\'t progressed far enough to participate in battles.', 'Error'));
            return;
        }
        if(!checkForDiscs(user)) {
            message.channel.send(returnEmbed(message.author, 'You have no discits in your party.', 'Error'));
            return; 
        }
        if(!checkForDiscs(p2)) {
            message.channel.send(returnEmbed(message.author, 'Your opponent has no discits in their party.', 'Error'));
            return; 
        }
        if(p2.battle !== undefined && p2.battle.timestamp !== undefined) {
            message.channel.send(returnEmbed(message.author, 'The targeted player is already in a battle', 'Error'));
            return; 
        }
        if(p2.namedLocation != 'Discit Station') {
            message.channel.send(returnEmbed(message.author, 'Your opponent isn\'t currently in a Discit Station.', 'Error'));
            return; 
        }
        if(wager < 1) {
            message.channel.send(returnEmbed(message.author, 'You can\'t wager 0 coins.', 'Error'));
            return; 
        }
        if(user.coins < wager) {
            message.channel.send(returnEmbed(message.author, 'You don\'t have that many coins to wager!', 'Error'));
            return; 
        }
        if(p2.coins < wager) {
            message.channel.send(returnEmbed(message.author, 'Your opponent doesn\'t have that many coins!', 'Error'));
            return;
        }
        const challenge = await message.channel.send(returnEmbed(message.author, `You challenged <@${p2._id}> to a battle! They can respond with 'accept' or 'decline' to make their decision.`, 'Battle Status'));
        try {
            const response = (await message.channel.awaitMessages({ filter: msg => { // get type of attack (1, 2, 3)
                return msg.author.id == p2._id && (msg.content.toLowerCase() == 'accept' || msg.content.toLowerCase() == 'decline');
            }, max: 1, time: 15000, errors: ['time'] })).first().content.toLowerCase();

            if(response == 'decline') {
                challenge.edit(returnEmbed(message.author, 'Your opponent declined the invite.', 'Battle Status'));
                return;
            }
        } catch(e) {
            console.log(`Invite failed: ${e}`);
            challenge.edit(returnEmbed(message.author, 'Invite expired :P', 'Battle Status'));
            return;
        }
        initBattle(user, message.author, p2, message.channel, false, p2Discord, wager);
        return;
    }
);