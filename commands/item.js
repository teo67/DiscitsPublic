const returnEmbed = require('../functions/returnEmbed');
const isInt = require('../functions/isInt');
const Command = require('../classes/cls_command');
const items = require('../lists+constants/items');
const User = require('../classes/cls_user');

module.exports = new Command(
    'item', 
    'Utility',
    'This command allows you to use an item from your inventory while not in battle.', 
    '[index of item in your inventory] [index of Discit in party to use it on (only required for some items)]',
    'Has an account, is not in combat, item is usable',
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
        const arg0 = results.parsedArgs[0];

        if(user.inventory.length < arg0) {
            message.channel.send(returnEmbed(message.author, 'It looks like the index you mentioned is out of range. Use \'inventory\' to check your items.', 'Error'));
            return;
        } 
        const theItem = user.inventory[arg0 - 1];
        if(items[theItem].requiresTarget) {
            if(args.length < 2) {
                message.channel.send(returnEmbed(message.author, 'Hmm, it looks like you need to target a Discit in your party in order to use that item.', 'Error'));
                return;
            }
            if(!isInt(args[1])) {
                message.channel.send(returnEmbed(message.author, 'Make sure the specify the index of the targeted Discit in your party to use this item.', 'Error'));
                return;
            }
            const arg1 = parseInt(args[1]);
            if(arg1 > 6) {
                message.channel.send(returnEmbed(message.author, 'Your second argument should be between 1 and 6, because you can only have 6 Discits in your party at once.', 'Error'));
                return;
            } 
            if(user._party[arg1 - 1] == -1) {
                message.channel.send(returnEmbed(message.author, 'You don\'t have a Discit equipped in that slot in your party. Use \'party\' to view your current setup.', 'Error'));
                return;
            }
            if(!items[theItem].condition(user, false, arg1 - 1, false)) {
                message.channel.send(returnEmbed(message.author, 'You can\'t use that item right now. It\'s possible that it can only be used in battle.', 'Error'));
                return;
            }
            User.loseItem(user, theItem);
            message.channel.send(returnEmbed(message.author, items[theItem].func(user, false, arg1 - 1)[0], `You used a ${theItem}!`));
            return;
        } else if(!items[theItem].condition(user, false, -1, false)) {
            message.channel.send(returnEmbed(message.author, 'You can\'t use that item right now... maybe it\'s something that you have to use in battle.', 'Error'));
            return;
        } else {
            User.loseItem(user, theItem);
            message.channel.send(returnEmbed(message.author, items[theItem].func(user, false, -1)[0], `You used a ${theItem}!`));
            return;
        }
    }
);