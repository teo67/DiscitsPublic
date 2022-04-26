const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const attacks = require('../lists+constants/attacks');

module.exports = new Command(
    'allmoves', 
    'Utility',
    'This command prints a list of all learned moves on the Discit currently selected.', 
    '',
    'Have an account, have a Discit selected (check out the \'select\' command)',
    {
        user: true, 
        equipped: true, 
        battle: false, 
    },
    (message, args, results) => {
        const user = results.user;
        const equipped = results.equipped;

        let returning = ``;
        for(let i = 0; i < user.caught[equipped].fullMoves.length; i++) {
            returning += `\n${i + 1}: ${user.caught[equipped].fullMoves[i]} `; // 16 chars (approx.)
            returning += `(type: ${attacks[user.caught[equipped].fullMoves[i]].element})`;
            if(user.caught[equipped].moveSet.includes(user.caught[equipped].fullMoves[i])) {
                returning += ` - *equipped*`;
            }
        }
        message.channel.send(returnEmbed(message.author, returning, `These are ${user.caught[equipped].nickname}'s available moves.`));
        return;
    }
);           
            
            
            