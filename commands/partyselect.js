const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');

module.exports = new Command(
    'partyselect', 
    'Utility',
    'This command selects a Discit you own so that you can change its nickname, equip attacks, etc.', 
    '[index of Discit in your party (use \'party\' with no arguments)]',
    'Have an account, can\'t be used while in combat (your selected Discit in combat counts as the one that is currently fighting)',
    {
        user: true, 
        battle: false, 
        args: {
            len: 1, 
            isInt: [true]
        }
    },
    (message, args, results) => {
        const user = results.user;
        const asInt = results.parsedArgs[0];

        if(asInt > user._party.length || asInt == 0) {
            message.channel.send(returnEmbed(message.author, 'You don\'t have that many discits in your party!', 'Error'));
            return;
        }

        if(user._party[asInt - 1] == -1) {
            message.channel.send(returnEmbed(message.author, `You don\'t have a Discit equipped in slot ${asInt}!`, 'Error'));
            return;
        }

        User.equip(user, user._party[asInt - 1]);
        message.channel.send(returnEmbed(message.author, `Ok, you selected ${user.caught[user.equipped].nickname}!`, 'Successfully Selected!'));
        return;
    }
);