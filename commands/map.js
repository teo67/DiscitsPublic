const returnMap = require('../functions/returnMap');
const routes = require('../lists+constants/routes');
const trainers = require('../lists+constants/trainers');
const returnEmbed = require('../functions/returnEmbed');
const Trainer = require('../classes/cls_trainer');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');
const triggerTiles = require('../lists+constants/triggerTiles');
const Discord = require('../lists+constants/fundamentals').Discord;
const firstDisc = require('../functions/firstDisc');
const initBattle = require('../functions/initBattle');

const getResponse = async (msg, id) => {
    const response = (await msg.awaitMessageComponent({ filter: interaction => { 
        return interaction.user.id === id;
    }, max: 1, time: 20000, errors: ['time'], componentType: 'BUTTON' }));
    await response.deferUpdate();
    return response;
}

module.exports = new Command(
    'map', 
    'Starter',
    'This command prints out a map of your surroundings. You can then press the arrow buttons to move in those directions. Sometimes you\'ll run into trainers or wild Discits, and then you\'ll enter combat with them.', 
    '',
    'Has registered for an account, can\'t use while in combat',
    {
        user: true, 
        battle: false
    },
    async (message, args, results) => {
        let count = 0; // every 5 moves, save data just in case bot cycles

        const user = results.user;
        if(user.progression == 1) {
            message.channel.send(returnEmbed(message.author, 'You can\'t use this command right now! Try using the \'choose\' command.', 'Error'));
            return;
        }
        const previousReturn = User.move(user, '', triggerTiles);

        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton().setCustomId('⬅️').setEmoji('⬅️').setStyle('PRIMARY'),
            new Discord.MessageButton().setCustomId('⬇️').setEmoji('⬇️').setStyle('PRIMARY'),
            new Discord.MessageButton().setCustomId('⬆️').setEmoji('⬆️').setStyle('PRIMARY'),
            new Discord.MessageButton().setCustomId('➡️').setEmoji('➡️').setStyle('PRIMARY')
        );
        const textRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton().setCustomId('⬅️').setEmoji('🆗').setStyle('PRIMARY')
        );
        const firstRow = new Discord.MessageActionRow();
        for(const eachRow of [row, textRow, firstRow]) {
            eachRow.addComponents(new Discord.MessageButton().setCustomId('☑️').setEmoji('💾').setStyle('SUCCESS'));
        }

        const myMap = await message.channel.send(returnEmbed(message.author, 'Note: Make sure your DMs are open before using this command - you might enter combat with wild Discits and/or trainers.\n\n*Use the green check mark reaction to save your data (it\'ll also save automatically once you\'re done).*\n\n**IMPORTANT: If playing on pc, press (Ctrl +) 3 times to get a better view of the map! (recommended)**', 'Press SAVE to continue:', [firstRow]));

        try {
            await getResponse(myMap, message.author.id);
        } catch(e) {
            console.log(e);
            myMap.edit(returnEmbed(message.author, 'Map command cancelled due to inactivity.', 'Error', []));
            return;
        }
        if(previousReturn == 0) {
            await myMap.edit(returnEmbed(message.author, returnMap(user), 'Use the buttons to move!', [row]));
        } else {
            await myMap.edit(returnEmbed(message.author, previousReturn, 'Press OK to continue:', [textRow]));
        }

        const cycle = async () => {
            try {
                count++;
                if(count == 5) {
                    await user.save(); // backup save of user
                    count = 0;
                }

                const response = await getResponse(myMap, message.author.id);

                if(require('../lists+constants/fundamentals').downtime) {
                    response.editReply(returnEmbed(message.author, 'The bot just entered downtime, and so you can no longer access the map - don\'t worry, your game has been saved.', 'Timeout!', []));
                    return;
                }

                if(response.customId === '☑️') {
                    response.editReply(returnEmbed(message.author, 'Ok, your session has been saved.', 'Session Expired', []));
                    return;
                }

                let returned = User.move(user, response.customId, triggerTiles);

                if(user.progression == 1) {
                    response.editReply(returnEmbed(message.author, 'Use the \'choose\' command to choose a Discit!', 'Session Expired', []));
                    return;
                }

                if(returned == 3) {
                    for(let i = 0; i < trainers.length; i++) {
                        if(!user.trainerBlacklist.includes(trainers[i].name)) {
                            for(let j = 0; i < trainers.length && j < trainers[i].triggers.length; j++) {
                                if(trainers[i].triggers[j][0] == user.location[0] && trainers[i].triggers[j][1] == user.location[1]) {
                                    response.editReply(returnEmbed(message.author, 'Entering combat...', 'Battle Status', []));
                                    initBattle(user, message.author, new Trainer(trainers[i], i), message.channel);
                                    return;
                                }
                            }
                        }
                    }
                    returned = 1;
                } 

                if(returned == 0) {
                    response.editReply(returnEmbed(message.author, returnMap(user), 'Map Updated!', [row]));
                } else if(returned == 2) {
                    response.editReply(returnEmbed(message.author, 'Entering combat...', 'Battle Status', []));
                    initBattle(user, message.author, routes[user.namedLocation[6] - 1].returnFind(), message.channel);
                    return;
                } else {
                    response.editReply(returnEmbed(message.author, returned, 'Press OK button to continue: ', [textRow]));
                }
                await cycle();
                return;
            } catch(e) {
                console.log(e);
                try {
                    myMap.edit(returnEmbed(message.author, 'Your session has timed out due to inactivity (game saved).', 'Error', []));
                } catch(f) {
                    console.log(f);
                }
                return;
            }
        }
        await cycle();
        return;
    }
);