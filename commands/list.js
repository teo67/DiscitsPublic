const returnEmbed = require('../functions/returnEmbed');
const isInt = require('../functions/isInt');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user.js');
const findUser = require('../functions/findUser.js');
const getIntButton = require('../functions/getIntButton.js');
const Discord = require('../lists+constants/fundamentals.js').Discord;
const generateDisabledButtons = require('../functions/generateDisabledButtons.js');
module.exports = new Command(
    'list', 
    'Utility',
    'This command prints a list of every Discit you own and the index of that Discit. It also allows you to select Discits in order to view their stats and attacks for later.', 
    '',
    'Has registered for an account. If selecting a Discit, cannot be in battle',
    {
        user: true
    },
    async (message, args, results) => {
        const user = results.user;
        if(user.caught.length < 1) {
            message.channel.send(returnEmbed(message.author, 'You don\'t have any Discits yet! Maybe you still need to pick your starter Discit from the professor.', 'Your Discits'));
            return;
        }
        let res = -1;
        const msg = await message.channel.send(returnEmbed(message.author, "Getting discit list...", "One Moment"));
        try {
            let k = -1;
            res = await getIntButton(message.author.id, msg, "Click on a discit to select it for later use!", user.caught, caught => {
                k++;
                return `Level ${caught.level} ${caught._base}${caught.nickname == caught._base ? "" : ` "${caught.nickname}"`}${user._party.includes(k) ? " - in party" : ""}`;
            });
        } catch(e) {
           // console.log(e);
           const newRows = generateDisabledButtons(msg.components);
            msg.edit({ content: "Here is a list of your Discits (the buttons have timed out, use the command again if needed).", components: newRows});
            return;
        } 
        let updatedUser = null;
        try {
            updatedUser = await findUser(message.author.id);
        } catch {}
        if(updatedUser == null || (updatedUser.battle !== undefined && updatedUser.battle.timestamp !== undefined)) {
            msg.edit(returnEmbed(message.author, "You cannot select a Discit while in battle!", "Error", []));
            return;
        }
        User.equip(user, res);
        msg.edit(returnEmbed(message.author, `Ok, you selected ${user.caught[res].nickname}! ${(user.progression == 3) ? '\n\nNext, use \'d!allmoves\' to equip this Discit\'s first attack into slot 1.' : ''}`, 'Successfully Selected!', []));
        return;
    }
);