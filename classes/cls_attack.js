class Attack {
    constructor(_element, _PP, _dmg, _accuracy, _statChanges, _effects, _special, _priority) {
        this.element = _element;
        this.PP = _PP;
        this.dmg = _dmg;
        this.accuracy = _accuracy;
        this.statChanges = _statChanges;
        this.effects = _effects;
        this.special = _special;
        this.priority = _priority;
    }
}

module.exports = Attack;