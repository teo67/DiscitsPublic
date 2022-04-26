const map = require('../lists+constants/map');
const calcStats = require('../functions/calcStats');
const discits = require('../lists+constants/discits');
const Caught = require('./cls_caught');

class User {
    constructor(id) {
        this._id = id; 
        this.coins = 0; 
        this.caught = [];
        this.discidex = [];
        this.equipped = -1;
        this._party = [-1, -1, -1, -1, -1, -1];
        this.inventory = [];
        this.amounts = [];
        this.location = [154, 159];
        this.namedLocation = 'Discit Station';
        this.sequenceProgression = 0;
        this.blacklist = [];
        this.trainerBlacklist = [];
        this.wasText = true;
        this.progression = 0;
        this.respawnPoint = [154, 159];
        this.findRate = 25;
        this.battle = undefined;
        this.cds = undefined;
    }

    static party(me, index) {
        if(me._party[index] == -1) {
            return null;
        }
        return me.caught[me._party[index]];
    }

    static respawn(me) {
        me.location[0] = me.respawnPoint[0];
        me.location[1] = me.respawnPoint[1];
        me.namedLocation = 'Discit Station';
    }
        
    static makeProgress(me) {
        me.progression++;
    }
    
    static getCoins(me, amount) {
        me.coins += amount;
    }

    static loseCoins(me, amount) {
        me.coins -= amount;
        if(me.coins < 0) {
            me.coins = 0;
        }
    }

    static newCatch(me, discit) {
        me.caught.push(discit);
        if(!me.discidex.includes(discit._base)) {
            me.discidex.push(discit._base);
        }
    }

    static equip(me, index) {
        me.equipped = index;
    }

    static partySelect(me, index, replacing) {
        Caught.takeDamage(me.caught[index], me.caught[index].temphp - me.caught[index].stats[5]);
        if(User.party(me, replacing)) {
            Caught.takeDamage(User.party(me, replacing), User.party(me, replacing).temphp - User.party(me, replacing).stats[5]);
        }
        me._party[replacing] = index;
    }

    static reviveAll(me) {
        for(let i = 0; i < me.caught.length; i++) {
            Caught.takeDamage(me.caught[i], me.caught[i].temphp - me.caught[i].stats[5]);
            Caught.restorePP(me.caught[i]);
            Caught.reset(me.caught[i]);
            Caught.resetEffects(me.caught[i]);
        }
    }

    static recalcAll(me) {
        for(let i = 0; i < me._party.length; i++) {
            if(me._party[i] != -1) {
                Caught.setStats(User.party(me, i), calcStats(discits[User.party(me, i)._base], User.party(me, i).level, User.party(me, i).IVs, User.party(me, i).EVs));
            }
        }
    }

    static gainItem(me, item, amount) {
        const index = me.inventory.indexOf(item);
        if(index != -1) {
            me.amounts[index] += amount;
        } else {
            me.inventory.push(item);
            me.amounts.push(amount);
        }
    }

    static loseItem(me, item, amount = 1) {
        const index = me.inventory.indexOf(item);
        if(index != -1) {
            me.amounts[index] -= amount;
            if(me.amounts[index] < 1) {
                me.inventory.splice(index, 1);
                me.amounts.splice(index, 1);
            }
        }
    }

    static move(me, input, triggerTiles) {
        const hitboxes = [3, 5, 6, 7, 9, 10, 11]; // 0 => faulty input, 1 => normal move, 2 => wild encounter, 3 => trainer encounter, anything else => trigger encounter
        if(!me.wasText) {
            //console.log('moved');
            if(input === '⬅️' && !hitboxes.includes(map[me.location[1]][me.location[0] - 1])) {
                me.location[0]--;
            } else if(input === '⬇️' && !hitboxes.includes(map[me.location[1] + 1][me.location[0]])) {
                me.location[1]++;
            } else if(input === '⬆️' && !hitboxes.includes(map[me.location[1] - 1][me.location[0]])) {
                me.location[1]--;
            } else if(input === '➡️' && !hitboxes.includes(map[me.location[1]][me.location[0] + 1])) {
                me.location[0]++;
            } else {
                return 0;
            }
        }

        for(let i = 0; i < triggerTiles.length; i++) {
            for(let j = 0; j < triggerTiles[i].location.length; j++) {
                if(triggerTiles[i].location[j][0] == me.location[0] && triggerTiles[i].location[j][1] == me.location[1]) {
                    if(me.blacklist.includes(i)) {
                        me.wasText = false;
                        me.sequenceProgression = -1;
                        return 0;
                    } else {
                        if(input != ''/* || me.progression == 0*/) {
                            me.sequenceProgression++;
                        }
                        if(me.sequenceProgression >= triggerTiles[i].text.length) {
                            me.wasText = false;
                            me.sequenceProgression = -1;
                            triggerTiles[i].func(me, i, User); // to avoid circular dependancy, god i hate these static methods
                        } else {
                            me.wasText = true;
                            return triggerTiles[i].text[me.sequenceProgression];
                        }
                    }
                }
            }
        }
        const random = Math.floor(Math.random() * 180) + 1;
        
        if(me.namedLocation.startsWith('Route ') && map[me.location[1]][me.location[0]] == 2 && random <= me.findRate) {
            return 2;
        }
        if(map[me.location[1]][me.location[0]] == 8) {
            return 3;
        }
        return 0; // edit: remove return 1 (redundancy issue)
    }

    static setLocation(me, input) {
        me.namedLocation = input;
        if(input == 'Discit Station') {
            me.findRate = 25;
        }
    }

    static setRespawn(me) {
        me.respawnPoint[0] = me.location[0];
        me.respawnPoint[1] = me.location[1];
    }

    static setCoords(me, x, y) {
        me.location[0] = x;
        me.location[1] = y;
    }

    static blacklistTrigger(me, index) {
        if(!me.blacklist.includes(index)) {
            me.blacklist.push(index);
        }
    }

    static blacklistTrainer(me, name) {
        if(!me.trainerBlacklist.includes(name)) {
            me.trainerBlacklist.push(name);
        }
    }
    
    static increaseRate(me) {
        me.findRate += 25;
    }
}

module.exports = User;