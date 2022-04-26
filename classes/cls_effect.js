class Effect {
    constructor(_begin, _turnStart, _turnEnd, _stop, _removeOnEndOfCombat) {
        this.begin = _begin;
        this.turnStart = _turnStart;
        this.turnEnd = _turnEnd;
        this.stop = _stop;
        this.removeOnEndOfCombat = _removeOnEndOfCombat;
    }
}

module.exports = Effect;