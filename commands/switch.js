const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');
const getIntButton = require('../functions/getIntButton.js');
const l = require('../functions/limitText.js');
const Discord = require('../lists+constants/fundamentals.js').Discord;
const findUser = require('../functions/findUser.js');
module.exports = new Command(
    'switch', 
    'Utility',
    'Swap around the positions of two Discits in your party.', 
    '',
    'Have an account, can\'t be used while in combat',
    {
        user: true, 
        battle: false
    },
    async (message, args, results) => {
        const user = results.user;
        let arg0 = -1;
        let arg1 = -1;
        const msg = await message.channel.send(returnEmbed(message.author, "Getting discits in party...", "One Moment"));
        try {
            let i = 0;
            arg0 = await getIntButton(message.author.id, msg, "Please select two discits or empty slots to swap their positions in your party!", user._party, num => {
                i++;
                if(num == -1) {
                    return `Slot ${i}: Empty Slot`;
                }
                const caught = user.caught[num];
                return l(`Slot ${i}: Level ${caught.level} ${caught._base}${caught.nickname == caught._base ? "" : ` "${caught.nickname}"`} (${caught.temphp}/${caught.stats[5]} HP)`);
            }, 3);
            const response = (await msg.awaitMessageComponent({ filter: interaction => { 
                return interaction.user.id === message.author.id;
            }, max: 1, time: 20000, errors: ['time'], componentType: Discord.ComponentType.Button }));
            await response.deferUpdate();
            arg1 = parseInt(response.customId);
        } catch {
            msg.edit(returnEmbed(message.author, "Command timed out, use 'switch' again if needed.", "Switch Timed Out", []));
            return;
        }
        let updatedUser = null;
        try {
            updatedUser = await findUser(message.author.id);
        } catch {}
        if(updatedUser === null || (updatedUser.battle !== undefined && updatedUser.battle.timestamp !== undefined)) {
            msg.edit(returnEmbed(message.author, "You entered battle since the command began, so the switch has been cancelled.", []));
            return;
        }
        const saved = user._party[arg0];
        user._party[arg0] = user._party[arg1];
        user._party[arg1] = saved;
        msg.edit(returnEmbed(message.author, `Ok, the two party slots have been swapped!`, 'Successfully Switched!', []));
        return;
    }
);