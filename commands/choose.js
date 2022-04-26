const Caught = require('../classes/cls_caught');
const discits = require('../lists+constants/discits');
const returnEmbed = require('../functions/returnEmbed');
const CaughtProto = require('../classes/cls_caughtproto');
const Command = require('../classes/cls_command');
const attacks = require('../lists+constants/attacks');
const User = require('../classes/cls_user');
const Discord = require('../lists+constants/fundamentals').Discord;

module.exports = new Command(
    'choose', 
    'Starter',
    'Choose a starter Discit between Koulit, Leafid, and Ferenhyde.', 
    '',
    'Have an account, hasn\'t chosen a starter yet',
    {
        user: true
    },
    async (message, args, results) => {
        const user = results.user;
        
        if(user.progression != 1) {
            message.channel.send(returnEmbed(message.author, 'Either you already chose a Discit, or you need to talk to the professor first.', 'Error'));
            return;
        }
        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton().setCustomId('Koulit').setEmoji('🟦').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('Leafid').setEmoji('🟩').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('Ferenhyde').setEmoji('🟥').setStyle('SECONDARY')
        );
        const msg = await message.channel.send(returnEmbed(message.author, 'Ok, it\'s time to choose a Discit. Here are the options:\n\n🟦 **Koulit**, the water-type\n\n🟩 **Leafid**, the grass-type\n\n🟥 **Ferenhyde**, the fire-type\n\nTo make your choice, press the button with color corresponding to your starter\'s type.', 'Tough Decision...', [row]));
        try {
            const response = (await msg.awaitMessageComponent({ filter: interaction => { 
                return interaction.user.id === message.author.id;
            }, max: 1, time: 20000, errors: ['time'], componentType: 'BUTTON' }));
            await response.deferUpdate();
    
            User.newCatch(user, new Caught(new CaughtProto(response.customId, 5, [])));
                    //User.newCatch(user, new Caught(new CaughtProto(discits['Wasket'], 1, [attacks['Wobble']])));
            User.makeProgress(user);
            response.editReply(returnEmbed(message.author, `"*${response.customId}*, I choose you!"\n\nGreat, I caught my first Discit! I guess I should report back to Professor Purple using d!map...`, 'First Catch!', []));
        } catch(e) {
            console.log(e);
            msg.edit(returnEmbed(message.author, 'Session timed out. Use d!choose again when you\'re ready.', 'Error', []));
        }
    }
);