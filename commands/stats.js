const getRequired = require('../functions/getRequired');
const returnEmbed = require('../functions/returnEmbed');
const isInt = require('../functions/isInt');
const Command = require('../classes/cls_command');
const attacks = require('../lists+constants/attacks');
const discits = require('../lists+constants/discits');

module.exports = new Command(
    'stats', 
    'Utility',
    'This command will print out the stats of the Discit you currently have equipped. These include individual and effort values, as well as things like HP and effects.',
    '',
    'Have an account, have a Discit selected', 
    {
        user: true, 
        equipped: true
    },
    (message, args, results) => {
        const user = results.user;
        const equipped = results.equipped;

        let returning = '';
        let selected = user.caught[equipped];
        if(args.length > 0 && isInt(args[0]) && parseInt(args[0]) <= user.caught.length) {
            selected = user.caught[parseInt(args[0]) - 1];
        }
        returning += `\nLevel ${selected.level} ${selected._base} - `;
        if(selected.nickname == selected._base) {
            returning += `*No nickname*\n`;
        } else {
            returning += `*"${selected.nickname}"*\n`;
        }
        returning += `Experience to next level: ${selected.currentXP} / ${getRequired(selected.level + 1, discits[selected._base].levelSpeed)}.\n`;
        returning += `Type: ${discits[selected._base].element}\n\n`
        const statNames = ['Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed', 'Health'];
        for(let i = 0; i < selected.stats.length; i++) {
            returning += `\n${statNames[i]}: ${selected.stats[i]} *(EV: ${selected.EVs[i]}, IV: ${selected.IVs[i]}, Base stat value: ${discits[selected._base].stats[i]})*`;
        }  
        returning += `\n\nMoves equipped (use 'moves' to look for more detailed stats): \n`;
        for(let i = 0; i < selected.moveSet.length; i++) {
            if(selected.moveSet[i] == 'Empty') {
                returning += `\n${i + 1}: *No attack equipped*`;
            } else {
                returning += `\n${i + 1}: ${selected.moveSet[i]} (PP: ${selected.PPSet[i]} / ${attacks[selected.moveSet[i]].PP})`;
            }
        } 
        returning += `\n\nTemporary Stats: \n`;
        returning += `Health: ${selected.temphp} / ${selected.stats[5]}\n`;
        if(selected.effects.length < 1) {
            returning += `*No effects.*\n`;
        } else {
            returning += `Effects: `;
            for(let i = 0; i < selected.effects.length; i++) {
                returning += `${selected.effects[i]}`;
                if(i == selected.effects.length - 1) {
                    returning += `. \n`;
                } else {
                    returning += `, `;
                }
            }
        }
        returning += `Stat modifiers: [ATK - ${selected.tempstats[0]}, DFNS - ${selected.tempstats[1]}, Spec. ATK - ${selected.tempstats[2]}, Spec. DFNS - ${selected.tempstats[3]}, Speed - ${selected.tempstats[4]}, Evasiveness - ${selected.tempstats[5]}, Accuracy - ${selected.tempstats[6]}]`;
        returning += `\n\n*${discits[selected._base].description}*`;
        message.channel.send(returnEmbed(message.author, returning, 'These are your stats:'));
        return;
    }
); 

