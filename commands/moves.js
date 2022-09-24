const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const returnMoveList = require('../functions/returnMoveList');

module.exports = new Command(
    'moves', 
    'Utility',
    'This command prints a list of the moves that are currently equipped on the selected Discit. It will also give a short description of each attack.',
    '',
    'Have an account, have a Discit selected',
    {
        user: true, 
        equipped: true
    },
    (message, args, results) => {
        const user = results.user;
        const equipped = results.equipped;
        let returning = '';
        for(let i = 0; i < 4; i++) {
            returning += returnMoveList(user.caught[equipped].moveSet, i, user.caught[equipped].moveSet, user.caught[equipped].PPSet) + '\n';
        }
        message.channel.send(returnEmbed(message.author, returning, 'Here are the moves you have equipped:'));
        return;
    }
);       
      