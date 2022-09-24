const fundamentals = require('../lists+constants/fundamentals');
const client = fundamentals.client;
const Discord = fundamentals.Discord;

const execute = (author, text, title, components = null) => {
    const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${author.username}`, iconURL: author.avatarURL() })
        .setColor('#ff6060')
        .setDescription(text)
        .addFields(
            /*{ name: '\u200B', value: '\u200B' }, */
            { name: 'Invite Us!', value: `[Connect to Discord](https://discord.com/oauth2/authorize?client_id=907104274817896498&scope=bot&permissions=277025704960 'Invites the bot to your server!')`, inline: true},
            { name: 'Ping', value: `${client.ws.ping} ms`, inline: true}
        )
        .setTimestamp()
        .setFooter({ text: 'Discits', iconURL: client.user.displayAvatarURL() })
        .setTitle(title);
    let returning = { content: "", embeds: [embed.data] };
    if(components) {
        returning.components = components;
    }
    return returning;
}

module.exports = execute;