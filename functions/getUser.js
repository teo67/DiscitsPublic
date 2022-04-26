const findUser = require('./findUser');
const returnEmbed = require('./returnEmbed');
const execute = async (id, message) => {
    try {
        const player = await findUser(id);
        if(!player) {
            message.channel.send(returnEmbed(message.author, 'We weren\'t able to find the Discord account for your opponent, so the battle has been cancelled.', 'Error'));
            return null;
        } 
        return player;
    } catch(e) {
        console.log(e);
        message.channel.send(returnEmbed(message.author, 'Sorry, we couldn\'t get to the server! Battle cancelled.', 'Error'));
        return null;
    }
}
module.exports = execute;