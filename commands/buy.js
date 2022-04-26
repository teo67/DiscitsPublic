const returnEmbed = require('../functions/returnEmbed');
const isInt = require('../functions/isInt');
const items = require('../lists+constants/items');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');

module.exports = new Command(
    'buy', 
    'Currency',
    'Purchase an item from the shop.', 
    '[amount to buy (optional)] [item name]',
    'Has an account, is not in combat, is in a Discit Station, has enough coins to purchase item',
    {
        user: true, 
        battle: false, 
        progression: 6,
        location: 'Discit Station', 
        args: {
            len: 1
        }
    },
    (message, args, results) => {
        const user = results.user;
        let mainArg = '';
        for(let i = (isInt(args[0]) ? 1 : 0); i < args.length; i++) {
            mainArg += args[i];
            if(i != args.length - 1) {
                mainArg += ' ';
            }
        }

        let arg0 = 1;
        if(isInt(args[0])) {
            arg0 = parseInt(args[0]);
        }

        if(arg0 < 1) {
            message.channel.send(returnEmbed(message.author, 'You gotta buy at least one!', 'Error'));
            return;
        }

        if(items[mainArg] === undefined) {
            message.channel.send(returnEmbed(message.author, 'That item does not exist! Make sure you have the right capitalization!', 'Error'));
            return;
        }

        if(items[mainArg].price < 1) {
            message.channel.send(returnEmbed(message.author, 'That item isn\'t available in the shop!', 'Error'));
            return;
        }
        
        if(items[mainArg].price * arg0 > user.coins) {
            message.channel.send(returnEmbed(message.author, `You need ${items[mainArg].price * arg0} coins to buy that many, and you only have ${user.coins}!`, 'Error'));
            return;
        }

        User.gainItem(user, mainArg, arg0);
        User.loseCoins(user, items[mainArg].price * arg0);
        message.channel.send(returnEmbed(message.author, `You purchased ${arg0} ${mainArg}(s)! You now have ${user.coins} coins left to spend.`, 'Purchase Successful!'));
        return;
    }
);