const Discord = require('../lists+constants/fundamentals.js').Discord;
module.exports = (rows) => {
    const newRows = [];
    for(const row of rows) {
        const newRow = new Discord.ActionRowBuilder();
        for(const comp of row.components) {
            newRow.addComponents(Discord.ButtonBuilder.from(comp).setDisabled(true));
        }
        newRows.push(newRow);
    }
    return newRows;
}