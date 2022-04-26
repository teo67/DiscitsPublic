const isInt = require('../isInt');
const returnEmbed = require('../returnEmbed');
const items = require('../../lists+constants/items');

const execute = (msg, userDiscord, user, other) => {
    if(!isInt(msg.content)) {
        userDiscord.send(returnEmbed(userDiscord, 'Your response should be a positive integer!', 'Error'));
        return false;
    }
    const content = parseInt(msg.content);

    if(content < 1 || content > user.inventory.length) {
        userDiscord.send(returnEmbed(userDiscord, 'Your argument should reference an item in your inventory.', 'Error'));
        return false;
    }
    const selectedItem = items[user.inventory[content - 1]];
    if(!selectedItem.requiresTarget && !selectedItem.condition(user, other, null, true)) {
        userDiscord.send(returnEmbed(userDiscord, 'You can\'t use that item right now!', 'Error'));
        return false;
    }
    return true;
}

module.exports = execute;