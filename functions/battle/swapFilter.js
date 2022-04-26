const isInt = require('../isInt');
const returnEmbed = require('../returnEmbed');
const User = require('../../classes/cls_user');

const execute = (msg, userDiscord, user, other) => {
    if(!isInt(msg.content)) {
        userDiscord.send(returnEmbed(userDiscord, 'Your response should be a positive integer.', 'Error'));
        return false;
    }
    const content = parseInt(msg.content);
    const current = user.caught[user.equipped];

    if(content < 1 || content > 6) {
        userDiscord.send(returnEmbed(userDiscord, 'Your response should be between 1 and 6.', 'Error'));
        return false;
    }
    if(user._party[content - 1] == -1 || User.party(user, content - 1).temphp < 1) {
        userDiscord.send(returnEmbed(userDiscord, 'You tried to access a discit that is either dead or doesn\'t exist.', 'Error'));
        return false;
    }
    return true;
}

module.exports = execute;