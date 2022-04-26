const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');

module.exports = new Command(
    'profile', 
    'Multiplayer',
    'This command will show you some helpful information such as your location and the number of Discits you\'ve caught.', 
    '',
    'Has registered for an account',
    {
        user: true
    },
    (message, args, results) => {
        const user = results.user;

        let returning = '';
        if(user.equipped != -1) {
            returning += `Equipped Discit: ${user.caught[user.equipped].nickname} (level ${user.caught[user.equipped].level}).\n`;
        }
        const allCaught = user.caught;
        let highest = [null, -1];
        for(let i = 0; i < allCaught.length; i++) {
            if(allCaught[i].level >= highest[1]) {
                highest = [allCaught[i], allCaught[i].level];
            }
        }
        if(highest[0]) {
            returning += `*Highest level Discit:* ${highest[0].nickname} (level ${highest[1]}).\n`;
        }
        returning += `Total Discits caught - ${allCaught.length} (${user.discidex.length} of them are unique).\n\n`;
        returning += `Coin balance - ${user.coins}.\n`;
        returning += `Current location - ${user.namedLocation}.`;
        message.channel.send(returnEmbed(message.author, returning, `**These are your stats:**\n\n`));
        return;
    }
);