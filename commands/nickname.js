const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const Caught = require('../classes/cls_caught');

module.exports = new Command(
    'nickname', 
    'Utility',
    'This command edits the nickname on the Discit you currently have equipped.',
    '[new name]',
    'Have an account, have a Discit selected', 
    {
        user: true, 
        args: {
            len: 1
        }, 
        equipped: true, 
        battle: false
    },
    (message, args, results) => {
        const user = results.user;
        const equipped = results.equipped;

        let joined = '';
        for(let i = 0; i < args.length; i++) {
            joined += args[i];
            if(i != args.length - 1) {
                joined += ' ';
            }
        }

        if(joined.length > 16) {
            message.channel.send(returnEmbed(message.author, 'The nickname should be 16 characters or less!', 'Error'));
            return;
        }

        Caught.setNickname(user.caught[equipped], joined);
        message.channel.send(returnEmbed(message.author, `Your ${user.caught[equipped]._base} is now nicknamed "${joined}".`, 'Rename Successful!'));
        return;
    }
);