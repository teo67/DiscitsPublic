const attacks = require('../lists+constants/attacks');

const execute = (user, equipped) => {
    let returning = ``;
    for(let i = 0; i < 4; i++) {
        const atkName = user.caught[equipped].moveSet[i];
        const atk = attacks[atkName];
        returning += `${i + 1}: ${atkName}\n`;
        returning += `Type: ${atk.element}, PP left: ${user.caught[equipped].PPSet[i]}\n`;
        returning += `*This attack does ${atk.dmg} damage with ${atk.accuracy}% accuracy.*\n`;
        const stats = ['attack', 'defense', 'special attack', 'special defense', 'speed', 'evasiveness', 'accuracy'];
        for(let j = 0; j < atk.statChanges.length; j++) {
            let middleInsert = 'opponent\'s';
            if(atk.statChanges[j][0] == 'me') {
                middleInsert = 'user\'s';
            }
            returning += `${atkName} can alter the ${middleInsert} ${stats[atk.statChanges[j][1]]} by ${atk.statChanges[j][2]} stage(s).\n`;
        }
        for(let j = 0; j < atk.effects.length; j++) {
            let middleInsert = 'the opposing Discit';
            if(atk.effects[j][0] == 'me') {
                middleInsert = 'itself';
            }
            returning += `${atkName} can give ${middleInsert} the *${atk.effects[j][1]}* effect (it has a ${atk.effects[j][2]}% chance of happening).\n`;
        }
        returning += '\n';
    }
    return returning;
}

module.exports = execute;