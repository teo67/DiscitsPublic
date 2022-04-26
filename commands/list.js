const returnEmbed = require('../functions/returnEmbed');
const isInt = require('../functions/isInt');
const Command = require('../classes/cls_command');

module.exports = new Command(
    'list', 
    'Utility',
    'This command prints a list of every Discit you own and the index of that Discit.', 
    '',
    'Has registered for an account',
    {
        user: true
    },
    (message, args, results) => {
        const user = results.user;
        
        if(user.caught.length < 1) {
            message.channel.send(returnEmbed(message.author, 'You don\'t have any Discits yet! Maybe you still need to pick your starter Discit from the professor.', 'Your Discits'));
            return;
        }
        let arg0 = 1;
        if(args.length > 0 && isInt(args[0]) && parseInt(args[0]) > 1) {
            arg0 = parseInt(args[0]);
        }
        if(arg0 != 1 && user.caught.length <= (arg0 - 1) * 6) {
            message.channel.send(returnEmbed(message.author, 'You don\'t have that many Discits! Try using a smaller number for your argument.', 'Error'));
            return;
        }

        let returning = `Showing Discits ${(arg0 - 1) * 6 + 1} - ${Math.min(user.caught.length, arg0 * 6)} of ${user.caught.length}:\n`;
        for(let i = (arg0 - 1) * 6; i < Math.min(user.caught.length, arg0 * 6); i++) {
            let nick = user.caught[i].nickname;
            if(nick == user.caught[i]._base) {
                nick = `*No nickname*`;
            } else {
                nick = `*"${nick}"*`;
            }
            returning += `\n${i + 1}: ${user.caught[i]._base} (Level ${user.caught[i].level}) ${nick}`;
        }
        message.channel.send(returnEmbed(message.author, returning, `Here's a list of your Discits:`));
        return;
    }
);