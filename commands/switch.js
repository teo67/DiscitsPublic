const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');

module.exports = new Command(
    'switch', 
    'Utility',
    'Swap around the positions of two Discits in your party.', 
    '[index of Discit #1 in your party] [index of Discit #2 in your party]',
    'Have an account, can\'t be used while in combat, both arguments should be positive integers that refer to slots in your party',
    {
        user: true, 
        battle: false, 
        args: {
            len: 2, 
            isInt: [true, true]
        }
    },
    (message, args, results) => {
        const user = results.user;
        const arg = results.parsedArgs;

        for(const i of arg) {
            if(i < 1 || i > 6) {
                message.channel.send(returnEmbed(message.author, 'Both arguments should be integers between 1 and 6', 'Error'));
                return;
            }
        }

        const saved = user._party[arg[0] - 1];
        user._party[arg[0] - 1] = user._party[arg[1] - 1];
        user._party[arg[1] - 1] = saved;

        message.channel.send(returnEmbed(message.author, `Ok, the two party slots have been swapped!`, 'Successfully Switched!'));
        return;
    }
);