const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');
const Caught = require('../classes/cls_caught');

module.exports = new Command(
    'equip', 
    'Utility',
    'This command equips an attack on the Discit you currently have selected.', 
    '[index of new attack in the full list (use \'allmoves\')] [attack slot (1 - 4)]',
    'Have an account, be in a Discit Station, have a Discit selected, can\'t be used during combat, can\'t equip the same move more than once',
    {
        user: true, 
        progression: 3, 
        args: {
            len: 2, 
            isInt: [true, true]
        }, 
        battle: false, 
        equipped: true, 
        location: 'Discit Station'
    },
    (message, args, results) => {
        const user = results.user;
        const equipped = results.equipped;
        const arg = results.parsedArgs;

        if(arg[0] > user.caught[equipped].fullMoves.length || arg[0] == 0) {
            message.channel.send(returnEmbed(message.author, 'The first argument should be an index to one of your available moves.', 'Error'));
        } else if(arg[1] > 4 || arg[1] == 0) {
            message.channel.send(returnEmbed(message.author, 'The second argument should be either 1, 2, 3, or 4.', 'Error'));
        } else {
            if(user.caught[equipped].moveSet.includes(user.caught[equipped].fullMoves[arg[0] - 1])) {
                message.channel.send(returnEmbed(message.author, 'You already have that move equipped.', 'Error'));
            } else {
                Caught.setMove(user.caught[equipped], arg[0] - 1, arg[1] - 1);
                if(user.progression == 3) {
                    User.makeProgress(user);
                }
                message.channel.send(returnEmbed(message.author, `Ok, ${user.caught[equipped].moveSet[arg[1] - 1]} has been equipped in slot ${arg[1]}. ${(user.progression == 4) ? '\n\nGreat job equipping an attack! In order to begin using your Discit, do \'d!party 1 1\' to place your first Discit into slot 1 of your party.' : ''}`, 'Successfully Equipped!'));
                return;
            }
        }
        return;
    }
);        
      