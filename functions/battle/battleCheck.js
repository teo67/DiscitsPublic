const calcXP = require('./calcXP');
const User = require('../../classes/cls_user');
const discits = require('../../lists+constants/discits');
const Caught = require('../../classes/cls_caught');
const tag = require('../tag');
const getPremium = require('../getPremium');
const trainers = require('../../lists+constants/trainers');

const execute = async (winner, winnerSelected, loser, loserSelected, wager, winnerParticipated) => {   //returns string
    let returning = '';
    if(tag(loser) == 'user') {
        returning += `<@${loser._id}>, all of your discits have fainted! **You will now be transported back to the nearest Discit Station.**`;
        loser.battle = undefined;
        User.respawn(loser);
        User.reviveAll(loser);
        User.recalcAll(loser);
    } else if(tag(loser) == 'trainer') {
        const name = trainers[loser.index].name;
        returning += `You defeated ${name}! They will no longer challenge you on your journey.`;
        User.blacklistTrainer(winner, name);
    } else { //tag(loser) == 'wild'
        returning += `The wild ${loser.nickname} has left the battle! <@${winner._id}>, you may now continue on your journey.`;
    }
    if(tag(winner) == 'user') {
        const premiumLevel = await getPremium(winner._id);
        if(tag(loser) == 'user') {
            User.reviveAll(winner);
            User.recalcAll(winner);
        }
        if(wager > 0) {
            returning += `\n<@${winner._id}> won ${wager} coins from the battle!`;
        }
        User.getCoins(winner, wager);
        if(premiumLevel > 0 && tag(loser) == 'trainer') {
            returning += `\n**Premium Bonus: ${Math.ceil(wager / 2)} extra coins!**`;
            User.getCoins(winner, Math.ceil(wager / 2));
        }
        returning += calcXP(winner, loser, winnerParticipated, premiumLevel > 2);
        winner.battle = undefined;
        Caught.gainEVs(winnerSelected, discits[loserSelected._base].evsGiven);
    }
    return returning;
}

module.exports = execute;