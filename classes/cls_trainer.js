const Caught = require("./cls_caught");
const TrainerProto = require('./cls_trainerproto');
const trainers = require('../lists+constants/trainers');

class Trainer {
    constructor(_trainer, _index) {
        this.index = _index;
        this.caught = [];
        for(let i = 0; i < _trainer.caught.length; i++) {
            this.caught.push(new Caught(_trainer.caught[i]));
        }
        this.equipped = 0;
        this.inventory = _trainer.inventory;
        this.amounts = _trainer.amounts;
    }

    equip(index) {
        this.equipped = index;
    }
    
    loseItem(item) {
        const index = this.inventory.indexOf(item);
        if(index != -1) {
            this.amounts[index]--;
            if(this.amounts[index] < 1) {
                this.inventory.splice(index, 1);
                this.amounts.splice(index, 1);
            }
        }
    }
}

module.exports = Trainer;