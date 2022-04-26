const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');

module.exports = new Command(
    'select', 
    'Utility',
    'This command selects a Discit you own so that you can change its nickname, equip attacks, etc.', 
    '[index of Discit in your collection (use \'list\')]',
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

        if(asInt > user.caught.length || asInt == 0) {
            message.channel.send(returnEmbed(message.author, 'You don\'t have that many discits!', 'Error'));
            return;
        }

        User.equip(user, asInt - 1);
        message.channel.send(returnEmbed(message.author, `Ok, you selected ${user.caught[asInt - 1].nickname}! ${(user.progression == 3) ? '\n\nNext, use \'d!equip 1 1\' to equip this Discit\'s first attack into slot 1.' : ''}`, 'Successfully Selected!'));
        return;
    }
);