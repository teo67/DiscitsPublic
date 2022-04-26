const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const client = require('../lists+constants/fundamentals').client;

module.exports = new Command(
    'suggest', 
    'Multiplayer',
    'Suggest a bug fix or potential improvement to the Discits bot.',
    '[suggestion text]',
    'None', 
    {
        args: {
            len: 1
        }
    },
    async (message, args, results) => {
        try {
            const supportServer = await client.guilds.fetch('925940436340707368');
            const suggestionChannel = await supportServer.channels.fetch('928129456189624391');
            let mainArg = '';
            for(let i = 0; i < args.length; i++) {
                mainArg += args[i];
                if(i != args.length - 1) {
                    mainArg += ' ';
                }
            }
            const now = new Date();
            const msg = await suggestionChannel.send(returnEmbed(message.author, 
                `${mainArg}\n\n**Suggested by <@${message.author.id}>.**`, 
                `Suggestion on ${now.getUTCMonth() + 1}/${now.getUTCDate()}/${now.getUTCFullYear()}   🔺🔻`
            ));
            await msg.react('🔺');
            await msg.react('🔻');
        } catch(e) {
            console.log(e);
            message.channel.send(returnEmbed(message.author, 'There was an error getting to the servers. Try again later!', 'Error'));
            return;
        }
        message.channel.send(returnEmbed(message.author, 'Suggestion added. Check #suggestions on the official server for updates on your suggestion\'s status.\n*Not on the server? Use the link below:*\n**https://discord.gg/vGzHjAz6ue**', 'Suggested!'));
    }
); 

