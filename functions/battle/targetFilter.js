const isInt = require('../isInt');
const returnEmbed = require('../returnEmbed');
const items = require('../../lists+constants/items');

const execute = (msg, userDiscord, user, other, index) => {
    if(!isInt(msg.content)) {
        userDiscord.send(returnEmbed(userDiscord, 'Your response should be a positive integer!', 'Error'));
        return false;
    }
    const content = parseInt(msg.content);
    if(content < 1 || content > 6) {
        userDiscord.send(returnEmbed(userDiscord, 'Your response should be an integer between 1 and 6.', 'Error'));
        return false;
    }
    if(user._party[content - 1] == -1) {
        userDiscord.send(returnEmbed(userDiscord, `You don\'t have a Discit equipped in slot ${content}!`, 'Error'));
        return false;
    }
    if(!items[user.inventory[index - 1]].condition(user, other, content - 1, true)) {
        userDiscord.send(returnEmbed(userDiscord, 'That Discit is not a valid target right now!', 'Error'));
        return false;
    }
    return true;
}

module.exports = execute;