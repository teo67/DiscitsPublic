const returnEmbed = require('../functions/returnEmbed');
const isInt = require('../functions/isInt');
const Command = require('../classes/cls_command');
const items = require('../lists+constants/items');
const getIntButton = require('../functions/getIntButton.js');
const Discord = require('../lists+constants/fundamentals.js').Discord;
const findUser = require('../functions/findUser.js');
const User = require('../classes/cls_user.js');
const generateDisabledButtons = require('../functions/generateDisabledButtons.js');

module.exports = new Command(
    'inventory', 
    'Utility',
    'This command will print out a list of items in your inventory, allowing you to use items as you wish.', 
    '',
    'Has registered for an account, cannot be in battle if buying items',
    {
        user: true
    },
    async (message, args, results) => {
        const user = results.user;
        const msg = await message.channel.send(returnEmbed(message.author, "Getting inventory...", "One Moment"));
        let index = -1;
        let itemName = "";
        let target = -1;
        let comps = [];
        try {
            let j = -1;
            try {
                index = await getIntButton(message.author.id, msg, "Click on an item to learn more about it!", user.inventory, item => {
                    j++;
                    return `${item} x${user.amounts[j]}`;
                });
            } finally {
                comps = generateDisabledButtons(msg.components);
            }
            itemName = user.inventory[index];
            const row = new Discord.ActionRowBuilder();
            row.addComponents(
                new Discord.ButtonBuilder().setCustomId("use").setLabel((user.battle === undefined || user.battle.timestamp === undefined) ? "Use this item" : "Items cannot be used out of turn in battle!").setDisabled(user.battle !== undefined && user.battle.timestamp !== undefined).setStyle(Discord.ButtonStyle.Primary)
            );
            await msg.edit(returnEmbed(message.author, `${itemName} - ${items[itemName].price} coins\n**${user.amounts[index]} in inventory**\n*${items[itemName].description}*`, "Item Information", [
                row
            ]));
            (await msg.awaitMessageComponent({ filter: interaction => { 
                return interaction.user.id === message.author.id;
            }, max: 1, time: 20000, errors: ['time'], componentType: Discord.ComponentType.Button })).deferUpdate();
            if(items[itemName].requiresTarget) {
                target = await getIntButton(message.author.id, msg, "This item requires a target. Which discit would you like to use it on?", user._party, num => {
                    if(num == -1) {
                        return "Empty Slot";
                    }
                    const caught = user.caught[num];
                    return `Level ${caught.level} ${caught._base}${caught.nickname == caught._base ? "" : ` "${caught.nickname}"`} (${caught.temphp}/${caught.stats[5]} HP)`;
                }, 3);
            }
        } catch(e) {
            msg.edit({content: `Here are the items in your inventory: (the buttons have timed out, use the inventory command again if needed).`, components: comps, embeds: []});
            return;
        }
        let updatedUser = null;
        try {
            updatedUser = await findUser(message.author.id);
        } catch {}
        if(updatedUser == null || (updatedUser.battle !== undefined && updatedUser.battle.timestamp !== undefined)) {
            msg.edit(returnEmbed(message.author, 'You entered battle since the command began, so the item cannot be used!', "Error", []));
            return;
        }
        if(!items[itemName].condition(user, false, target, false)) {
            msg.edit(returnEmbed(message.author, `${itemName} cannot be used on the target Discit right now! Try again later!`, 'Error', []));
            return;
        }
        User.loseItem(user, itemName);
        msg.edit(returnEmbed(message.author, items[itemName].func(user, false, target)[0], `You used a ${itemName}!`, []));
});