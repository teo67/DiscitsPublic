const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');
const isInt = require('../functions/isInt');
const returnPartyList = require('../functions/returnPartyList');
const { Discord } = require('../lists+constants/fundamentals.js');
const getIntButton = require('../functions/getIntButton.js');
const findUser = require('../functions/findUser.js');

module.exports = new Command(
    'party', 
    'Utility',
    'This command can be used to view and edit your party. If you supply two integer arguments, you can add a Discit to your party. Otherwise, this command will show you the discits in your party and allow edits using buttons.', 
    '[index of added Discit (use \'list\') (optional)] [party slot (between 1 and 6) (also optional)]',
    'Have an account. Requirements for editing your party: Be in a Discit Station, the chosen Discit has attacks equipped, can\'t be used during combat, can\'t equip the same Discit more than once',
    {
        user: true, 
        progression: 3,
    },
    async (message, args, results) => {
        const user = results.user;

        const li = returnPartyList(user);
        if(user.namedLocation != 'Discit Station' || (user.battle !== undefined && user.battle.timestamp !== undefined)) {
            message.channel.send(returnEmbed(message.author, li + '\n\n***You can only edit your party outside of battle in a Discit Station.***', 'Party Status'));
            return;
        }
        if(args.length > 1 && isInt(args[0]) && isInt(args[1])) {
            const arg = [parseInt(args[0]), parseInt(args[1])];
            if(arg[0] > user.caught.length || arg[0] == 0) {
                message.channel.send(returnEmbed(message.author, 'The first argument should be an index to one of your available Discits.', 'Error'));
            } else if(arg[1] > 6 || arg[1] == 0) {
                message.channel.send(returnEmbed(message.author, 'The second argument should be an integer between 1 and 6.', 'Error'));
            } else if(user._party.includes(arg[0] - 1)) {
                message.channel.send(returnEmbed(message.author, 'You already have that discit equipped.', 'Error'));
            } else if(user.caught[arg[0] - 1].moveSet[0] == 'Empty' && user.caught[arg[0] - 1].moveSet[1] == 'Empty' && user.caught[arg[0] - 1].moveSet[2] == 'Empty' && user.caught[arg[0] - 1].moveSet[3] == 'Empty') {
                message.channel.send(returnEmbed(message.author, 'Make sure you equip some attacks onto that Discit before putting it in your party.', 'Error'));
            } else {
                User.partySelect(user, arg[0] - 1, arg[1] - 1);
                if(user.progression == 4) {
                    User.makeProgress(user);
                    User.blacklistTrigger(user, 2);
                }
                message.channel.send(returnEmbed(message.author, `Ok, ${User.party(user, arg[1] - 1).nickname} has been equipped in slot ${arg[1]}. ${(user.progression == 5) ? '\n\nYou\'re all done setting up your Discit! Use \'d!map\' to continue your journey.' : ''}`, 'Successfully Equipped!'));
                return;
            }
            return;
        }
        const button = new Discord.ButtonBuilder().setCustomId('edit').setLabel('Edit your party').setStyle(Discord.ButtonStyle.Primary);
        const row = new Discord.ActionRowBuilder().addComponents(button);
        const embed = returnEmbed(message.author, li, 'Here are the discits in your party:', [row]);
        const msg = await message.channel.send(embed);
        try {
            const response = (await msg.awaitMessageComponent({ filter: interaction => { 
                return interaction.user.id === message.author.id;
            }, max: 1, time: 20000, errors: ['time'], componentType: Discord.ComponentType.Button }));
            await response.deferUpdate();
            let k = -1;
            const res = await getIntButton(message.author.id, msg, "Choose a discit to add to your party!", user.caught, caught => {
                k++;
                return `Level ${caught.level} ${caught._base}${caught.nickname == caught._base ? "" : ` "${caught.nickname}"`}${user._party.includes(k) ? " - in party" : ""}`;
            });
            if(user._party.includes(res)) {
                msg.edit(returnEmbed(message.author, `${user.caught[res].nickname} is already in your party!`, "Error", []));
                return;
            }
            if(user.caught[res].moveSet[0] == 'Empty' && user.caught[res].moveSet[1] == 'Empty' && user.caught[res].moveSet[2] == 'Empty' && user.caught[res].moveSet[3] == 'Empty') {
                msg.edit(returnEmbed(message.author, 'Make sure you equip some attacks onto that Discit before putting it in your party.', 'Error', []));
                return;
            } 
            let i = 0;
            const chosen = await getIntButton(message.author.id, msg, `Great, now choose a slot for ${user.caught[res].nickname}!`, user._party, num => {
                i++;
                if(num == -1) {
                    return `Slot ${i}: Empty`;
                }
                const caught = user.caught[num];
                return `Slot ${i}: Level ${caught.level} ${caught._base}${caught.nickname == caught._base ? "" : ` "${caught.nickname}"`} (${caught.temphp}/${caught.stats[5]} HP)`;
            }, 3);
            let updatedUser = null;
            try {
                updatedUser = await findUser(message.author.id);
            } catch {}
            if(updatedUser == null || updatedUser.namedLocation != 'Discit Station' || (updatedUser.battle !== undefined && updatedUser.battle.timestamp !== undefined)) {
                msg.edit(returnEmbed(message.author, "You left the Discit Station or entered battle after the command began!", "Error", []));
                return;
            }
            User.partySelect(user, res, chosen);
            if(user.progression == 4) {
                User.makeProgress(user);
                User.blacklistTrigger(user, 2);
            }
            msg.edit(returnEmbed(message.author, `Ok, ${user.caught[res].nickname} has been equipped in slot ${chosen + 1}!${(user.progression == 5) ? '\n\nYou\'re all done setting up your Discit! Use \'d!map\' to continue your journey.' : ''}`, 'Successfully Equipped', []));
        } catch {
            button.setDisabled(true);
            button.setLabel('Session timed out!');
            msg.edit(embed);
        }
        return;
    }
);        
      