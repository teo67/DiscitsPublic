const returnEmbed = require('../returnEmbed');

const execute = (msg, userDiscord, user) => { // ik these send()s arent caught, but tbh it doesnt matter. screw you if you block the bot while this function is running and you dont deserve a reason why
    if(msg.author.id !== userDiscord.id) {
        return false;
    }
    if(['attack', 'swap', 'use'].includes(msg.content.toLowerCase())) {
        return true;
    }
    userDiscord.send(returnEmbed(userDiscord, 'Remember, type \'attack\', \'swap\', or \'use\'!', 'Error'));
    return false;
}

module.exports = execute;