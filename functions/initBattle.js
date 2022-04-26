const tag = require('./tag');
const returnEmbed = require('./returnEmbed');
const User = require('../classes/cls_user');
const firstDisc = require('./firstDisc');
const doBattle = require('./battle/doBattle');
const trainers = require('../lists+constants/trainers');

const execute = async (user, userDiscord, p2, channel, porting = false, p2Discord = null, wager = 0) => {
    let p1partyindex = porting ? null : firstDisc(user);
    let p1index = porting ? user.equipped : user._party[p1partyindex];
    const p2tag = tag(p2);
    
    try {
        await userDiscord.send(returnEmbed(userDiscord, `Checking DM status... complete!\n\nYou sent in ${user.caught[p1index].nickname}!`, 'Hello!'));
    } catch(e) {
        console.log(e);
        channel.send(returnEmbed(userDiscord, 'The bot was\'t able to DM you, so you\'ve been sent to the nearest Discit Station. Try checking your privacy settings.', 'Error'));
        user.battle = undefined;
        if(!p2tag == 'user') { // no need to respawn if its pvp, youre already in a discit station
            User.respawn(user);
        } else {
            p2.battle = undefined; // if you ARE battling a user, cancel it.
        }
        return;
    }
    let p2partyindex;
    let p2index;
    if(p2tag == 'user') { // is uid
        p2partyindex = porting ? null : firstDisc(p2);
        p2index = porting ? p2.equipped : p2._party[p2partyindex];
        try {
            await p2Discord.send(returnEmbed(p2Discord, `Checking DM status... complete!\n\nYou sent in ${p2.caught[p2index].nickname}!`, 'Hello!'));
        } catch(e) {
            console.log(e);
            channel.send(returnEmbed(p2Discord, 'The bot was not able to DM player 2, so the battle has been cancelled. Try checking your privacy settings.', 'Error'));
            user.battle = undefined;
            p2.battle = undefined;
            return;
        }
    }

    if(!porting) { // setup 
        User.equip(user, p1index);
        user.battle = {
            timestamp: Date.now(), 
            paused: false,
            mustSwap: false, 
            p1participated: [p1partyindex]
        };
        if(p2tag == 'user') {
            User.equip(p2, p2index);
            User.loseCoins(user, wager);
            User.loseCoins(p2, wager);
            user.battle.uid = p2._id;
            user.battle.p2participated = [p2partyindex];
            user.battle.wager = wager * 2;
            p2.battle = {
                timestamp: Date.now(), 
                paused: false,
                uid: user._id
            };
            channel.send(returnEmbed(userDiscord, 'Let the battle begin! The bot will DM both players to start.', 'Battle Status'));
        } else if(p2tag == 'trainer') {
            user.battle.p2participated = [];
            user.battle.wager = trainers[p2.index].money;
            user.battle.trainer = p2;
            channel.send(returnEmbed(userDiscord, `>> **"${trainers[p2.index].greeting}"**\n❗❗ You entered combat ❗❗ \nMake sure to DM the bot with your choice of attack! <<`, `You have been challenged by ${trainers[p2.index].name}!`, []));
        } else if(p2tag == 'wild') {
            user.battle.p2participated = [];
            user.battle.wager = 0;
            user.battle.wild = p2;
            channel.send(returnEmbed(userDiscord, `❗❗ You entered combat with a wild ${p2._base} ❗❗ \nMake sure to DM the bot with your choice of attack!`, 'A wild Discit appeared!', []));
        }
    }
    
    doBattle(user, userDiscord, p2tag, (p2tag == 'user') ? p2 : null, (p2tag == 'user') ? p2Discord : null);
}

module.exports = execute;