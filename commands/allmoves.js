const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const attacks = require('../lists+constants/attacks');
const Caught = require('../classes/cls_caught');
const returnMoveList = require('../functions/returnMoveList.js');
const Discord = require('../lists+constants/fundamentals.js').Discord;
const User = require('../classes/cls_user.js');
const getIntButton = require('../functions/getIntButton.js');
const findUser = require('../functions/findUser.js');
const generateDisabledButtons = require('../functions/generateDisabledButtons.js');

module.exports = new Command(
    'allmoves', 
    'Utility',
    'This command prints a list of all learned moves on the Discit currently selected and allows the user to equip moves to their battle set.', 
    '',
    'Have an account, have a Discit selected (check out the \'list\' command). If equipping a move, must be out of battle and in a Discit Station, and the move cannot be equipped already',
    {
        user: true, 
        equipped: true, 
    },
    async (message, args, results) => {
        const user = results.user;
        const equipped = results.equipped;
        const msg = await message.channel.send(returnEmbed(message.author, "Getting attack list...", "One Moment"));
        let move = -1;
        let slot = -1;
        try {
            move = await getIntButton(message.author.id, msg, "Click on a move to learn more about it!", user.caught[equipped].fullMoves, move => {
                return `${move} (type: ${attacks[move].element})${user.caught[equipped].moveSet.includes(move) ? " - equipped" : ""}`;
            });
            const moveName = user.caught[equipped].fullMoves[move];
            let already = user.caught[equipped].moveSet.includes(moveName);
            const row = new Discord.ActionRowBuilder();
            if(user.namedLocation == 'Discit Station' && (user.battle === undefined || user.battle.timestamp === undefined)) {
                row.addComponents(new Discord.ButtonBuilder().setCustomId("a").setLabel(already ? "This attack is already equipped" : "Equip this attack").setDisabled(already).setStyle(Discord.ButtonStyle.Primary));
            } else {
                already = true;
                row.addComponents(new Discord.ButtonBuilder().setCustomId("b").setLabel("Attacks can only be equipped outside of battle and in a Discit Station.").setDisabled(true).setStyle(Discord.ButtonStyle.Danger));
            }
            await msg.edit(returnEmbed(message.author, returnMoveList(user.caught[equipped].fullMoves, move, user.caught[equipped].moveSet, user.caught[equipped].PPSet), "Attack Information", [
                row
            ]));
            if(already) {
                return;
            }
            (await msg.awaitMessageComponent({ filter: interaction => { 
                return interaction.user.id === message.author.id;
            }, max: 1, time: 20000, errors: ['time'], componentType: Discord.ComponentType.Button })).deferUpdate();
            let i = -1;
            slot = await getIntButton(message.author.id, msg, `Great, now choose a slot for ${user.caught[equipped].fullMoves[move]}!`, user.caught[equipped].moveSet, move => {
                i++;
                return `${move} (type: ${attacks[move].element}) - ${user.caught[equipped].PPSet[i]}/${attacks[move].PP} PP`;
            }, 2);
        } catch(e) {
            //console.log(e);
            const newRows = generateDisabledButtons(msg.components);
            msg.edit({content: `Here are ${user.caught[equipped].nickname}'s attacks: (the buttons have timed out, use the allmoves command again if needed).`, components: newRows});
            return;
        }
        let updatedUser = null;
        try {
            updatedUser = await findUser(message.author.id);
        } catch {}
        if(updatedUser == null || updatedUser.namedLocation != 'Discit Station' || (updatedUser.battle !== undefined && updatedUser.battle.timestamp !== undefined)) {
            msg.edit(returnEmbed(message.author, 'You left the Discit Station or entered battle since the command began!', "Error", []));
            return;
        }
        Caught.setMove(user.caught[equipped], move, slot);
        if(user.progression == 3) {
            User.makeProgress(user);
        }
        msg.edit(returnEmbed(message.author, `Ok, ${user.caught[equipped].moveSet[slot]} has been equipped in slot ${slot + 1}. ${(user.progression == 4) ? '\n\nGreat job equipping an attack! In order to begin using your Discit, do \'d!party 1 1\' to place your first Discit into slot 1 of your party.' : ''}`, 'Successfully Equipped!', []));
    }
);           
            
            
            