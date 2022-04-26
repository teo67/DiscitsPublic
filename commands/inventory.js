const returnEmbed = require('../functions/returnEmbed');
const isInt = require('../functions/isInt');
const Command = require('../classes/cls_command');
const items = require('../lists+constants/items');

module.exports = new Command(
    'inventory', 
    'Utility',
    'This command will print out a list of items in your inventory. If you specify a page in your inventory, you can find items more easily.', 
    '[inventory page (optional)]',
    'Has registered for an account',
    {
        user: true
    },
    (message, args, results) => {
        const user = results.user;
        let arg0 = 1;
        if(args.length > 0 && isInt(args[0]) && parseInt(args[0]) > 1) {
            arg0 = parseInt(args[0]);
        }

        if(user.inventory.length < 1) {
            message.channel.send(returnEmbed(message.author, 'It\'s empty!', 'Error'));
        } else if(arg0 != 1 && user.inventory.length <= (arg0 - 1) * 6) {
            message.channel.send(returnEmbed(message.author, 'You don\'t have that much stuff in your inventory! Try using a smaller number as your argument.', 'Error'));
        } else {
            let returning = `Items ${(arg0 - 1) * 6 + 1} - ${Math.min(user.inventory.length, arg0 * 6)} of ${user.inventory.length}:`;
            for(let i = (arg0 - 1) * 6; i < Math.min(user.inventory.length, arg0 * 6); i++) {
                returning += `\n\n${i + 1}: ${user.amounts[i]} ${user.inventory[i]}(s)`;
                returning += `\n*${items[user.inventory[i]].description}*`;
            }
            message.channel.send(returnEmbed(message.author, returning, 'Your Inventory'));
        }
        return;
    }
);