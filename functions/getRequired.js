const execute = (level, speed) => {
    if(speed == 'slow') {
        return Math.round((5 * (level ** 3)) / 4);
    }
    if(speed == 'medium slow') {
        return Math.round((6 / 5) * (level ** 3) - (15 * (level ** 2)) + (100 * level) - 140);
    }
    if(speed == 'medium fast') {
        return Math.round(level ** 3);
    }
    if(speed == 'fast') {
        return Math.round((4 * (level ** 3)) / 5);
    }
    return 'error';
}

module.exports = execute;