const returnEmbed = require('../functions/returnEmbed');
const isInt = require('../functions/isInt');
const items = require('../lists+constants/items');
const Command = require('../classes/cls_command');

module.exports = new Command(
    'shop', 
    'Currency',
    'View a list of items and their prices in the shop. There\'s also a second page, which has a few extra items.', 
    '[page number (optional)]',
    'Has an account, is not in combat, is in a Discit Station',
    {
        user: true, 
        battle: false, 
        location: 'Discit Station', 
        progression: 6
    },
    (message, args, results) => {

        let arg0 = 1;
        if(args.length > 0 && isInt(args[0]) && parseInt(args[0]) > 1) {
            arg0 = parseInt(args[0]);
        }

        let shop = [];
        for(const key of Object.keys(items)) {
            if(items[key].price > 0) {
                shop.push(key);
            }
        }
        
        if(arg0 != 1 && shop.length <= (arg0 - 1) * 6) {
            message.channel.send(returnEmbed(message.author, 'There aren\'t that many items available in the shop right now!', 'Error'));
        } else {
            let returning = `Items ${(arg0 - 1) * 6 + 1} - ${Math.min(shop.length, arg0 * 6)} of ${shop.length}:`;
            for(let i = (arg0 - 1) * 6; i < Math.min(shop.length, arg0 * 6); i++) {
                returning += `\n\n${i + 1}: ${shop[i]} - ${items[shop[i]].price} coins`;
                returning += `\n*${items[shop[i]].description}*`;
            }
            message.channel.send(returnEmbed(message.author, returning, 'Shop'));
        }

        return;
    }
);
