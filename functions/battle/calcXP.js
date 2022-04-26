const User = require('../../classes/cls_user');
const discits = require('../../lists+constants/discits');
const Caught = require('../../classes/cls_caught');
const tag = require('../tag');

const execute = (winner, loser, winnerParticipated, winnerPremium) => {
    let total = [0, 0, 0, 0, 0, 0];
    let winnerParty = [winner];
    if(tag(winner) == 'trainer') {
        winnerParty = winner.caught;
    } else if(tag(winner) == 'user') {
        winnerParty = [User.party(winner, 0), User.party(winner, 1), User.party(winner, 2), User.party(winner, 3), User.party(winner, 4), User.party(winner, 5)];
    }
    let loserParty = [loser];
    if(tag(loser) == 'trainer') {
        loserParty = loser.caught;
    } else if(tag(loser) == 'user') {
        loserParty = [User.party(loser, 0), User.party(loser, 1), User.party(loser, 2), User.party(loser, 3), User.party(loser, 4), User.party(loser, 5)];
    }
    for(let i = 0; i < loserParty.length; i++) {
        if(loserParty[i]) {
            const B = discits[loserParty[i]._base].xpYield;
            const L = loserParty[i].level;
            for(let j = 0; j < winnerParty.length; j++) {
                if(winnerParty[j] && winnerParty[j].temphp > 0) {
                    const LW = winnerParty[j].level;
                    let S = (winnerParticipated.includes(j) ? 1 : 2);
                    total[j] += ((B * L) / (5 * S)) * ((((2 * L) + 10) ** 2.5) / ((L + LW + 10) ** 2.5)) + 1;
                }
            }
        }
    }
    
    let returning = '';
    for(let i = 0; i < winnerParty.length; i++) {
        if(total[i] > 0) {
            if(winnerPremium) {
                returning += `\n\n**Incoming Premium XP Bonus: ${Math.floor(total[i])} --> ${Math.floor(total[i] * 1.5)}**`;
            }
            returning += Caught.gainXP(winnerParty[i], winnerPremium ? Math.floor(total[i] * 1.5) : Math.floor(total[i]));
        }
    }
    return returning;
}

module.exports = execute;