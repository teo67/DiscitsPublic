const attack = require('./attack');
const effects = require('../../lists+constants/effects');
const items = require('../../lists+constants/items');
const User = require('../../classes/cls_user');
const tag = require('../tag');
const Caught = require('../../classes/cls_caught');
const trainers = require('../../lists+constants/trainers');

const execute = (userA, userB, resultA, participated) => {
    let selectedA = (tag(userA) == 'wild' ? userA : userA.caught[userA.equipped]); // caught objects - we have to redefine in case someone switched
    let selectedB = (tag(userB) == 'wild' ? userB : userB.caught[userB.equipped]);
    let returning = '';
    let itemReturned = ['', false];
    if(resultA[0] == 1) {
        returning += attack(userA, selectedA, selectedB, resultA[1]);
    } else if(resultA[0] == 2) {
        if(tag(userA) == 'trainer') {
            if(userA.equipped == resultA[1] - 1) {
                returning += `${trainers[userA.index].name} stayed put!`;
            } else {
                userA.equip(resultA[1] - 1);
                returning += `${trainers[userA.index].name} switched to ${userA.caught[userA.equipped].nickname}!`;
            }
        } else if(tag(userA) == 'wild') {
            returning += `The wild ${userA._base} stayed put!`;
        } else {
            if(userA.equipped == userA._party[resultA[1] - 1]) {
                returning += `<@${userA._id}> stayed put!`;
            } else {
                if(!participated.includes(resultA[1] - 1)) {
                    participated.push(resultA[1] - 1);
                }
                User.equip(userA, userA._party[resultA[1] - 1]);
                returning += `<@${userA._id}> switched to ${userA.caught[userA.equipped].nickname}!`;
            }
        }                    
    } else { // resultA[0] == 3
        const theItem = userA.inventory[resultA[1] - 1];
        if(items[theItem].condition(userA, userB, resultA[2] - 1, true)) {
            if(tag(userA) == 'trainer') {
                userA.loseItem(theItem);
            } else {
                User.loseItem(userA, theItem);
            }
            itemReturned = items[theItem].func(userA, userB, resultA[2] - 1);
            returning += `${(tag(userA) == 'trainer' ? trainers[userA.index].name : `<@${userA._id}>`)} used a ${theItem}!\n${itemReturned[0]}`;
        } else {
            returning += `${(tag(userA) == 'trainer' ? trainers[userA.index].name : `<@${userA._id}>`)} tried to use a ${theItem}, but it failed!`;
        }
    }
    if(selectedA.temphp < 1 || selectedB.temphp < 1 || itemReturned[1]) {
        return [returning, itemReturned[1]];
    }
    for(const effect of selectedA.effects) {
        returning += effects[effect].turnEnd(selectedA, selectedB, Caught);
    }
    return [returning, itemReturned[1]];
}

module.exports = execute;