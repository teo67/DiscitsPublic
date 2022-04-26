const isInt = require('../isInt');
const returnEmbed = require('../returnEmbed');

const execute = (msg, userDiscord, user, other) => {
    if(!isInt(msg.content)) {
        userDiscord.send(returnEmbed(userDiscord, 'Your response should be a positive integer!', 'Error'));
        return false;
    }
    const content = parseInt(msg.content);
    const current = user.caught[user.equipped];
    if(content < 1 || content > 4) {
        userDiscord.send(returnEmbed(userDiscord, 'Your argument should be in between 1 and 4.', 'Error'));
        return false;
    } 
    if(current.moveSet[content - 1] == 'Empty' || current.PPSet[content - 1] < 1) {
        userDiscord.send(returnEmbed(userDiscord, `${current.nickname} doesn\'t have a move with any PP left equipped in slot ${content}.`, 'Error'));
        return false;
    }
    return true;
}

module.exports = execute;