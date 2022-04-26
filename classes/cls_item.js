class Item {
    constructor(_condition, _func, _requiresTarget, _description, _price) {
        this.condition = _condition;
        this.func = _func;
        this.requiresTarget = _requiresTarget;
        this.description = _description;
        this.price = _price;
    }
}

module.exports = Item;