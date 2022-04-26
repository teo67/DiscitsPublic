const oneTurn = require('./oneTurn');
const STATCHANGES = require('../../lists+constants/fundamentals').STATCHANGES;
const attacks = require('../../lists+constants/attacks');
const tag = require('../tag');

const execute = (p1, p2, resultA, resultB, p1participated, p2participated, mustSwap) => {
    let selectedA = p1.caught[p1.equipped];
    let selectedB = (tag(p2) == 'wild' ? p2 : p2.caught[p2.equipped]);
    let p1priority = (resultA[0] == 1 ? attacks[selectedA.moveSet[resultB[1] - 1]].priority : 10);
    let p2priority = (resultB[0] == 1 ? attacks[selectedB.moveSet[resultB[1] - 1]].priority : 10);
    const speedA = selectedA.stats[4] * STATCHANGES[selectedA.tempstats[4] + 6] * (selectedA.effects.includes('paralyzed') ? 0.5 : 1);
    const speedB = selectedB.stats[4] * STATCHANGES[selectedB.tempstats[4] + 6] * (selectedB.effects.includes('paralyzed') ? 0.5 : 1);

    let returning = [null, null];

    const isOver = () => {
        return (!mustSwap) && (p1.caught[p1.equipped].temphp < 1 || (tag(p2) == 'wild' ? p2 : p2.caught[p2.equipped]).temphp < 1);
    }

    if(p2priority < p1priority || (p2priority == p1priority && speedB < speedA) || (p2priority == p1priority && speedB == speedA && Math.random() > 0.5)) {
        let returned = oneTurn(p1, p2, resultA, p1participated);
        returning[0] = returned[0]; // p1 goes first
        if(isOver() || returned[1]) {
            return [returning, returned[1]];
        }
        returned = oneTurn(p2, p1, resultB, p2participated);
        returning[1] = returned[0];
        return [returning, returned[1]];
    }
    let returned = oneTurn(p2, p1, resultB, p2participated);
    returning[0] = returned[0]; // p2 goes first
    if(isOver() || returned[1]) {
        return [returning, returned[1]];
    }
    returned = oneTurn(p1, p2, resultA, p1participated);
    returning[1] = returned[0];
    return [returning, returned[1]];
}

module.exports = execute;