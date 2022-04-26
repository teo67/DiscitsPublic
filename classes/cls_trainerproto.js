class TrainerProto {
    constructor(_name, _greeting, _caught, _money, _triggers, _inventory, _amounts, _AI) {
        this.name = _name;
        this.greeting = _greeting; 
        this.caught = _caught;
        this.money = _money;
        this.triggers = _triggers;
        this.inventory = _inventory;
        this.amounts = _amounts;
        this.AI = _AI;
    }
}

module.exports = TrainerProto;