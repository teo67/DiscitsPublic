const Discord = require('../lists+constants/fundamentals').Discord;
const l = require('../functions/limitText.js');
const getIntButton = async (id, msg, text, li, handle, rowSize = 5, j = 0) => {
    const rows = [];
    let content = text;
    if(li.length == 0) {
        content += " The list is empty!";
    } else {
        content += `\n*Viewing ${j * 4 * rowSize + 1} - ${Math.min(li.length, (j + 1) * 4 * rowSize)} of ${li.length}. Use the arrows at the bottom to switch tabs.*`;
        for(let i = j * 4 * rowSize; i < Math.min(li.length, (j + 1) * 4 * rowSize); i++) {
            if(rows.length == 0 || rows[rows.length - 1].components.length >= rowSize) {
                rows.push(new Discord.ActionRowBuilder());
            }
            rows[rows.length - 1].addComponents(new Discord.ButtonBuilder().setCustomId(`${i}`).setLabel(l(handle(li[i]))).setStyle(i % 2 == 0 ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Success));
        }
    }
    const lastRow = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder().setCustomId("back").setEmoji('◀️').setStyle(Discord.ButtonStyle.Secondary).setDisabled(j == 0),
        new Discord.ButtonBuilder().setCustomId("forward").setEmoji('▶️').setStyle(Discord.ButtonStyle.Secondary).setDisabled(li.length <= (j + 1) * 4 * rowSize),
        new Discord.ButtonBuilder().setCustomId("cancel").setLabel("Cancel").setStyle(Discord.ButtonStyle.Danger)
    );
    rows.push(lastRow);
    msg.edit({embeds: [], components: rows, content: content});
    const response = (await msg.awaitMessageComponent({ filter: interaction => { 
        return interaction.user.id === id;
    }, max: 1, time: 20000, errors: ['time'], componentType: Discord.ComponentType.Button }));
    await response.deferUpdate();
    if(response.customId == "back") {
        return await getIntButton(id, msg, text, li, handle, rowSize, j - 1);
    } else if(response.customId == "forward") {
        return await getIntButton(id, msg, text, li, handle, rowSize, j + 1);
    } else if(response.customId == "cancel") {
        throw new Error();
    }
    return parseInt(response.customId);
}
module.exports = getIntButton;