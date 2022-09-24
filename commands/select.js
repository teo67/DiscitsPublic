const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');
const getIntButton = require('../functions/getIntButton.js');
const findUser = require('../functions/findUser.js');
module.exports = new Command(
    'select', 
    'Utility',
    'This command selects a Discit in your party so that you can change its nickname, equip attacks, etc.', 
    '',
    'Have an account, can\'t be used while in combat (your selected Discit in combat counts as the one that is currently fighting)',
    {
        user: true, 
        battle: false,
    },
    async (message, args, results) => {
        const user = results.user;
        const msg = await message.channel.send(returnEmbed(message.author, "Getting discits in party...", "One moment"));
        try {
            const res = await getIntButton(message.author.id, msg, "Click on a discit in your party to select it!", user._party, num => {
                if(num == -1) {
                    return "Empty slot";
                }
                const caught = user.caught[num];
                return `Level ${caught.level} ${caught._base}${caught.nickname == caught._base ? "" : ` "${caught.nickname}"`} (${caught.temphp}/${caught.stats[5]} HP)`;
            }, 3);
            if(user._party[res] == -1) {
                msg.edit(returnEmbed(message.author, "You cannot select an empty slot!", "Error", []));
                return;
            }
            let updatedUser = null;
            try {
                updatedUser = await findUser(message.author.id);
            } catch {}
            if(updatedUser === null || (updatedUser.battle !== undefined && updatedUser.battle.timestamp !== undefined)) {
                msg.edit(returnEmbed(message.author, "You entered battle after the command began, so selection is invalid!", "Error", []));
                return;
            }
            User.equip(user, user._party[res]);
            msg.edit(returnEmbed(message.author, `Ok, you selected ${user.caught[user.equipped].nickname}!`, 'Successfully Selected!', []));
        } catch {
            msg.edit(returnEmbed(message.author, "Session timed out.", "Party Selection Cancelled", []));
        }
    }
);