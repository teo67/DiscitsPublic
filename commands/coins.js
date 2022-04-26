const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');

module.exports = new Command(
    'coins', 
    'Currency',
    'This command checks your current coin balance. Coins can be used to purchase items and to battle other players.', 
    '',
    'Has registered for an account',
    {
        user: true
    },
    (message, args, results) => {
        const user = results.user;
        message.channel.send(returnEmbed(message.author, `You have ${user.coins} coins in your wallet.`, 'Balance'));
        return;
    }
);