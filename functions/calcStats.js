const execute = (base, level, ivs, evs) => {
    let returning = [];
    for(let i = 0; i < 5; i++) {
        returning.push(Math.floor(((((2 * base.stats[i]) + ivs[i] + (evs[i] / 4)) * level) / 100) + 5));
    }
    returning.push(Math.floor(((((2 * base.stats[5]) + ivs[5] + (evs[5] / 4)) * level) / 100) + level + 10));
    return returning;
}

module.exports = execute;