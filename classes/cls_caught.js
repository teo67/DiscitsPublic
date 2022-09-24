const getRequired = require('../functions/getRequired');
const calcStats = require('../functions/calcStats');
const effects = require('../lists+constants/effects');
const attacks = require('../lists+constants/attacks');
const discits = require('../lists+constants/discits');

/*
    this is a confusing class
    objects that are stored locally will have an extra getter that returns 'wild'
    some objects (caughts stored under player profiles) are stored on servers and therefore static methods must be implemented
    the constructor is still here, as caughts are created like any other class-based object
*/

class Caught {
    constructor(_caught) {
        this._base = _caught.base;
        this.level = _caught.level;
        this.currentXP = getRequired(this.level, discits[this._base].levelSpeed);
        this.moveSet = ['Empty', 'Empty', 'Empty', 'Empty'];
        this.PPSet = [0, 0, 0, 0];
        for(let i = 0; i < _caught.moveSet.length; i++) {
            this.moveSet[i] = _caught.moveSet[i];
            this.PPSet[i] = attacks[_caught.moveSet[i]].PP;
        }
        this.fullMoves = [];
        for(let i = 0; i < discits[this._base].moveList.length && discits[this._base].moveList[i][1] <= this.level; i++) {
            this.fullMoves.push(discits[this._base].moveList[i][0]);
        }
        
        this.nickname = this._base;

        this.tempstats = [0, 0, 0, 0, 0, 0, 0]; // atk, dfns, spec atk, spec dfns, speed, evasiveness, accuracy
        this.effects = [];
        this.effectOptions = {};

        // for evs and ivs: atk, dfns, spec atk, spec dfns, speed, hp
        this.IVs = [Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), Math.floor(Math.random() * 32)];
        this.EVs = [0, 0, 0, 0, 0, 0];

        this.stats = calcStats(discits[this._base], this.level, this.IVs, this.EVs);

        this.temphp = this.stats[5];
    }

    static gainXP(me, gained) {
        let returning = `\n\n${me.nickname} gained ${gained} experience!`;
        me.currentXP += parseInt(gained);
        let required = getRequired(me.level + 1, discits[me._base].levelSpeed);
        while(me.currentXP >= required) {
            returning += `\n\nLevel up! ${me.nickname} is now level ${me.level + 1}.`

            const oldStats = me.stats;
            me.level++;
            me.stats = calcStats(discits[me._base], me.level, me.IVs, me.EVs);

            returning += `\nStat increases:\nATK ${oldStats[0]} --> ${me.stats[0]}, DFNS ${oldStats[1]} --> ${me.stats[1]}`;
            returning += `\nSpec. ATK ${oldStats[2]} --> ${me.stats[2]}, Spec. DFNS ${oldStats[3]} --> ${me.stats[3]}`;
            returning += `\nSpeed ${oldStats[4]} --> ${me.stats[4]}, HP ${oldStats[5]} --> ${me.stats[5]}`

            for(let i = 0; i < discits[me._base].moveList.length; i++) {
                if(discits[me._base].moveList[i][1] == me.level) {
                    returning += `\n\n${me.nickname} learned ${discits[me._base].moveList[i][0]}! You can use commands such as 'allmoves' and 'moves' to organize your equipped attacks before battle.`;
                    me.fullMoves.push(discits[me._base].moveList[i][0]);
                }
            }
            if(discits[me._base].evolution[1] <= me.level) {
                returning += `\n\n${me.nickname} is evolving! ... ... **Your ${me._base} evolved into a ${discits[me._base].evolution[0]}!**`;
                if(me.nickname == me._base) {
                    me.nickname = discits[me._base].evolution[0];
                }
                me._base = discits[me._base].evolution[0];
                me.stats = calcStats(discits[me._base], me.level, me.IVs, me.EVs);
            }
            required = getRequired(me.level + 1, discits[me._base].levelSpeed);
        }
        return returning;
    }

    static setBase(me, newBase) {
        me._base = newBase;
        me.stats = calcStats(discits[me._base], me.level, me.IVs, me.EVs);
    }

    static setStats(me, newStats) {
        me.stats = newStats;
    }

    static setNickname(me, newName) {
        me.nickname = newName;
    }

    static setMove(me, newIndex, replaced) {
        me.moveSet[replaced] = me.fullMoves[newIndex];
        me.PPSet[replaced] = attacks[me.fullMoves[newIndex]].PP;
    }

    static useMove(me, index) {
        me.PPSet[index]--;
        if(me.PPSet[index] < 0) {
            me.PPSet[index] = 0;
        }
    }

    static takeDamage(me, dmg) {
        me.temphp -= dmg;
        if(me.temphp < 0) {
            me.temphp = 0;
            return;
        }
        if(me.temphp > me.stats[5]) {
            me.temphp = me.stats[5];
        }
    }

    static reset(me) {
        me.tempstats = [0, 0, 0, 0, 0, 0, 0];
        for(let i = 0; i < me.effects.length; i++) {
            if(effects[me.effects[i]].removeOnEndOfCombat) {
                effects[me.effects[i]].stop(me);
                me.effects.splice(i, 1);
            }
        }
    }

    static resetEffects(me) {
        for(const effect of me.effects) {
            effects[effect].stop(me);
        }
        me.effects = [];
    }

    static statChange(me, index, modifier) {
        //atk, dfns, spec atk, spec dfns, speed, evasiveness, accuracy.
        me.tempstats[index] += modifier;
        if(me.tempstats[index] < -6) {
            me.tempstats[index] = -6;
        } else if(me.tempstats[index] > 6) {
            me.tempstats[index] = 6;
        }
    }

    static effect(me, effect, other) {
        me.effects.push(effect);
        effects[effect].begin(me, other);
    }

    static removeEffect(me, effect) {
        const index = me.effects.indexOf(effect);
        if(index != -1) {
            effects[effect].stop(me);
            me.effects.splice(index, 1);
        }
    }

    static restorePP(me) {
        for(let i = 0; i < me.moveSet.length; i++) {
            if(me.moveSet[i] != 'Empty') {
                me.PPSet[i] = attacks[me.moveSet[i]].PP;
            }
        }
    }

    static gainEVs(me, list) {
        let sum = me.EVs[0] + me.EVs[1] + me.EVs[2] + me.EVs[3] + me.EVs[4] + me.EVs[5];
        for(let i = 0; i < me.EVs.length; i++) {
            for(let j = 0; j < list[i]; j++) {
                if(sum < 510 && me.EVs[i] < 252) {
                    me.EVs[i]++;
                    sum = me.EVs[0] + me.EVs[1] + me.EVs[2] + me.EVs[3] + me.EVs[4] + me.EVs[5];
                }
            }
        }
    }
}

module.exports = Caught;