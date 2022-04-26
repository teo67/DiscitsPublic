const fundamentals = require('../../lists+constants/fundamentals');
const STATCHANGES = fundamentals.STATCHANGES;
const ACCEVACHANGES = fundamentals.ACCEVACHANGES;
const effects = require('../../lists+constants/effects');
const attacks = require('../../lists+constants/attacks');
const discits = require('../../lists+constants/discits');
const Caught = require('../../classes/cls_caught');
const tag = require('../tag');

const weaknessStrength = (a, b) => { // if a attacking b, give multiplier based on typing
    for(const eleList of [['Water', 'fire', 'grass'], ['poison', 'flying', 'electric', 'dark']]) {
        const eleIndex = eleList.indexOf(a);
        if(eleIndex != -1) {
            if(eleList[(eleIndex == 0 ? eleList.length - 1 : eleIndex - 1)] == b) {
                return 0.5;
            }
            if(eleList[(eleIndex == eleList.length - 1 ? 0 : eleIndex + 1)] == b) {
                return 2;
            }
            return 1;
        }
    }
    return 1;
}

const execute = (player, playerSelected, otherSelected, arg0) => {

    const isOver = () => {
        return (playerSelected.temphp < 1 || otherSelected.temphp < 1);
    }
    
    let returning = '';
    let chanceOfFail = 0;

    for(const effect of playerSelected.effects) {
        const result = effects[effect].turnStart(playerSelected, Caught);
        if(result[0] > chanceOfFail) {
            chanceOfFail = result[0];
        }
        returning += result[1];
    }

    if(isOver()) {
        return returning;
    }
    if(Math.floor(Math.random() * 100) + 1 <= chanceOfFail) {
        returning += `**Move cancelled due to effects.**`; 
        return returning;
    }
    let extraText = ``;
    if(tag(player) == 'user') {
        Caught.useMove(playerSelected, arg0 - 1);
        extraText = ` *They now have ${playerSelected.PPSet[arg0 - 1]} uses left before having to return to a Discit Station.*`;
    }
    returning += `${playerSelected.nickname} used ${playerSelected.moveSet[arg0 - 1]}!${extraText}`;

    const attackObj = attacks[playerSelected.moveSet[arg0 - 1]];

    let accuracyCalculation = (ACCEVACHANGES[playerSelected.tempstats[6] + 6]) / (ACCEVACHANGES[otherSelected.tempstats[5] + 6]);
    if(accuracyCalculation < 0.33) {
        accuracyCalculation = 0.33;
    }
    if(attackObj.accuracy > 100) {
        accuracyCalculation = 1;
    }
    if(Math.floor(Math.random() * 100) + 1 > attackObj.accuracy * accuracyCalculation) {
        returning += `\n\nThe opposing ${otherSelected.nickname} dodged the attack!`;
        return returning;
    }
    if(attackObj.dmg > 0) {
        returning += `\n`;

        let STAB = (discits[playerSelected._base].element == attackObj.element && discits[playerSelected._base].element != 'normal') ? 1.5 : 1;
        const TYPE = weaknessStrength(attackObj.element, discits[otherSelected._base].element); // calculates not effective/super effective
        if(TYPE == 2) {
            returning += `\nIt's super effective!`;
        } else if(TYPE == 0.5) {
            returning += `\nIt's not very effective...`;
        }
        let CRITICAL = (Math.floor(Math.random() * 10) + 1 == 10 ? 1.5 : 1);
        if(CRITICAL == 1.5) {
            returning += `\nA critical hit!`;
        }
        const RANDOM = (Math.random() * 0.15) + 0.85; // random factor (exists in pokemon games)
        const POWER = attackObj.dmg; // damage factor
        const LEVEL = playerSelected.level; // level
        let ATK = (attackObj.special ? playerSelected.stats[2] * STATCHANGES[playerSelected.tempstats[2] + 6] : playerSelected.stats[0] * STATCHANGES[playerSelected.tempstats[0] + 6]); // special attack or normal attack
        let DFNS = (attackObj.special ? playerSelected.stats[3] * STATCHANGES[playerSelected.tempstats[3] + 6] : playerSelected.stats[1] * STATCHANGES[playerSelected.tempstats[1] + 6]); // special defense or normal defense
        let BURN = (playerSelected.effects.includes('burned') ? 0.5 : 1);

        //console.log(`stab: ${STAB}, type: ${TYPE}, crit: ${CRITICAL}, random: ${RANDOM}, power: ${POWER}, level: ${LEVEL}, atk: ${ATK}, dfns: ${DFNS}, burn: ${BURN}`);

        const damageIntake = Math.round(((((((2 * LEVEL) / 5) + 2) * POWER * (ATK / DFNS)) / 50) + 2) * (CRITICAL * RANDOM * STAB * TYPE * BURN));

        Caught.takeDamage(otherSelected, damageIntake);
        returning += `\nThe opposing ${otherSelected.nickname} took ${damageIntake} damage! They now have ${otherSelected.temphp} health.`;

        if(isOver()) {
            return returning;
        }
    }
    if(attackObj.statChanges.length > 0) {
        returning += `\n`;
        for(let i = 0; i < attackObj.statChanges.length; i++) {
            const theChange = attackObj.statChanges[i];
            const theStats = ['attack', 'defense', 'spec. attack', 'spec. defense', 'speed', 'evasiveness', 'accuracy'];
            let howItChanged = (theChange[2] > 0 ? 'increased' : 'decreased');
            if(theChange[0] == 'me') {
                Caught.statChange(playerSelected, theChange[1], theChange[2]);
                returning += `\n${playerSelected.nickname}'s ${theStats[theChange[1]]} ${howItChanged}...`;
            } else {
                Caught.statChange(otherSelected, theChange[1], theChange[2]);
                returning += `\nThe opposing ${otherSelected.nickname}'s ${theStats[theChange[1]]} ${howItChanged}...`;
            }
        }
    }   
    if(attackObj.effects.length > 0) {
        for(let i = 0; i < attackObj.effects.length; i++) {
            const theEffect = attackObj.effects[i];
            if(Math.floor(Math.random() * 100) + 1 > theEffect[2]) {
                continue;
            }
            let target = (theEffect[0] == 'me' ? playerSelected : otherSelected);
            if(target.effects.includes(theEffect[1])) {
                continue;
            }
            returning += `\n\n`;
            if(theEffect[0] != 'me') {
                returning += 'The opposing ';
            }
            if(theEffect[1] == 'remove') {
                Caught.resetEffects(target);
                returning += `${target.nickname} was cured of all of its afflictions!`;
            } else {
                Caught.effect(target, theEffect[1], (theEffect[0] == 'me' ? otherSelected : playerSelected));
                returning += `${target.nickname} was inflicted with ${theEffect[1]}.`;
            }
        }
    }
    return returning;
}

module.exports = execute;