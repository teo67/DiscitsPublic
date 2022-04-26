const getResults = require('./getResults');

const execute = async (p1, p1Discord, p2, p2Discord, mustSwap) => {
    try {
        return await Promise.all([getResults(1, p1, p1Discord, p2, true, mustSwap), getResults(2, p2, p2Discord, p1, true, mustSwap)]);
    } catch(lost) {
        return Promise.reject(lost);
    }
}

module.exports = execute;