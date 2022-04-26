const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');
const isInt = require('../functions/isInt');
const returnPartyList = require('../functions/returnPartyList');

module.exports = new Command(
    'party', 
    'Utility',
    'This command can be used to view and edit your party. If you supply two integer arguments, you can add a Discit to your party. Otherwise, this command will show you the discits in your party.', 
    '[index of added Discit (use \'list\') (optional)] [party slot (between 1 and 6) (also optional)]',
    'Have an account. Requirements for editing your party: Be in a Discit Station, the chosen Discit has attacks equipped, can\'t be used during combat, can\'t equip the same Discit more than once',
    {
        user: true, 
        progression: 3,
    },
    (message, args, results) => {
        const user = results.user;

        if(args.length > 1 && isInt(args[0]) && isInt(args[1])) {
            const arg = [parseInt(args[0]), parseInt(args[1])];
            if(user.namedLocation != 'Discit Station') {
                message.channel.send(returnEmbed(message.author, 'You have to be in a Discit Station to edit your party!', 'Error'));
            } else if(user.battle !== undefined && user.battle.timestamp !== undefined) {
                message.channel.send(returnEmbed(message.author, 'This command cannot be used in battle (unless you\'re just viewing your party).', 'Error'));
            } else if(arg[0] > user.caught.length || arg[0] == 0) {
                message.channel.send(returnEmbed(message.author, 'The first argument should be an index to one of your available Discits.', 'Error'));
            } else if(arg[1] > 6 || arg[1] == 0) {
                message.channel.send(returnEmbed(message.author, 'The second argument should be an integer between 1 and 6.', 'Error'));
            } else if(user._party.includes(arg[0] - 1)) {
                message.channel.send(returnEmbed(message.author, 'You already have that discit equipped.', 'Error'));
            } else if(user.caught[arg[0] - 1].moveSet[0] == 'Empty' && user.caught[arg[0] - 1].moveSet[1] == 'Empty' && user.caught[arg[0] - 1].moveSet[2] == 'Empty' && user.caught[arg[0] - 1].moveSet[3] == 'Empty') {
                message.channel.send(returnEmbed(message.author, 'Make sure you equip some attacks onto that Discit before putting it in your party.', 'Error'));
            } else {
                User.partySelect(user, arg[0] - 1, arg[1] - 1);
                if(user.progression == 4) {
                    User.makeProgress(user);
                    User.blacklistTrigger(user, 2);
                }
                message.channel.send(returnEmbed(message.author, `Ok, ${User.party(user, arg[1] - 1).nickname} has been equipped in slot ${arg[1]}. ${(user.progression == 5) ? '\n\nYou\'re all done setting up your Discit! Use \'d!map\' to continue your journey.' : ''}`, 'Successfully Equipped!'));
                return;
            }
            return;
        }

        message.channel.send(returnEmbed(message.author, returnPartyList(user), 'Here are the discits in your party:'));
        return;
    }
);        
      