const Effect = require('../classes/cls_effect');

const effects = {
    'burned': new Effect((user, other) => {}, (user, Caught) => {
        return [0, ''];
    }, (user, other, Caught) => {
        Caught.takeDamage(user, Math.floor(user.stats[5] / 8));
        return `\n${user.nickname} took ${Math.floor(user.stats[5] / 8)} damage from their burn.`;
    }, user => {}, false), 

    'paralyzed': new Effect((user, other) => {}, (user, Caught) => {
        return [25, `*${user.nickname} is paralyzed and may not be able to attack!*\n`];
    }, (user, other, Caught) => {
        return '';
    }, user => {}, false), 

    'poisoned': new Effect((user, other) => {
        user.effectOptions.poisonedvalue = 0;
    }, (user, Caught) => {
        return [0, ''];
    }, (user, other, Caught) => {
        user.effectOptions.poisonedvalue += 0.0625;
        if(user.effectOptions.poisonedvalue > 1) {
            user.effectOptions.poisonedvalue = 1;
        }
        Caught.takeDamage(user, Math.floor(user.stats[5] * user.effectOptions.poisonedvalue));
        return `\n${user.nickname} took ${Math.floor(user.stats[5] * user.effectOptions.poisonedvalue)} poison damage.`;
    }, user => {
        user.effectOptions.poisonedvalue = undefined;
    }, false), 

    'asleep': new Effect((user, other) => {
        user.effectOptions.sleepcounter = Math.floor(Math.random() * 3) + 1;
    }, (user, Caught) => {
        user.effectOptions.sleepcounter--;
        if(user.effectOptions.sleepcounter == 0) {
            Caught.removeEffect(user, 'asleep');
            return [0, `*${user.nickname} woke up!*\n`];
        }
        return [100, `*${user.nickname} is still asleep...*\n`];
    }, (user, other, Caught) => {
        return '';
    }, user => {
        user.effectOptions.sleepcounter = undefined;
    }, false), 

    'confused': new Effect((user, other) => {
        user.effectOptions.confusedcounter = Math.floor(Math.random() * 4) + 2;
    }, (user, Caught) => {
        user.effectOptions.confusedcounter--;
        if(user.effectOptions.confusedcounter == 0) {
            Caught.removeEffect(user, 'confused');
            return [0, `*${user.nickname} snapped out of its confusion!*\n`];
        }
        if(Math.random() < 0.33) {
            Caught.takeDamage(user, Math.floor(user.stats[5] / 6));
            return [100, `*${user.nickname} hurt itself in its confusion!*\n`];
        }
        return [0, `*${user.nickname} was not affected by its confusion...*\n`];    
    }, (user, other, Caught) => {
        return '';
    }, user => {
        user.effectOptions.confusedcounter = undefined;
    }, false), 

    'leech seed': new Effect((user, other) => {
        user.effectOptions.leecher = other._base;
    }, (user, Caught) => {
        return [0, ''];
    }, (user, other, Caught) => {
        if(other._base == user.effectOptions.leecher) {
            Caught.takeDamage(user, Math.floor(user.stats[5] / 8));
            Caught.takeDamage(other, -1 * Math.floor(user.stats[5] / 8));
            return `\nThe opposing ${other.nickname} leeched ${Math.floor(user.stats[5] / 8)} damage from ${user.nickname}.`;
        }
        return '';
    }, user => {
        user.effectOptions.leecher = undefined;
    }, true), 

    'frozen': new Effect((user, other) => {}, (user, Caught) => {
        if(Math.random() < .2) {
            Caught.removeEffect(user, 'frozen');
            return [0, `*${user.nickname} thawed out!*\n`];
        }
        return [100, `*${user.nickname} is frozen and cannot move!*\n`];
    }, (user, other, Caught) => {
        return '';
    }, user => {}, false)
};

module.exports = effects;