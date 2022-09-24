const returnEmbed = require('../functions/returnEmbed');
const isInt = require('../functions/isInt');
const items = require('../lists+constants/items');
const Command = require('../classes/cls_command');
const getIntButton = require('../functions/getIntButton.js');
const findUser = require('../functions/findUser.js');
const generateDisabledButtons = require('../functions/generateDisabledButtons');
const Discord = require('../lists+constants/fundamentals.js').Discord;
const User = require('../classes/cls_user.js');
const l = require('../functions/limitText');

module.exports = new Command(
    'shop', 
    'Currency',
    'View a list of items and their prices in the shop, and buy items as long as you have the funds.', 
    '',
    'Has an account, is not in combat, is in a Discit Station',
    {
        user: true, 
        battle: false, 
        location: 'Discit Station', 
        progression: 6
    },
    async (message, args, results) => {
        const user = results.user;
        let shop = [];
        for(const key of Object.keys(items)) {
            if(items[key].price > 0) {
                shop.push(key);
            }
        }
        const msg = await message.channel.send(returnEmbed(message.author, "Getting items in shop...", "One Moment"));
        let comps = [];
        try {
            while(true) {
                let index = -1;
                try {
                    index = await getIntButton(message.author.id, msg, `Click on an item to learn more! You have ${user.coins} coins.`, shop, key => {
                        return `${key} - ${items[key].price} coins`;
                    });
                } finally {
                    comps = generateDisabledButtons(msg.components);
                }
                const inInv = user.inventory.indexOf(shop[index]);
                await msg.edit(returnEmbed(message.author, `${shop[index]} - ${items[shop[index]].price} coins\n**${inInv == -1 ? "0" : `${user.amounts[inInv]}`} in inventory**\n*${items[shop[index]].description}*`, "Item Description", 
                [
                    new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder().setCustomId("back").setLabel("Back to shop").setStyle(Discord.ButtonStyle.Primary), 
                    new Discord.ButtonBuilder().setCustomId("buy").setLabel(`Buy ${shop[index]}...`).setStyle(Discord.ButtonStyle.Success))
                ]));
                const response = (await msg.awaitMessageComponent({ filter: interaction => { 
                    return interaction.user.id === message.author.id;
                }, max: 1, time: 20000, errors: ['time'], componentType: Discord.ComponentType.Button }));
                const run = async response => {
                    if(response.customId == "back") {
                        await response.deferUpdate();
                        return;
                    }
                    const modal = new Discord.ModalBuilder().setCustomId("vendor").setTitle(`Buy ${shop[index]}: ${items[shop[index]].price} coins ea.`).addComponents(
                        
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.TextInputBuilder().setCustomId("num").setLabel(l(`How many? You have ${user.coins} coins.`, 45)).setValue("1").setStyle(Discord.TextInputStyle.Short).setRequired(true)
                        )
                    );
                    await response.showModal(modal);
                    const modalResponse = await Promise.any([
                        response.awaitModalSubmit({ filter: interaction => {
                            return interaction.customId == "vendor";
                        }, max: 1, time: 20000, errors: ['time'] }),
                        msg.awaitMessageComponent({ filter: interaction => { 
                            return interaction.user.id === message.author.id;
                        }, max: 1, time: 20000, errors: ['time'], componentType: Discord.ComponentType.Button })
                    ]);
                    if(modalResponse.customId == "vendor") {
                        let fieldVal = modalResponse.fields.getTextInputValue("num");
                        let embed;
                        if(!isInt(fieldVal)) {
                            embed = returnEmbed(message.author, "Your response should be a positive integer! You have been redirected back to the shop.", "Error");
                        } else {
                            fieldVal = parseInt(fieldVal);
                            if(fieldVal < 1 || fieldVal * items[shop[index]].price > user.coins) {
                                embed = returnEmbed(message.author, `You cannot afford ${fieldVal}x ${shop[index]}! You have been redirected back to the shop.`, "Error");
                            } else {
                                User.gainItem(user, shop[index], fieldVal);
                                User.loseCoins(user, items[shop[index]].price * fieldVal);
                                embed = returnEmbed(message.author, `You bought ${fieldVal}x ${shop[index]}! You now have ${user.amounts[user.inventory.indexOf(shop[index])]} in your inventory!`, "Purchase Successful!");
                            }
                        }
                        embed.ephemeral = true;
                        await modalResponse.reply(embed);
                    } else {
                        await run(modalResponse);
                    }
                }
                await run(response);
            }
        } catch(e) {
            console.log(e);
            msg.edit({ embeds: [], content: "Here are the items in the shop (the buttons have expired, use the command again if necessary).", components: comps });
            return;
        }

    }
);
